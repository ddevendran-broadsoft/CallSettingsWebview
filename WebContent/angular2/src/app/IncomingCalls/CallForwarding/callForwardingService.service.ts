/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/throw';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { CallForwardingServiceInput } from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';

@Injectable()

export class CallForwardingService {
    private url: string = 'http://localhost:8081/BWWebProxy/proxy';
    private res: Response;
    private headers: Headers = new Headers();

    constructor(private httpservices: HttpServices, private callForwardingServiceInput: CallForwardingServiceInput) { }

    getCallForwardingAlwaysService(cfaUrl, postCFAGet) {

        this.httpservices.httpGetRequest(cfaUrl)
            .subscribe((res) => {

                var cfaParsedJson = res.json();
                this.callForwardingServiceInput.setIsCallForwardingAlwaysChecked((cfaParsedJson["CallForwardingAlways"]["active"]["$"] == "true"));

                if (cfaParsedJson["CallForwardingAlways"]["forwardToPhoneNumber"]) {
                    this.callForwardingServiceInput.setCallForwardingAlwaysNumber(cfaParsedJson["CallForwardingAlways"]["forwardToPhoneNumber"]["$"]);
                }
                if (this.callForwardingServiceInput.getIsCallForwardingAlwaysChecked()) {
                    this.callForwardingServiceInput.setIsCFActive(true);
                }

                this.callForwardingServiceInput.setCfaRingSplashChecked((cfaParsedJson["CallForwardingAlways"]["ringSplash"]["$"] == "true"));
                postCFAGet(cfaParsedJson);
            }, (err) => {
                postCFAGet(null);
            });
    }

    getCallForwardingBusyService(cfbUrl, postCFBGet) {
        this.httpservices.httpGetRequest(cfbUrl)
            .subscribe((res) => {
                var cfbParsedJson = res.json();

                this.callForwardingServiceInput.setIsCallForwardingBusyChecked((cfbParsedJson["CallForwardingBusy"]["active"]["$"] == "true"))
                if (cfbParsedJson["CallForwardingBusy"]["forwardToPhoneNumber"]) {
                    this.callForwardingServiceInput.setCallForwardingBusyNumber(cfbParsedJson["CallForwardingBusy"]["forwardToPhoneNumber"]["$"]);
                }

                if (this.callForwardingServiceInput.getIsCallForwardingBusyChecked()) {
                    this.callForwardingServiceInput.setIsCFActive(true);
                }
                postCFBGet(cfbParsedJson);
            }, (err) => {
                postCFBGet(null);
            })
    }

    getCallForwardingNoAnswerService(cfnaUrl, postCFNAGet) {
        this.httpservices.httpGetRequest(cfnaUrl)
            .subscribe((res) => {
                var cfnaParsedJson = res.json();

                this.callForwardingServiceInput.setIsCallForwardingNoAnswerChecked((cfnaParsedJson["CallForwardingNoAnswer"]["active"]["$"] == "true"));

                if (cfnaParsedJson["CallForwardingNoAnswer"]["numberOfRings"]) {
                    this.callForwardingServiceInput.setCallForwardingNoAnswerRings(cfnaParsedJson["CallForwardingNoAnswer"]["numberOfRings"]["$"]);
                }

                if (cfnaParsedJson["CallForwardingNoAnswer"]["forwardToPhoneNumber"]) {

                    this.callForwardingServiceInput.setCallForwardingNoAnswerNumber(cfnaParsedJson["CallForwardingNoAnswer"]["forwardToPhoneNumber"]["$"]);

                }
                if (this.callForwardingServiceInput.getIsCallForwardingNoAnswerChecked()) {
                    this.callForwardingServiceInput.setIsCFActive(true);
                }
                postCFNAGet(cfnaParsedJson);
            }, (err) => {
                postCFNAGet(null);
            });
    }

    getCallForwardingNotReachableService(cfnrUrl, postCFNRGet) {
        this.httpservices.httpGetRequest(cfnrUrl)
            .subscribe((res) => {
                var cfnrParsedJson = res.json();
                this.callForwardingServiceInput.setIsCallForwardingNotReachableChecked((cfnrParsedJson["CallForwardingNotReachable"]["active"]["$"] == "true"));
                if (cfnrParsedJson["CallForwardingNotReachable"]["forwardToPhoneNumber"]) {
                    this.callForwardingServiceInput.setCallForwardingNotReachableNumber(cfnrParsedJson["CallForwardingNotReachable"]["forwardToPhoneNumber"]["$"]);
                }
                if (this.callForwardingServiceInput.getIsCallForwardingNotReachableChecked()) {
                    this.callForwardingServiceInput.setIsCFActive(true);
                }
                postCFNRGet(cfnrParsedJson);
            }, (err) => {
                postCFNRGet(null);
            });
    }


