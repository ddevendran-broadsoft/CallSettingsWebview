/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class RemoteOfficeServiceInput {

    private isRemoteOfficeChecked: boolean;
    private remoteOfficeNumber: number;

    constructor() {}

    setIsRemoteOfficeChecked(isRemoteOfficeChecked) {
        this.isRemoteOfficeChecked = isRemoteOfficeChecked;
    }

    getIsRemoteOfficeChecked() {
        return this.isRemoteOfficeChecked;
    }

    setRemoteOfficeNumber(remoteOfficeNumber) {
        this.remoteOfficeNumber = remoteOfficeNumber;
    }

    getRemoteOfficeNumber() {
        return this.remoteOfficeNumber;
    }
}
