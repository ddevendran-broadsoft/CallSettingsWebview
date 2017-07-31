/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';
import {HttpServices} from 'app/AppCommon/httpservices.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';

@Injectable()

export class CallControlService {

    constructor(private httpServices: HttpServices, private callControlServiceInput : CallControlServiceInput){}

    getPrimaryNumber(profileUrl, postPrimaryNumberGet) {

        this.httpServices.httpGetRequest(profileUrl)
        .subscribe((res) => {
            var profileParsedJson = res.json();
            console.log("Profile Parsed JSON: ", profileParsedJson);
            if(profileParsedJson.Profile.details.number) {
                this.callControlServiceInput.setPrimaryNumber(profileParsedJson.Profile.details.number.$);
            } else {
                console.log("Number Not Found")
            }
            postPrimaryNumberGet(profileParsedJson);

        },
        (err) => {
            console.log("Some Error Occurred while fetching Profile");
            postPrimaryNumberGet(null);
        });
    }

    fetchPrimaryNumber() {
        return this.callControlServiceInput.getPrimaryNumber();
    }

}