    putCallForwardingAlwaysService(cfaUrl, isCallForwardingAlwaysChecked, callForwardingNumber, postPutCFA) {

        var body = '<?xml version="1.0" encoding="UTF-8"?> <CallForwardingAlways xmlns="http://schema.broadsoft.com/xsi"><active>' + isCallForwardingAlwaysChecked + '</active>';

        if (callForwardingNumber) {
            body += '<forwardToPhoneNumber>' + callForwardingNumber + '</forwardToPhoneNumber>';
        }

        if (isCallForwardingAlwaysChecked == false && !callForwardingNumber) {
            body = body + '<forwardToPhoneNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        body += '<ringSplash>' + this.callForwardingServiceInput.getCfaRingSplashChecked() + '</ringSplash></CallForwardingAlways>';

        this.httpservices.httpPutRequest(cfaUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setIsCallForwardingAlwaysChecked(isCallForwardingAlwaysChecked);
                this.callForwardingServiceInput.setCallForwardingAlwaysNumber(callForwardingNumber);

                this.callForwardingServiceInput.setIsCFActive(this.fetchCFAActive() || this.fetchCFBActive() || this.fetchCFNAActive() || this.fetchCFNRActive());

                postPutCFA(isCallForwardingAlwaysChecked, null);
            }, (err) => {
                postPutCFA(!isCallForwardingAlwaysChecked, err);
            });
    }

    putCallForwardingBusyService(cfbUrl, isCallForwardingBusyChecked, callForwardingBusyNumber, postCFBPut) {

        var body = '<?xml version="1.0" encoding="ISO-8859-1"?><CallForwardingBusy xmlns="http://schema.broadsoft.com/xsi"><active>' + isCallForwardingBusyChecked + '</active>';
        if (callForwardingBusyNumber) {
            body += '<forwardToPhoneNumber>' + callForwardingBusyNumber + '</forwardToPhoneNumber>';
        }

        if (!callForwardingBusyNumber && isCallForwardingBusyChecked == false) {
            body += '<forwardToPhoneNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        body += '</CallForwardingBusy>';

        this.httpservices.httpPutRequest(cfbUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setIsCallForwardingBusyChecked(isCallForwardingBusyChecked);
                this.callForwardingServiceInput.setCallForwardingBusyNumber(callForwardingBusyNumber);
                this.callForwardingServiceInput.setIsCFActive(this.fetchCFAActive() || this.fetchCFBActive() || this.fetchCFNAActive() || this.fetchCFNRActive());

                postCFBPut(isCallForwardingBusyChecked, null);
            }, (err) => {
                postCFBPut(!isCallForwardingBusyChecked, err);
            });

    }

