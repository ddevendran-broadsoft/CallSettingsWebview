import { Injectable, Inject } from '@angular/core';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { OutOfOfficeServiceInput } from 'app/IncomingCalls/OutOfOffice/outOfOfficeServiceInput.service';

@Injectable()

export class OutOfOfficeService {

    customizedTextJson = window['customizedTexts'];
    LUNCH = 'Lunch';
    MEETING = 'Meeting';
    OUT_OF_OFFICE = 'Out Of Office';
    TEMPORARILY_OUT = 'Temporarily Out';
    UNAVAILABLE = 'Unavailable';
    VACATION = 'Vacation';
    TRAINING = 'Training';
    GONE_FOR_THE_DAY = 'Gone for the Day';
    BUSINESS_TRIP = 'Business Trip';
    NONE = 'None';

    constructor(private httpServices: HttpServices, private outOfficeServiceInput: OutOfOfficeServiceInput) { }

    getPersonalAssistantData(personalAssistantUrl, postOutOfOfficeGet) {

        this.httpServices.httpGetRequest(personalAssistantUrl)
            .subscribe((res) => {
                console.log('OutofOffice Get Res: ', res.json());
                let PAParsedJsonData = res.json();
                let presence = PAParsedJsonData.PersonalAssistant.presence ? PAParsedJsonData.PersonalAssistant.presence.$ : null;
                switch (presence) {

                    case this.LUNCH: presence = this.customizedTextJson.out_of_office.lunch;
                        break;
                    case this.MEETING: presence = this.customizedTextJson.out_of_office.meeting;
                        break;
                    case this.TEMPORARILY_OUT: presence = this.customizedTextJson.out_of_office.temporarily_out;
                        break;
                    case this.BUSINESS_TRIP: presence = this.customizedTextJson.out_of_office.business_trip;
                        break;
                    case this.GONE_FOR_THE_DAY: presence = this.customizedTextJson.out_of_office.gone_for_the_day;
                        break;
                    case this.TRAINING: presence = this.customizedTextJson.out_of_office.training;
                        break;
                    case this.OUT_OF_OFFICE: presence = this.customizedTextJson.out_of_office.out_of_office;
                        break;
                    case this.UNAVAILABLE: presence = this.customizedTextJson.out_of_office.unavailable;
                        break;
                    case this.VACATION: presence = this.customizedTextJson.out_of_office.vacation;
                        break;
                    case this.NONE: presence = this.customizedTextJson.out_of_office.none;
                        break;
                }
                let isPAActive = (presence && presence !== this.customizedTextJson.out_of_office.none);
                let isExpirationTimeEnabled = (PAParsedJsonData.PersonalAssistant.enableExpirationTime.$ === 'true');
                let isTransferToAttendantEnabled = (PAParsedJsonData.PersonalAssistant.enableTransferToAttendant.$ === 'true');
                let expirationTime =
                    PAParsedJsonData.PersonalAssistant.expirationTime ? PAParsedJsonData.PersonalAssistant.expirationTime.$ : null;
                let isRngSplshActive = (PAParsedJsonData.PersonalAssistant.ringSplash.$ === 'true');
                let attendantNumber =
                    PAParsedJsonData.PersonalAssistant.attendantNumber ? PAParsedJsonData.PersonalAssistant.attendantNumber.$ : null;
                this.outOfficeServiceInput.setIsPAActive(isPAActive);
                this.outOfficeServiceInput.setPresence(presence);
                this.outOfficeServiceInput.setIsExpirationTimeEnabled(isExpirationTimeEnabled);
                this.outOfficeServiceInput.setIsTransferToAttendantEnabled(isTransferToAttendantEnabled);
                this.outOfficeServiceInput.setExpirationTime(expirationTime);
                this.outOfficeServiceInput.setIsRngSplshActive(isRngSplshActive);
                this.outOfficeServiceInput.setAttendantNumber(attendantNumber);
                postOutOfOfficeGet(null);
            },
            (err) => {
                console.log('OutofOffice Get Err: ', err);
                postOutOfOfficeGet(err)
            });
    }

    putPresenceOption(personalAssistantUrl, isExpTimeEnabled, selectedExpiryOption,
        selectedOption, selectedAvailabilityOption, updatedISOFormattedTime, postPutPresenceOption) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">' +
            '<presence>' + selectedAvailabilityOption + '</presence>';

        if (selectedOption && (selectedOption === this.customizedTextJson.out_of_office.vacation
            || selectedOption === this.customizedTextJson.out_of_office.unavailable
            || selectedOption === this.customizedTextJson.out_of_office.out_of_office
            || selectedOption === this.customizedTextJson.out_of_office.none)) {

            body += '<enableExpirationTime>' + isExpTimeEnabled + '</enableExpirationTime>';

        } else if (selectedOption && (selectedOption !== this.customizedTextJson.out_of_office.none)) {
            body += '<enableExpirationTime>' + isExpTimeEnabled + '</enableExpirationTime>'
                + '<expirationTime>' + updatedISOFormattedTime + '</expirationTime>';
        }

