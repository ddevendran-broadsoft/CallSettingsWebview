import { Injectable } from '@angular/core';

@Injectable()

export class OutOfOfficeServiceInput {
    expirationTimeOption: any;

    private isPAActive = false;
    private isRngSplshActive = false;
    private isTransferToAttendantEnabled = false;
    private presence: string;
    private expirationTime;
    private isExpirationTimeEnabled = false;
    private attendantNumber;
    private isUntilChecked;

    setIsPAActive(isPAActive) {
        this.isPAActive = isPAActive;
    }

    getIsPAActive () {
        return this.isPAActive;
    }

    setPresence(presence) {
        this.presence = presence;
    }

    getPresence() {
        return this.presence;
    }

    setIsExpirationTimeEnabled(isExpirationTimeEnabled) {
        this.isExpirationTimeEnabled = isExpirationTimeEnabled;
    }

    getIsExpirationTimeEnabled() {
        return this.isExpirationTimeEnabled;
    }

    setIsTransferToAttendantEnabled(isTransferToAttendantEnabled) {
        this.isTransferToAttendantEnabled = isTransferToAttendantEnabled;
    }

    getIsTransferToAttendantEnabled() {
        return this.isTransferToAttendantEnabled;
    }

    setExpirationTime(expirationTime) {
        this.expirationTime = expirationTime;
    }

    getExpirationTime() {
        return this.expirationTime;
    }

    setExpirationTimeOption(selectedOption) {
        this.expirationTimeOption = selectedOption;
    }

    getExpirationTimeOption() {
        return this.expirationTimeOption;
    }

    setIsRngSplshActive(isRngSplshActive) {
        this.isRngSplshActive = isRngSplshActive;
    }

    setIsUntilActive(isUntilChecked) {
        this.isUntilChecked = isUntilChecked;
    }

    getIsUntilActive() {
        return this.isUntilChecked;
    }

    getIsRngSplshActive() {
        return this.isRngSplshActive;
    }

    setAttendantNumber(attendantNumber) {
        this.attendantNumber = attendantNumber;
    }

    getAttendantNumber() {
        return this.attendantNumber;
    }
}
