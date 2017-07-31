/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';

@Injectable()
export class BlockCallerIdService {

    constructor(private httpservices: HttpServices) { }
    getBlockCallerIdService(bcidUrl, postBCIDGet) {

        this.httpservices.httpGetRequest(bcidUrl)
            .subscribe((res) => {
                var bcidParsedJson = res.json();
                postBCIDGet(bcidParsedJson);
            }, (err) => {
                console.log("Some Error Occurred in BCID");
                postBCIDGet(null);
            })

    }

    putBlockCallerIdService(bcidUrl, isBlockCallerIdChecked, postBCIDPut) {
        var body = '<?xml version="1.0" encoding="UTF-8"?><CallingLineIDDeliveryBlocking xmlns="http://schema.broadsoft.com/xsi"><active>' + isBlockCallerIdChecked + '</active></CallingLineIDDeliveryBlocking>';
        this.httpservices.httpPutRequest(bcidUrl, body)
            .subscribe((res) => {
                postBCIDPut(res);
            }, (err) => {
                postBCIDPut(err);
            });
    }



}