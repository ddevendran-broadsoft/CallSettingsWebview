/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';

@Injectable()
export class AutomaticCallbackService {

    constructor(private httpservices: HttpServices) { }

    getAutomaticCallbackService(acbUrl, postACBGet) {

        this.httpservices.httpGetRequest(acbUrl)
            .subscribe((res) => {
                var acbParsedJson = res.json();
                postACBGet(acbParsedJson);
            }, (err) => {
                postACBGet(null);
            });
    }

    putAutomaticCallbackService(acbUrl, isAutomaticCallbackChecked, postACBPut) {

        var body = '<?xml version="1.0" encoding="UTF-8"?> <AutomaticCallback xmlns="http://schema.broadsoft.com/xsi"><active>' + isAutomaticCallbackChecked + '</active></AutomaticCallback>';
        this.httpservices.httpPutRequest(acbUrl, body)
            .subscribe((res) => {
                postACBPut(res);
            }, (err) => {
                postACBPut(err);
            });
    }



}