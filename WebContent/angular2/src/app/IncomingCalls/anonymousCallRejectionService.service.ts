/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';

@Injectable()
export class AnonymousCallRejectionService {

    private res: Response;
    private headers: Headers = new Headers();

    constructor(private httpservices: HttpServices) { }

    getAnonymousCallRejectionService(acrUrl, postACRGet) {

        this.httpservices.httpGetRequest(acrUrl)
            .subscribe((res) => {
                var acrParsedJson = res.json();
                postACRGet(acrParsedJson);
            }, (err) => {
                postACRGet(null);
            });
    }

    putAnonymousCallRejectionService(acrUrl, isAnonymousCallRejectionChecked, postACRPut) {
        var body = '<?xml version="1.0" encoding="ISO-8859-1"?><AnonymousCallRejection xmlns="http://schema.broadsoft.com/xsi"><active>' + isAnonymousCallRejectionChecked + '</active></AnonymousCallRejection>';
        this.httpservices.httpPutRequest(acrUrl, body)
            .subscribe((res) => {
                postACRPut(res);
            }, (err) => {
                postACRPut(err);
            });
    }
}