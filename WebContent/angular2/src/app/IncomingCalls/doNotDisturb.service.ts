/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpServices } from 'app/AppCommon/httpservices.service';

@Injectable()

export class DoNotDisturbService {
    private res: Response;
    private headers: Headers = new Headers();
    constructor(private httpServices: HttpServices) { }
    getDoNotDisturbService(dndUrl, postDndGet) {

        this.httpServices.httpGetRequest(dndUrl)
            .subscribe((res) => {
                let dndParsedJson = res.json();
                postDndGet(dndParsedJson);

            }, (err) => {
                console.log('Error Occurred!!!')
                let dndParsedJson = null;
                postDndGet(dndParsedJson);
            });
    }

    putDoNotDisturbService(dndUrl, isDndChecked, postDndPut) {
        let body = '<?xml version="1.0" encoding="UTF-8"?><DoNotDisturb xmlns="http://schema.broadsoft.com/xsi"><active>'
                    + isDndChecked + '</active><ringSplash>false</ringSplash></DoNotDisturb>';
        this.httpServices.httpPutRequest(dndUrl, body)
            .subscribe((res) => {
                postDndPut(res);
            }, (err) => {
                postDndPut(err);
            });
    }
}
