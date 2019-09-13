/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class CallControlServiceInput {

    private primaryNumber;
    private groupId;
    private serviceProviderId;
    private isEnterprise;

    constructor() { }

    setPrimaryNumber(primaryNumber) {
        this.primaryNumber = primaryNumber;
    }

    getPrimaryNumber() {
        return this.primaryNumber;
    }

    setGroupId(groupId) {
        this.groupId = groupId;
    }

    getGroupId() {
        return this.groupId;
    }

    setIsEnterprise(isEnterprise) {
        this.isEnterprise = isEnterprise;
    }

    getIsEnterprise() {
        return this.isEnterprise;
    }


    setServiceProviderId(serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
    }

    getServiceProviderId() {
        return this.serviceProviderId;
    }


}
