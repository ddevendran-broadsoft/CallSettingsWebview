/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

import { DesktopSelectOption } from 'app/common/desktopSelectDropdown.component';

@Injectable()
export class Util {
    public INPUTMAXLENGTH = 256;
    public PHONENUMBERMAXLENGTH = 30;
    public E164MAXLENGTH = 22;
    public E164MINLENGTH = 4;
    public PHONENUMBERMINLENGTH = 2;
    public phoneNumberRegx = /^[0-9+-\.]+$/;
    public emailRegx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    public sipUriRegx = /^(sip:)?([a-zA-Z0-9\-\!\_\.\+\~\*\'\(\)]){1,}\@([A-Za-z0-9\-\.]){1,}\.([A-Za-z]{2,4})(:([0-9]){1,4})?$/;
    public baseUrl = window['xsiActionsBaseURL'];
    customizedTextJson = window['customizedTexts'];

    public isDesktopPlatform() {
        return window['callSettingsHeroInput']['platform'] === 'win_DT' || window['callSettingsHeroInput']['platform'] === 'mac_DT';
    }

    public isE164valid(phoneNumber) {

        let phoneNumberWildCard = /^\+?(\*?\#?){1,}\d{1,30}(\#?\*?){1,}$/;
        let isValidNumber = false;
        if (phoneNumber != null && phoneNumber !== '' && phoneNumber !== ' ') {
            // BWks allows dashes so we do too
            if (phoneNumberWildCard.test(phoneNumber.replace(/-/g, ''))) {
                if (phoneNumber.charAt(0) === '+') {
                    if (!(phoneNumber.length > this.E164MAXLENGTH) && !(phoneNumber.length < this.E164MINLENGTH)) {
                        isValidNumber = true;
                    }
                } else {
                    if (!(phoneNumber.length > this.PHONENUMBERMAXLENGTH) && !(phoneNumber.length < this.PHONENUMBERMINLENGTH)) {
                        isValidNumber = true;
                    }
                }
            }
        }
        return isValidNumber;
    }

    public isValidSipUri(sipUri) {
        if (sipUri) {
            return this.sipUriRegx.test(sipUri);
        } else {
            return false;
        }
    }

    public getInputDynamicWidth(content: string) {
        let helperText = document.getElementById('helperText');
        helperText.textContent = content;
        let width = 160;
        if (helperText.offsetWidth < 160) {
            width = 160;
        } else if (helperText.offsetWidth > 240) {
            width = 240;
        } else {
            width = helperText.offsetWidth;
        }
        helperText.textContent = '';
        return width;
    }

    /**
    * Removes all the characters except the numbers from the Element text content
    * @namespace
    * @method validatePhoneNumberOnCopyPaste
    * @param {Event} event - property key
    */
    public validatePhoneNumberOnCopyPaste(event) {
        let start = event.target.selectionStart;
        let phoneNumber = this.getNumbersFromInput(event.target.value);
        event.target.value = phoneNumber;
        event.target.setSelectionRange(start, start);
    }

    /**
    * Return only numbers from the Input
    * @namespace
    * @method getNumbersFromInput
    * @param {String} stringContent - property key
    * @return {Number} - number
    */
    public getNumbersFromInput(stringContent) {

        let phoneNumber = stringContent;
        phoneNumber = phoneNumber.replace(/[^0-9+\-\/(\/)]/g, '');
        return phoneNumber.trim();
    }

    public frameErrorMessage(key: string, errorStatus: string) {
        return key + ' ' + this.customizedTextJson.error.code + ' (' + errorStatus.toString().trim() + ')';
    }

    /*desktopSelectDropdown start*/
    public updateDesktopOption(list: DesktopSelectOption[], name: string, flag: boolean) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].getName() === name) {
                list[i].setChecked(flag);
                break;
            }
        }
    }
    public selectAllDesktopOption(list: DesktopSelectOption[]) {
        list.forEach(element => {
            element.setChecked(true);
        });
    }

    public selectNoneDesktopOption(list: DesktopSelectOption[]) {
        list.forEach(element => {
            if (!element.isNoneOption()) {
                element.setChecked(false);
            } else {
                element.setChecked(true);
            }
        });
    }
    public updateNoneDesktopOptionList(list: DesktopSelectOption[], selectedList: string[]) {
        list.forEach(element => {

            element.setChecked(selectedList.lastIndexOf(element.getName()) > -1);

        });
    }
    /*desktopSelectDropdown end*/

    /*Native Multi-Select start*/
    public isUncheckAllOptions(allOptions, lastSelectedValues, currentList) {
        return currentList.length === allOptions.length - 1
               && !(currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1)
               && lastSelectedValues.indexOf(this.customizedTextJson.voice_management.all_settings) > -1;
    }
    public isCheckAllSelectOption(allOptions, lastSelectedValues, currentList) {
        if (currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1
            && !(lastSelectedValues.indexOf(this.customizedTextJson.voice_management.all_settings) > -1)) {
            return true;
        } else {
            return currentList.length === allOptions.length ||
                (currentList.length === allOptions.length - 1
                 && !(currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1));
        }
    }
    /*Native Multi-Select end*/

    getLocalDateTimeForUI(epochTime) {

        let updatedTimeInEpoch = new Date(epochTime);

        return updatedTimeInEpoch.getFullYear() + '-' +
                this.appendZero(updatedTimeInEpoch.getMonth() + 1) + '-' +
                this.appendZero(updatedTimeInEpoch.getDate()) + 'T' +
                this.appendZero(updatedTimeInEpoch.getHours()) + ':' +
                this.appendZero(updatedTimeInEpoch.getMinutes()) + ':' +
                this.appendZero(updatedTimeInEpoch.getSeconds()) ;

    }

    getISOLocalDateTime(epochTime) {

        let updatedTimeInEpoch = new Date(epochTime);

        return this.getLocalDateTimeForUI(epochTime) + '.' +
                this.appendZeroToMiliSec(updatedTimeInEpoch.getMilliseconds()) +
                this.computeTimeDifflocalUTC(updatedTimeInEpoch);
    }

    appendZero(data) {

        return (data < 10 ? '0' : '') + data;
    }

    appendZeroToMiliSec(data) {
        data = data < 10 ? this.appendZero(data) : data;
        return data < 100 ? this.appendZero(data) : data;
    }

    computeTimeDifflocalUTC(updatedTimeInEpoch) {

        let minutesDiff = updatedTimeInEpoch.getTimezoneOffset();
        minutesDiff = -1 * minutesDiff;
        let diff;
        if (minutesDiff > 0) {
            let hour = '+' + this.appendZero((Math.floor(minutesDiff / 60)));
            let min = this.appendZero(minutesDiff % 60);
            diff = hour + ':' + min;
        } else {
            minutesDiff = -1 * minutesDiff;
            let hour = '-' + this.appendZero((minutesDiff / 60));
            let min = this.appendZero(minutesDiff % 60);
            diff = hour + ':' + min;
        }
        return diff;

    }

    getEndOfTheDayTimeISO(currentEpoch) {

        let endOfTheDayTimeISO = new Date(currentEpoch);

        return endOfTheDayTimeISO.getFullYear() + '-' +
               this.appendZero(endOfTheDayTimeISO.getMonth() + 1) + '-' +
               this.appendZero(endOfTheDayTimeISO.getDate()) + 'T' +
               '23' + ':' + '59' + ':' + '59' + '.' + '000' +
               this.computeTimeDifflocalUTC(endOfTheDayTimeISO);

    }

    setFetchedTimeToLocalTime(fetchedTimeInISO) {

        let fetchedUTCEpoch = new Date(fetchedTimeInISO).getTime();
        return this.getLocalDateTimeForUI(fetchedUTCEpoch);
    }

    getUserInpTimeISO(epoch) {
        return new Date(epoch).toISOString().replace('Z', this.computeTimeDifflocalUTC(new Date(epoch)));
    }

    getRingNumberFromLocationUrl(locationUrl) {

    return locationUrl.substr(locationUrl.lastIndexOf('/') + 1);

  }

  getBWAnywhereLocationUrl(userInpRingNumber) {

   return this.baseUrl + '/v2.0/user/' + window['callSettingsHeroInput'].userId
          + '/services/broadworksanywhere/location/' + userInpRingNumber;
  }

}
