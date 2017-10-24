/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { HttpServices } from 'app/AppCommon/httpservices.service';

@Injectable()
export class CallWaitingService {
    private res: Response;
    private headers: Headers = new Headers();

    constructor(private httpservices: HttpServices) { }
    getCallWaitingService(acrUrl, postCWGet) {
        this.httpservices.httpGetRequest(acrUrl)
            .subscribe((res) => {
                let cwsParsedJson = res.json();
                postCWGet(cwsParsedJson);
            }, (err) => {
                console.log('Some Error in CWS.');
                postCWGet(null);
            });
    }

    putCallWaitingService(cwsUrl, isCallWaitingChecked, postCWSPut) {

        let body = '<?xml version="1.0" encoding="UTF-8"?><CallWaiting xmlns="http://schema.broadsoft.com/xsi"><active>'
                    + isCallWaitingChecked + '</active></CallWaiting>';
        this.httpservices.httpPutRequest(cwsUrl, body)
            .subscribe((res) => {
                postCWSPut(res)
            }, (err) => {
                postCWSPut(err);
            })
    }

}
