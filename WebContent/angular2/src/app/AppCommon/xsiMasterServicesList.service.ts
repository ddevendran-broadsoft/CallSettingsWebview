/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class XSIMasterServicesList {

    private masterServicesList;

    constructor() {}

    setXSIMasterServicesList(masterServicesList) {
        this.masterServicesList = masterServicesList;
    }

    getXSIMasterServicesList() {
        return this.masterServicesList;
    }
}
