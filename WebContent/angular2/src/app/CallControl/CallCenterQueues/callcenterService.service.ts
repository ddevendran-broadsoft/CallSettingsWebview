/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { CallCenterServiceInput } from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';
import { CallCenterArray } from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';

@Injectable()

export class CallCenterService {
    customizedTextJson = window['customizedTexts'];
    private res: Response;
    private headers: Headers = new Headers();
    callCenterArray: CallCenterArray[];

    constructor(private httpservices: HttpServices, private callcenterServiceInput: CallCenterServiceInput) { }

    getCallCenterService(ccUrl, postCCGet) {
        this.httpservices.httpGetRequest(ccUrl)
            .subscribe((res) => {
                var ccParsedJson = res.json();
                if(ccParsedJson["CallCenter"]["agentACDState"]){
                var acdStateInput = ccParsedJson["CallCenter"]["agentACDState"]["$"];

                if (acdStateInput == "Sign-In") {
                    acdStateInput = this.customizedTextJson.callcenter.sign_in;
                }
                else if (acdStateInput == "Sign-Out") {
                    acdStateInput = this.customizedTextJson.callcenter.sign_out;
                }
                else if (acdStateInput == "Wrap-Up") {
                    acdStateInput = this.customizedTextJson.callcenter.wrap_up;
                } else if (acdStateInput == "Available") {
                    acdStateInput = this.customizedTextJson.callcenter.available;
                } else if (acdStateInput == "Unavailable") {
                    acdStateInput = this.customizedTextJson.callcenter.unavailable;
                }

                this.callcenterServiceInput.setAcdState(acdStateInput);
                } else {
                    this.callcenterServiceInput.setAcdState("");
                }
                this.callcenterServiceInput.setCallcenter(ccParsedJson);
                  if (ccParsedJson.CallCenter.agentUnavailableCode) {
                this.callcenterServiceInput.setSelectedUnavailableCode(ccParsedJson.CallCenter.agentUnavailableCode.$);
                  } else {
                      this.callcenterServiceInput.setSelectedUnavailableCode(null);
                  }
                postCCGet(null);
            }, (err) => {
                postCCGet(err);
            })
    }

    getUnavailableCodes(unavailableCodeUrl, postUCget) {

        this.httpservices.httpGetRequest(unavailableCodeUrl)
            .subscribe((res) => {
                var ucParsedJson = (res.json());
                this.callcenterServiceInput.setIsUCenabled(ucParsedJson.ACDAgentUnavailableCodes.enableAgentUnavailableCodes.$ == "true");

                if (this.callcenterServiceInput.getIsUCenabled()) {
                    this.callcenterServiceInput.setUnavailableCodeArray(ucParsedJson);
                }

                postUCget(null);
            }, (err) => {
                postUCget(err);
            })

    }

    getCallCenterName(ccNameUrl, index, postCCnameGet) {
        this.httpservices.httpGetRequest(ccNameUrl)
            .subscribe((res) => {
                var ccNameParsedJson = (res.json());
                this.callcenterServiceInput.setCallCenterName(ccNameParsedJson.ACDProfile.serviceInstanceProfile.name.$, index);

                postCCnameGet(null);
            }, (err) => {
                postCCnameGet(err);
            })

    }

    putAcdState(callCenterUrl, acdState, isUnavailableStateSet, isUCenabled, unavailableCode, postAcdStatePut) {
        var body = '<?xml version="1.0" encoding="UTF-8"?><CallCenter xmlns="http://schema.broadsoft.com/xsi">';

        var acd;

        if (acdState == this.customizedTextJson.callcenter.sign_in) {
            acd = "Sign-In";
        }
        else if (acdState == this.customizedTextJson.callcenter.sign_out) {
            acd = "Sign-Out";
        }
        else if (acdState == this.customizedTextJson.callcenter.wrap_up) {
            acd = "Wrap-Up";
        } else if (acdState == this.customizedTextJson.callcenter.available) {
            acd = "Available";
        } else if (acdState == this.customizedTextJson.callcenter.unavailable) {
            acd = "Unavailable";
        } 

        body = body + '<agentACDState>' + acd + '</agentACDState>';

        if (isUnavailableStateSet && isUCenabled) {

            body = body + '<agentUnavailableCode>' + unavailableCode + '</agentUnavailableCode>'
        }

        body = body + '</CallCenter>'

        this.httpservices.httpPutRequest(callCenterUrl, body)
            .subscribe((res) => {
                this.callcenterServiceInput.setAcdState(acdState);
                this.callcenterServiceInput.setSelectedUnavailableCode(unavailableCode);
                postAcdStatePut(null);
            }, (err) => {
                postAcdStatePut(err);
            });
    }


    putCCData(callCenterUrl, ccElement, postCCput) {

        var body = '<?xml version="1.0" encoding="UTF-8"?><CallCenter xmlns="http://schema.broadsoft.com/xsi"><callCenterList><callCenterDetails><serviceUserId>';

        body = body + ccElement.callCenterId + '</serviceUserId><available>' + ccElement.active + '</available></callCenterDetails></callCenterList></CallCenter>';

        this.httpservices.httpPutRequest(callCenterUrl, body)
            .subscribe((res) => {
                postCCput(null);
            }, (err) => {
                            ccElement.setCallCenterActive(!ccElement.getCallCenterActive());
                postCCput(err);
            });


    }



    fetchCCAcdState() {

        return this.callcenterServiceInput.getAcdState();
    }

    fetchIsCCIdAvailable() {
        return this.callcenterServiceInput.getCCIdAvailable();
    }
}