        body += '</PersonalAssistant>';

        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                console.log('Response: ', res);
                this.outOfficeServiceInput.setPresence(selectedOption);
                this.outOfficeServiceInput.setExpirationTime(updatedISOFormattedTime);
                this.outOfficeServiceInput.setExpirationTimeOption(selectedExpiryOption);
                this.outOfficeServiceInput.setIsExpirationTimeEnabled(isExpTimeEnabled);
                postPutPresenceOption(null);
            }, (err) => {
                postPutPresenceOption(err);
            });

    }

    putSelectedExpirationTime(personalAssistantUrl, updatedISOFormattedTime, postPutSelectedExpTime) {

        let body =
            '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">' +
            '<enableExpirationTime>true</enableExpirationTime>' +
            '<expirationTime>' + updatedISOFormattedTime + '</expirationTime></PersonalAssistant>';

        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                console.log('Response: ', res);
                this.outOfficeServiceInput.setExpirationTime(updatedISOFormattedTime);
                this.outOfficeServiceInput.setExpirationTimeOption('');
                // this.outOfficeServiceInput.setExpirationTimeOption(selectedOption);
                postPutSelectedExpTime(null);
            },
            (err) => {
                postPutSelectedExpTime(err)
            })
    }

    putAttendantTransferNo(personalAssistantUrl, userInpTransferNo, postAttendantTransferNoPut) {


        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">'
        let isTransferToAttendantEnabled;
        if (userInpTransferNo) {
            isTransferToAttendantEnabled = true;
            body += '<enableTransferToAttendant>' + isTransferToAttendantEnabled + '</enableTransferToAttendant>' +
                '<attendantNumber>' + userInpTransferNo + '</attendantNumber></PersonalAssistant>';
        } else if (userInpTransferNo === '') {
            isTransferToAttendantEnabled = false;
            this.outOfficeServiceInput.setIsTransferToAttendantEnabled(isTransferToAttendantEnabled);
            body += '<enableTransferToAttendant>' + isTransferToAttendantEnabled + '</enableTransferToAttendant>' +
                '<attendantNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/></PersonalAssistant>';
        }

        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                console.log('Response: ', res);
                this.outOfficeServiceInput.setAttendantNumber(userInpTransferNo);
                this.outOfficeServiceInput.setIsTransferToAttendantEnabled(isTransferToAttendantEnabled);
                postAttendantTransferNoPut(null);
            },
            (err) => {
                postAttendantTransferNoPut(err);
            })
    }

    putRingSplashChecked(personalAssistantUrl, isRingSplashChecked, postRingSplashPut) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">' +
            '<ringSplash>' + isRingSplashChecked + '</ringSplash></PersonalAssistant>';

        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                this.outOfficeServiceInput.setIsRngSplshActive(isRingSplashChecked);
                postRingSplashPut(null);
            },
            (err) => {
                postRingSplashPut(err);
            });
    }

    putUntilChecked(personalAssistantUrl, isUntilChecked, postUntilCheckedPut) {
        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>'
            + '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">'
            + '<enableExpirationTime>' + isUntilChecked + '</enableExpirationTime>'
            + '</PersonalAssistant>';
        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                this.outOfficeServiceInput.setIsExpirationTimeEnabled(isUntilChecked);
                postUntilCheckedPut(null, isUntilChecked);
            },
            (err) => {
                postUntilCheckedPut(err, isUntilChecked);
            });

    }

    putTransferEnabled(personalAssistantUrl, isTransferEnabled, postTransferEnabledPut) {
        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>'
            + '<PersonalAssistant xmlns="http://schema.broadsoft.com/xsi">'
            + '<enableTransferToAttendant>' + isTransferEnabled + '</enableTransferToAttendant></PersonalAssistant>';
        this.httpServices.httpPutRequest(personalAssistantUrl, body)
            .subscribe((res) => {
                this.outOfficeServiceInput.setIsTransferToAttendantEnabled(isTransferEnabled);
                postTransferEnabledPut(null);
            },
            (err) => {
                postTransferEnabledPut(err);
            });

    }

    fetchIsPAActive() {
        return this.outOfficeServiceInput.getIsPAActive();
    }

    fetchIsUntilActive() {
        return this.outOfficeServiceInput.getIsUntilActive();
    }

    fetchPresence() {
        return this.outOfficeServiceInput.getPresence();
    }

    fetchIsExpirationTimeEnabled() {
        return this.outOfficeServiceInput.getIsExpirationTimeEnabled();
    }

    fetchIsTransferToAttendantEnabled() {
        return this.outOfficeServiceInput.getIsTransferToAttendantEnabled();
    }

    fetchExpirationTime() {
        return this.outOfficeServiceInput.getExpirationTime();
    }

    fetchExpirationTimeOption() {
        return this.outOfficeServiceInput.getExpirationTimeOption();
    }

    fetchIsRngSplshActive() {
        return this.outOfficeServiceInput.getIsRngSplshActive();
    }

    fetchTransferNo() {
        return this.outOfficeServiceInput.getAttendantNumber();
    }

    setIsPAActive(isPAActive) {
        this.outOfficeServiceInput.setIsPAActive(isPAActive);
    }

}

