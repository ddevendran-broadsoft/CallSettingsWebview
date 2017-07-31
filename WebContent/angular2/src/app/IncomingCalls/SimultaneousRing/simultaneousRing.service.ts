/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { incomingComponent } from 'app/IncomingCalls/incoming.component'
import { SimultaneousRingServiceInput } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';

@Injectable()
export class SimultaneousRingService {
    private url: string = 'http://localhost:8081/BWWebProxy/proxy';
    private res: Response;
    private headers: Headers = new Headers();
    private map: Map<Number, Boolean> = new Map<Number, Boolean>();

    constructor(private httpservices: HttpServices, private http: Http, private simultaneousRingServiceInput: SimultaneousRingServiceInput) {

    }



    getSimultaneousRingService(SimultaneousRingUrl, postSimultaneousRingGet) {

        this.httpservices.httpGetRequest(SimultaneousRingUrl)
            .subscribe((res) => {
                var simultaneousRingParsedJson = res.json();
                this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(simultaneousRingParsedJson["SimultaneousRingPersonal"]["incomingCalls"]["$"] == "Do not Ring if on a Call");
                this.simultaneousRingServiceInput.setIsSimultaneousRingActive(simultaneousRingParsedJson["SimultaneousRingPersonal"]["active"]["$"] == "true");
                this.simultaneousRingServiceInput.setSimRingArrayInit(simultaneousRingParsedJson);
                this.simultaneousRingServiceInput.setCriteriaArrayInit(simultaneousRingParsedJson);
                postSimultaneousRingGet(simultaneousRingParsedJson);
            }, (err) => {
                postSimultaneousRingGet(null);
            });
    }

    fetchIsSimultaneousRingActive() {
        return (this.simultaneousRingServiceInput.getIsSimultaneousRingActive());

    }

    fetchIsDoNotRingWhenOnCallChecked() {
        return (this.simultaneousRingServiceInput.getIsDoNotRingWhenOnCallChecked());
    }

    fetchSimRingArray() {
        return (this.simultaneousRingServiceInput.getSimRingArray());
    }

    fetchCriteriaArray() {
        return (this.simultaneousRingServiceInput.getCriteriaArray());
    }

    constructSimulataneousRingBody(choiceFlag: number) {

        var doNotRingValue = 'Ring for all Incoming Calls';
        if (this.fetchIsDoNotRingWhenOnCallChecked()) {
            doNotRingValue = 'Do not Ring if on a Call';
        }

        var body = '<?xml version="1.0" encoding="UTF-8"?><SimultaneousRingPersonal xmlns="http://schema.broadsoft.com/xsi"><active>' + this.fetchIsSimultaneousRingActive() + '</active>';
        body += '<incomingCalls>' + doNotRingValue + '</incomingCalls>';

        switch (choiceFlag) {
            case 1: if (this.fetchSimRingArray()) {
                let simRingLocationXml = "";
                this.fetchSimRingArray().forEach(element => {
                    if (element.getNumber().trim()) {
                        simRingLocationXml += '<simRingLocation><address>' + element.getNumber() + '</address><answerConfirmationRequired>' + element.getIsAnswerConfirmationRequired() + '</answerConfirmationRequired></simRingLocation>';
                    }
                });

                if (simRingLocationXml) {
                    body += '<simRingLocations>' + simRingLocationXml + '</simRingLocations>';
                } else {
                    body += '<simRingLocations xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
                }

            }
                break;
            case 2: body += '<criteriaActivationList>';
                if (this.fetchCriteriaArray()) {
                    this.fetchCriteriaArray().forEach(element => {
                        body += '<criteriaActivation><criteriaName>' + element.getName() + '</criteriaName><active>' + element.getIsActive() + '</active><uri>' + element.getUri() + '</uri></criteriaActivation>'
                    });
                }
                body += '</criteriaActivationList>'
                break;
        }
        body += '</SimultaneousRingPersonal>'
        return body;
    }

    sendSimultaneousRingPut(SimultaneousRingUrl, postSimultaneousRingPut, choiceFlag: number) {

        var body = this.constructSimulataneousRingBody(choiceFlag);
        this.httpservices.httpPutRequest(SimultaneousRingUrl, body)
            .subscribe((res) => {
                postSimultaneousRingPut(res)
            }, (err) => {
                postSimultaneousRingPut(err);
            })

    }
}
