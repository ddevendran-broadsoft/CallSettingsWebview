/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { IncomingComponent } from 'app/IncomingCalls/incoming.component'
import { SimultaneousRingServiceInput } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';

@Injectable()
export class SimultaneousRingService {
    private url = 'http://localhost:8081/BWWebProxy/proxy';
    private res: Response;
    private headers: Headers = new Headers();
    private map: Map<Number, Boolean> = new Map<Number, Boolean>();
    private isDoNotRingWhenOnCallChecked = false;
    private simRingArray = [];
    i = 0;

    constructor(private httpservices: HttpServices, private http: Http,
      private simultaneousRingServiceInput: SimultaneousRingServiceInput) {

    }



    getSimultaneousRingService(SimultaneousRingUrl, postSimultaneousRingGet) {

        this.httpservices.httpGetRequest(SimultaneousRingUrl)
            .subscribe((res) => {
                // console.log('SimultaneousRing Response Data debug: ', res.json());
                let simultaneousRingParsedJson = res.json();
                this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(simultaneousRingParsedJson
                  ['SimultaneousRingPersonal']['incomingCalls']['$'] === 'Do not Ring if on a Call');
                this.simultaneousRingServiceInput.setIsSimultaneousRingActive(simultaneousRingParsedJson
                  ['SimultaneousRingPersonal']['active']['$'] === 'true');
                this.simultaneousRingServiceInput.setSimRingArrayInit(simultaneousRingParsedJson);
                this.simultaneousRingServiceInput.setCriteriaArrayInit(simultaneousRingParsedJson);
                postSimultaneousRingGet(simultaneousRingParsedJson);
            }, (err) => {
                console.log('Error getting the values in Simultaneous Ring.');
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

        let doNotRingValue = 'Ring for all Incoming Calls';
        if (this.fetchIsDoNotRingWhenOnCallChecked()) {
            doNotRingValue = 'Do not Ring if on a Call';
        }

        let body = '<?xml version="1.0" encoding="UTF-8"?><SimultaneousRingPersonal xmlns="http://schema.broadsoft.com/xsi"><active>' +
          this.fetchIsSimultaneousRingActive() + '</active>';
        body += '<incomingCalls>' + doNotRingValue + '</incomingCalls>';

        switch (choiceFlag) {
            case 1:    if (this.fetchSimRingArray) {
                        let simRingLocationXml = '';
                        this.fetchSimRingArray().forEach(element => {
                            if (element.getNumber().trim()) {
                                simRingLocationXml += '<simRingLocation><address>' + element.getNumber() +
                                  '</address><answerConfirmationRequired>' + element.getIsAnswerConfirmationRequired() +
                                  '</answerConfirmationRequired></simRingLocation>';
                            }
                        });

                        if (simRingLocationXml) {
                            body += '<simRingLocations>' + simRingLocationXml + '</simRingLocations>';
                        } else {
                            body += '<simRingLocations xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
                        }

                       }
                       break;
            case 2:    body += '<criteriaActivationList>';
                       if (this.fetchCriteriaArray()) {
                        this.fetchCriteriaArray().forEach(element => {
                        body += '<criteriaActivation><criteriaName>' + element.getName() + '</criteriaName><active>' +
                          element.getIsActive() + '</active><uri>' + element.getUri() + '</uri></criteriaActivation>'
                      });
                      }
                      body += '</criteriaActivationList>'
                      break;
      }
        body += '</SimultaneousRingPersonal>'
        return body;
    }

    sendSimultaneousRingPut(SimultaneousRingUrl, postSimultaneousRingPut, choiceFlag: number) {

        let body = this.constructSimulataneousRingBody(choiceFlag);
        // console.log("The body sent to the XSI is: ",body);
        this.httpservices.httpPutRequest(SimultaneousRingUrl, body)
            .subscribe((res) => {
                postSimultaneousRingPut(res)
            }, (err) => {
                postSimultaneousRingPut(err);
            })

    }


    private handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            errMsg = JSON.parse(JSON.stringify(error));
        }
        console.log('Err code: ' + errMsg['status'] + ' Err Text:' + errMsg['statusText']);
        return Observable.throw(errMsg || 'Internal Server Error');

    }

}
