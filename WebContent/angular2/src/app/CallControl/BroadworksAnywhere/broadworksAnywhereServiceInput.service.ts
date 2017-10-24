import { Injectable } from '@angular/core';

@Injectable()

export class BroadworksAnywhereServiceInput {

    private isAlertAllLocEnable: boolean;
    private bwAnywhereLocations: any;
    private ringNumber;
    private isRingNumberEnabled: boolean;
    private description: string;
    private updNumberindx: any;
    setIsAlertAllLocEnable(isAlertAllLocEnable) {
        this.isAlertAllLocEnable = isAlertAllLocEnable;
    }

    getIsAlertAllLocEnable() {
        return this.isAlertAllLocEnable;
    }

    setBWAnywhereLocations(bwAnywhereLocations) {
        this.bwAnywhereLocations = bwAnywhereLocations;
    }

    setUpdNumberIndx(updNumberindx) {
        this.updNumberindx = updNumberindx
    }

    getUpdNumberindx() {
        return this.updNumberindx;
    }

    getBWAnywhereLocations() {
        return this.bwAnywhereLocations;
    }

    setRingNumber(ringNumber) {
        this.ringNumber = ringNumber;
    }

    getRingNumber() {
        return this.ringNumber;
    }

    setDescription(description) {

        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    setIsRingNumberEnabled(isRingNumberEnabled) {
        this.isRingNumberEnabled = isRingNumberEnabled;
    }

    getRingNumberEnabled() {
        return this.isRingNumberEnabled;
    }
}
