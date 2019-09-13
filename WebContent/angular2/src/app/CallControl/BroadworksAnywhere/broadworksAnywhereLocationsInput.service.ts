import { Injectable } from '@angular/core';

@Injectable()

export class BroadWorksAnywhereLocationsInput {
    locationUrl = '';

    private description = '';
    private isDoNotForwardChecked: boolean;
    private isAnswerConfirmationChecked: boolean;
    private isCallControlChecked: boolean;
    private ringNumber: any;
    private isRingNumberEnabled: boolean;
    private bwAnywhereLocationsUI = [];
    constructor() { }

    setRingNumber(ringNumber) {
        this.ringNumber = ringNumber;
    }

    getRingNumber() {
        return this.ringNumber;
    }

    setIsRingNumberEnabled(isRingNumberEnabled) {
        this.isRingNumberEnabled = isRingNumberEnabled;
    }

    getIsRingNumberEnabled() {
        return this.isRingNumberEnabled;
    }

    setDescription(description) {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    setIsDoNotForwardChecked(isDoNotForwardChecked) {
        this.isDoNotForwardChecked = isDoNotForwardChecked;
    }

    getIsDoNotForwardChecked() {
        return this.isDoNotForwardChecked;
    }

    setIsAnswerConfirmationChecked(isAnswerConfirmationChecked) {
        this.isAnswerConfirmationChecked = isAnswerConfirmationChecked;
    }

    getIsAnswerConfirmationChecked() {
        return this.isAnswerConfirmationChecked;
    }

    setIsCallControlChecked(isCallControlChecked) {
        this.isCallControlChecked = isCallControlChecked;
    }

    getIsCallControlChecked() {
        return this.isCallControlChecked;
    }

    setBWAnywhereLocationsUI(bwAnywhereLocationsUI) {
        this.bwAnywhereLocationsUI = bwAnywhereLocationsUI;
    }

    getbBWAnywhereLocationsUI() {
        return this.bwAnywhereLocationsUI;
    }

    setLocationUrl(locationUrl) {
        this.locationUrl = locationUrl;
    }

    getLocationUrl() {
        return this.locationUrl;
    }
}
