/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class CallControlServiceInput {

    private primaryNumber;

    constructor(){}

    setPrimaryNumber(primaryNumber) {
        this.primaryNumber = primaryNumber;
    }

    getPrimaryNumber() {
        return this.primaryNumber;
    }
}