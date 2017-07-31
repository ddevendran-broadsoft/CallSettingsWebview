/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

import { DesktopSelectOption } from 'app/common/desktopSelectDropdown.component';

@Injectable()

/*Utility class for the application */ 
export class Util {
    public INPUTMAXLENGTH: number = 256;
    public PHONENUMBERMAXLENGTH: number = 30;
    public E164MAXLENGTH: number = 22;
    public E164MINLENGTH: number = 4;
    public PHONENUMBERMINLENGTH: number = 2;
    public phoneNumberRegx = /^[0-9+-\.]+$/;
    public emailRegx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    public sipUriRegx = /^(sip:)?([a-zA-Z0-9]){1,}\@([A-Za-z0-9\-\.]){1,}\.([A-Za-z]{2,4})(:([0-9]){1,4})?$/;

    customizedTextJson = window['customizedTexts'];

    public isDesktopPlatform() {
        return window['callSettingsHeroInput']['platform'] == "win_DT" || window['callSettingsHeroInput']['platform'] == "mac_DT";
    }

    public isE164valid(phoneNumber) {

        let phoneNumberWildCard = /^\+?\d{1,30}$/;
        let isValidNumber = false;
        if (phoneNumber != null && phoneNumber != "" && phoneNumber != " ") {
            // BWks allows dashes so the app does too
            if (phoneNumberWildCard.test(phoneNumber.replace(/-/g, ""))) {
                if (phoneNumber.charAt(0) == "+") {
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
        var helperText = document.getElementById("helperText");
        helperText.textContent = content;
        let width = 160;
        if (helperText.offsetWidth < 160) {
            width = 160;
        } else if (helperText.offsetWidth > 240) {
            width = 240;
        } else {
            width = helperText.offsetWidth;
        }
        helperText.textContent = "";
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
        return key + " " + this.customizedTextJson.error.code + " (" + errorStatus.toString().trim() + ")";
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
        return currentList.length === allOptions.length - 1 && !(currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1) &&
            lastSelectedValues.indexOf(this.customizedTextJson.voice_management.all_settings) > -1;
    }
    public isCheckAllSelectOption(allOptions, lastSelectedValues, currentList) {
        if (currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1 && !(lastSelectedValues.indexOf(this.customizedTextJson.voice_management.all_settings) > -1)) {
            return true;
        } else {
            return currentList.length === allOptions.length ||
                (currentList.length === allOptions.length - 1 && !(currentList.indexOf(this.customizedTextJson.voice_management.all_settings) > -1));
        }
    }
    /*Native Multi-Select end*/

}