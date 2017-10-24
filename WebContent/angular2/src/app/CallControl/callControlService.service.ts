/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';
import {HttpServices} from 'app/AppCommon/httpservices.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';

@Injectable()

export class CallControlService {

    constructor(private httpServices: HttpServices, private callControlServiceInput: CallControlServiceInput) {}

    getProfileData(profileUrl, postProfileDataGet) {

        this.httpServices.httpGetRequest(profileUrl)
        .subscribe((res) => {
            let profileParsedJson = res.json();
            console.log('Profile Parsed JSON: ', profileParsedJson);
            if (profileParsedJson.Profile.details.number) {
                this.callControlServiceInput.setPrimaryNumber(profileParsedJson.Profile.details.number.$);
                console.log('Number >>>>>', profileParsedJson.Profile.details.number.$)
            } else {
                console.log('Number Not Found')
            }
            if (profileParsedJson.Profile.details.groupId) {
                this.callControlServiceInput.setGroupId(profileParsedJson.Profile.details.groupId.$);
                 console.log('groupId >>>>>', profileParsedJson.Profile.details.groupId.$)
            } else {
                console.log('groupId Not Found')
            }


            if (profileParsedJson.Profile.details.serviceProvider.$) {
                this.callControlServiceInput.setIsEnterprise(profileParsedJson['Profile']['details']['serviceProvider']['@isEnterprise']);
                this.callControlServiceInput.setServiceProviderId(profileParsedJson.Profile.details.serviceProvider.$);
                console.log('ServiceProviderId >>>>>', profileParsedJson.Profile.details.serviceProvider.$)
                 console.log('IsEnterprise >>>>>', profileParsedJson['Profile']['details']['serviceProvider']['@isEnterprise'])
            }

            postProfileDataGet(profileParsedJson);

        },
        (err) => {
            console.log('Some Error Occurred while fetching Profile');
            postProfileDataGet(null);
        });
    }

    fetchPrimaryNumber() {
        return this.callControlServiceInput.getPrimaryNumber();
    }

}
