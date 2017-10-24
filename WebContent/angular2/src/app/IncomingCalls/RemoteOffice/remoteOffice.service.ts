/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { RemoteOfficeServiceInput } from 'app/IncomingCalls/RemoteOffice/remoteOfficeServiceInput.service';

@Injectable()

export class RemoteOfficeService {

    private res: Response;
    private headers: Headers = new Headers();

    constructor(private httpservices: HttpServices, private remoteOfficeServiceInput: RemoteOfficeServiceInput) { }
    getRemoteOfficeService(roUrl, postROGet) {
        this.httpservices.httpGetRequest(roUrl)
            .subscribe((res) => {
                let roParsedJson = (res.json());
                this.remoteOfficeServiceInput.setIsRemoteOfficeChecked((roParsedJson['RemoteOffice']['active']['$'] === 'true'));
                if (roParsedJson['RemoteOffice']['remoteOfficeNumber'] ) {
                    this.remoteOfficeServiceInput.setRemoteOfficeNumber(roParsedJson['RemoteOffice']['remoteOfficeNumber']['$']);
                }

                postROGet(roParsedJson);
            }, (err) => {
                postROGet(null);
            })
    }

    putRemoteOfficeService(roUrl, isRemoteOfficeChecked, remoteOfficeNumber, postROPut) {
        let body;

        body = '<?xml version="1.0" encoding="ISO-8859-1"?><RemoteOffice xmlns="http://schema.broadsoft.com/xsi"><active>'
                + isRemoteOfficeChecked + '</active>';

        if (remoteOfficeNumber) {
            body = body + '<remoteOfficeNumber>' + remoteOfficeNumber + '</remoteOfficeNumber>';
        }
        if (isRemoteOfficeChecked === false && !remoteOfficeNumber) {
            body = body + '<remoteOfficeNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        body = body + '</RemoteOffice>';
        this.httpservices.httpPutRequest(roUrl, body)
            .subscribe((res) => {
                this.remoteOfficeServiceInput.setIsRemoteOfficeChecked(isRemoteOfficeChecked);
                this.remoteOfficeServiceInput.setRemoteOfficeNumber(remoteOfficeNumber);
                postROPut(null);
            }, (err) => {
                postROPut(err);
            });
    }

    fetchIsRemoteOfficeChecked() {
        return this.remoteOfficeServiceInput.getIsRemoteOfficeChecked();
    }

    fetchRemoteOfficeNumber() {
        return this.remoteOfficeServiceInput.getRemoteOfficeNumber();
    }

    setRemoteOfficeNumber(remoteOfficeNumber) {
        this.remoteOfficeServiceInput.setRemoteOfficeNumber(remoteOfficeNumber);
    }
}
