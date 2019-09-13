/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject } from '@angular/core';

@Injectable()

export class CallForwardingServiceInput {

    private callForwardingAlwaysNumber;
    private callForwardingBusyNumber;
    private callForwardingNoAnswerNumber;
    private callForwardingNotReachableNumber;
    private cfaRingSplashChecked: boolean;
    private numberOfRings;

    isCallForwardingAlwaysChecked = false;
    isCallForwardingBusyChecked = false;
    isCallForwardingNoAnswerChecked = false;
    isCallForwardingNotReachableChecked = false;

    isCallForwardingActive = false;

    isCFActive = false;
    constructor() {}

    setIsCFActive(isCFActive) {
        this.isCFActive = isCFActive || this.isCallForwardingAlwaysChecked || this.isCallForwardingBusyChecked
         || this.isCallForwardingNoAnswerChecked || this.isCallForwardingNotReachableChecked;
    }

    getIsCFActive() {
        return this.isCFActive;
    }

    setCallForwardingAlwaysNumber(callForwardingAlwaysNumber) {
        this.callForwardingAlwaysNumber = callForwardingAlwaysNumber;
    }

    setCallForwardingBusyNumber(callForwardingBusyNumber) {
        this.callForwardingBusyNumber = callForwardingBusyNumber;
    }

    setCallForwardingNoAnswerNumber(callForwardingNoAnswerNumber) {
        this.callForwardingNoAnswerNumber = callForwardingNoAnswerNumber;
    }

    setCallForwardingNotReachableNumber(callForwardingNotReachableNumber) {
        this.callForwardingNotReachableNumber = callForwardingNotReachableNumber;
    }

    setCfaRingSplashChecked(cfaRingSplashChecked) {
        this.cfaRingSplashChecked = cfaRingSplashChecked;
    }

    setIsCallForwardingAlwaysChecked(isCallForwardingAlwaysChecked) {

        this.isCallForwardingAlwaysChecked = isCallForwardingAlwaysChecked;
    }

    setIsCallForwardingBusyChecked(isCallForwardingBusyChecked) {
        this.isCallForwardingBusyChecked = isCallForwardingBusyChecked;
    }

    setIsCallForwardingNoAnswerChecked(isCallForwardingNoAnswerChecked) {
        this.isCallForwardingNoAnswerChecked = isCallForwardingNoAnswerChecked;
    }

    setIsCallForwardingNotReachableChecked(isCallForwardingNotReachableChecked) {
        this.isCallForwardingNotReachableChecked = isCallForwardingNotReachableChecked;
    }

    setCallForwardingNoAnswerRings(numberOfRings) {
        this.numberOfRings = numberOfRings;
    }

    getCallForwardingAlwaysNumber() {
        return this.callForwardingAlwaysNumber;
    }

    getCallForwardingBusyNumber() {
        return this.callForwardingBusyNumber;
    }

    getCallForwardingNoAnswerNumber() {
        return this.callForwardingNoAnswerNumber;
    }

    getCallForwardingNotReachableNumber() {
        return this.callForwardingNotReachableNumber;
    }

    getCfaRingSplashChecked() {
        return this.cfaRingSplashChecked;
    }

    getIsCallForwardingAlwaysChecked() {
       return this.isCallForwardingAlwaysChecked;

    }

    getIsCallForwardingBusyChecked() {
        return this.isCallForwardingBusyChecked;
    }

    getIsCallForwardingNoAnswerChecked() {
        return this.isCallForwardingNoAnswerChecked;
    }

    getIsCallForwardingNotReachableChecked() {
        return this.isCallForwardingNotReachableChecked;
    }

    getCallForwardingNoAnswerRings() {
        return this.numberOfRings;
    }
}