    putCFARingSplash(cfaUrl, isCFARingSplashChecked, postCFARingSplashPut) {

        var body = '<?xml version="1.0" encoding="UTF-8"?> <CallForwardingAlways xmlns="http://schema.broadsoft.com/xsi"><active>' + this.callForwardingServiceInput.getIsCallForwardingAlwaysChecked() + '</active><forwardToPhoneNumber>' + this.callForwardingServiceInput.getCallForwardingAlwaysNumber() + '</forwardToPhoneNumber><ringSplash>' + isCFARingSplashChecked + '</ringSplash></CallForwardingAlways>';
        this.httpservices.httpPutRequest(cfaUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setCfaRingSplashChecked(isCFARingSplashChecked);
                postCFARingSplashPut(isCFARingSplashChecked, null);
            }, (err) => {
                postCFARingSplashPut(!isCFARingSplashChecked, err);
            });
    }

    putCallForwardingNoAnswerService(cfnaUrl, isCallForwardingNoAnswerChecked, callForwardingNoAnswerNumber, postCFNAPut) {
        var body = '<?xml version="1.0" encoding="UTF-8"?> <CallForwardingNoAnswer xmlns="http://schema.broadsoft.com/xsi"><active>' + isCallForwardingNoAnswerChecked + '</active>';

        if (callForwardingNoAnswerNumber) {

            body += '<forwardToPhoneNumber>' + callForwardingNoAnswerNumber + '</forwardToPhoneNumber>';
        }

        if (!callForwardingNoAnswerNumber && isCallForwardingNoAnswerChecked == false) {
            body += '<forwardToPhoneNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        body += '<numberOfRings>' + this.callForwardingServiceInput.getCallForwardingNoAnswerRings() + '</numberOfRings></CallForwardingNoAnswer>';

        this.httpservices.httpPutRequest(cfnaUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setIsCallForwardingNoAnswerChecked(isCallForwardingNoAnswerChecked);
                this.callForwardingServiceInput.setCallForwardingNoAnswerNumber(callForwardingNoAnswerNumber);
                this.callForwardingServiceInput.setIsCFActive(this.fetchCFAActive() || this.fetchCFBActive() || this.fetchCFNAActive() || this.fetchCFNRActive());

                postCFNAPut(isCallForwardingNoAnswerChecked, null);
            }, (err) => {
                postCFNAPut(!isCallForwardingNoAnswerChecked, err);
            });
    }

    putCallForwardingNotReachableService(cfnrUrl, isCallForwardingNotReachableChecked, callForwardingNotReachableNumber, postCFNRPut) {
        var body = '<?xml version="1.0" encoding="UTF-8"?> <CallForwardingNotReachable xmlns="http://schema.broadsoft.com/xsi"><active>' + isCallForwardingNotReachableChecked + '</active>';
        if (callForwardingNotReachableNumber) {
            body += '<forwardToPhoneNumber>' + callForwardingNotReachableNumber + '</forwardToPhoneNumber>';
        }

        if (!callForwardingNotReachableNumber && isCallForwardingNotReachableChecked == false) {
            body += '<forwardToPhoneNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        body += '</CallForwardingNotReachable>';

        this.httpservices.httpPutRequest(cfnrUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setIsCallForwardingNotReachableChecked(isCallForwardingNotReachableChecked);
                this.callForwardingServiceInput.setCallForwardingNotReachableNumber(callForwardingNotReachableNumber);
                this.callForwardingServiceInput.setIsCFActive(this.fetchCFAActive() || this.fetchCFBActive() || this.fetchCFNAActive() || this.fetchCFNRActive());
                postCFNRPut(isCallForwardingNotReachableChecked, null);
            }, (err) => {
                postCFNRPut(!isCallForwardingNotReachableChecked, err);
            });
    }

    putCallForwardingNoAnswerRings(cfnaUrl, cfnaNoOfRings, postCFNARingsPut) {

        var body = '<?xml version="1.0" encoding="UTF-8"?> <CallForwardingNoAnswer xmlns="http://schema.broadsoft.com/xsi"><active>' + this.callForwardingServiceInput.getIsCallForwardingNoAnswerChecked() + '</active><forwardToPhoneNumber>' + this.callForwardingServiceInput.getCallForwardingNoAnswerNumber() + '</forwardToPhoneNumber><numberOfRings>' + cfnaNoOfRings + '</numberOfRings></CallForwardingNoAnswer>';
        this.httpservices.httpPutRequest(cfnaUrl, body)
            .subscribe((res) => {
                this.callForwardingServiceInput.setCallForwardingNoAnswerRings(cfnaNoOfRings);
                postCFNARingsPut(cfnaNoOfRings, null);
            }, (err) => {
                postCFNARingsPut(null, err);
            })
    }

    setCallForwardingAlwaysNumber(cfAlwaysNumber) {
        this.callForwardingServiceInput.setCallForwardingAlwaysNumber(cfAlwaysNumber);
    }

    setCallForwardingNoAnswerNumber(callForwardingNoAnswerNumber) {
        this.callForwardingServiceInput.setCallForwardingNoAnswerNumber(callForwardingNoAnswerNumber);
    }

    setCallForwardingBusyNumber(callForwardingBusyNumber) {
        this.callForwardingServiceInput.setCallForwardingBusyNumber(callForwardingBusyNumber);
    }

    setCallForwardingNotReachableNumber(callForwardingNotReachableNumber) {
        this.callForwardingServiceInput.setCallForwardingNotReachableNumber(callForwardingNotReachableNumber);
    }

    fetchIsCFActive() {
        return this.callForwardingServiceInput.getIsCFActive();
    }

    fetchCFANumber() {
        return this.callForwardingServiceInput.getCallForwardingAlwaysNumber();
    }

    fetchCFARngSplsh() {
        return this.callForwardingServiceInput.getCfaRingSplashChecked();
    }

    fetchCFBNumber() {
        return this.callForwardingServiceInput.getCallForwardingBusyNumber();
    }

    fetchCFAActive() {
        return this.callForwardingServiceInput.getIsCallForwardingAlwaysChecked();
    }

    fetchCFBActive() {
        return this.callForwardingServiceInput.getIsCallForwardingBusyChecked();
    }

    fetchCFNAActive() {
        return this.callForwardingServiceInput.getIsCallForwardingNoAnswerChecked();
    }

    fetchCFNANumber() {
        return this.callForwardingServiceInput.getCallForwardingNoAnswerNumber();
    }

    fetchCFNRActive() {
        return this.callForwardingServiceInput.getIsCallForwardingNotReachableChecked();
    }

    fetchCFNRNumber() {
        return this.callForwardingServiceInput.getCallForwardingNotReachableNumber();
    }

    fetchIsCFAChecked() {
        return this.callForwardingServiceInput.getIsCallForwardingAlwaysChecked();
    }

    fetchIsCFBChecked() {
        return this.callForwardingServiceInput.getIsCallForwardingBusyChecked();
    }

    fetchIsCFNAChecked() {
        return this.callForwardingServiceInput.getIsCallForwardingNoAnswerChecked();
    }

    fetchIsCFNRChecked() {
        return this.callForwardingServiceInput.getIsCallForwardingNotReachableChecked();
    }

    fetchCFNARings() {
        return this.callForwardingServiceInput.getCallForwardingNoAnswerRings();
    }
}

