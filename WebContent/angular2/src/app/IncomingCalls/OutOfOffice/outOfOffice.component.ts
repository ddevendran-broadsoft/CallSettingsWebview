import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { OutOfOfficeService } from 'app/IncomingCalls/OutOfOffice/outOfOfficeService.service';
import { IncomingComponent } from 'app/IncomingCalls/incoming.component';
import { Util } from 'app/AppCommon/util';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import * as moment from 'moment';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {FormControl} from '@angular/forms';


@Component({
    selector: 'app-out-of-office',
    templateUrl: 'outOfOffice.component.html',
    providers: [IncomingComponent, Util, OutOfOfficeService, XSIServices, {provide: MAT_DATE_LOCALE, useValue: window['locale']},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})

export class OutOfOfficeComponent implements OnInit {

    isUntilToggleDisabled = false;
    isUntilFetched = true;
    isEnableTransferFetched = true;
    transferEnableErrMsg: any;
    untilUpdateErrMsg: any;
    isUntilChecked: boolean;
    paRetrievingError: string;
    pAFetchErrMsg: string;
    isPAFetched: boolean;
    paVisible: any;
    isDateTimeSelectorFocused = false;
    private isBlurInvokedForPhNUm = false;
    private isCurrentDateTimeSelected: boolean;
    private selectedExpirationTime: any;
    private expirationTimeText: any;
    private ddmmyyyy;
    private isPAActive: boolean;
    private isUntilFocused = false;
    private ONE_HOUR_MILLIS = 1 * 60 * 60 * 1000;
    private DEFAULT_MEETING_TIME = 1 * 60 * 60 * 1000;
    private DEFAULT_TEMP_OUT_TIME = 1 * 60 * 60 * 1000;

    isPhoneNumFocused = false;
    ringSplashUpdErrMsg: any;
    isRingSplashChecked: any;
    transferNoUpdateErrMsg: any;
    transferNo: any;
    selectedExpiryOption: any;
    expiryTimeUpdateErrMsg: any;
    formatErrMsg: any;
    presenceUpdateErrMsg: any;
    customizedTextJson = window['customizedTexts'];
    availability = [];
    isTransferFocused = false;
    presence;
    currentDateTime;
    isTransferEnabled = false;

    constructor(private util: Util, private outOfOfficeService: OutOfOfficeService, private serviceRouteProvider: ServiceRouteProvider,
        private xsiServices: XSIServices, private adapter: DateAdapter<any>) {

        this.availability = [this.customizedTextJson.out_of_office.none, this.customizedTextJson.out_of_office.business_trip,
        this.customizedTextJson.out_of_office.gone_for_the_day,
        this.customizedTextJson.out_of_office.lunch, this.customizedTextJson.out_of_office.meeting,
        this.customizedTextJson.out_of_office.out_of_office,
        this.customizedTextJson.out_of_office.temporarily_out, this.customizedTextJson.out_of_office.training,
        this.customizedTextJson.out_of_office.unavailable,
        this.customizedTextJson.out_of_office.vacation];
    }

    ngOnInit() {

        if (IncomingComponent.isPAFetchingFirstTime) {
            this.initializeAvailability();
            this.initializeExpirationTime();
            this.initializeSelectedExpiryOption();
            this.initializeAttendantTransfer();
            this.initializeTransferEnabled();
            this.initializeRingSplash();
            IncomingComponent.isPAFetchingFirstTime = false;
        } else {
            this.initializeOutOfOffice();
        }

    }

    initializeOutOfOffice() {


        if (this.serviceRouteProvider.fetchPersonalAssistantUrl()) {
            this.paVisible = this.xsiServices.fetchPAVisible();
        }
        if (this.paVisible) {
            this.isPAFetched = false;
            this.pAFetchErrMsg = '';
            this.paRetrievingError = '';
            this.outOfOfficeService.getPersonalAssistantData(this.serviceRouteProvider.fetchPersonalAssistantUrl(),
                this.postOutOfOfficeGet.bind(this));
        }
    }

    postOutOfOfficeGet(error) {

        this.isPAFetched = true;
        if (error) {

            if (error.status === 0) {
                this.pAFetchErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.pAFetchErrMsg = this.customizedTextJson.error.unabletofetch;
            }
        }
        this.isPAActive = this.outOfOfficeService.fetchIsPAActive();
        this.initializeAvailability();
        this.initializeExpirationTime();
        this.initializeSelectedExpiryOption();
        this.initializeAttendantTransfer();
        this.initializeTransferEnabled();
        this.initializeRingSplash();

    }

    initializeAvailability() {
        this.presence = this.outOfOfficeService.fetchPresence();
        if (this.presence === this.customizedTextJson.out_of_office.none) {
            this.isUntilToggleDisabled = true;
        }
    }

    initializeExpirationTime() {

        this.currentDateTime = this.outOfOfficeService.fetchExpirationTime();
        if (this.currentDateTime) {
            this.currentDateTime = this.util.setFetchedTimeToLocalTime(this.currentDateTime);
            console.log('this.currentDateTime: ', this.currentDateTime);
        }

    }

    initializeSelectedExpiryOption() {

        let selectedOption = this.presence;

        if (!this.outOfOfficeService.fetchIsExpirationTimeEnabled() && this.presence !== this.customizedTextJson.out_of_office.none) {
            this.selectedExpiryOption = this.customizedTextJson.out_of_office.forever;
            this.isUntilChecked = false;
        } else if (this.presence === this.customizedTextJson.out_of_office.none) {
            this.isUntilChecked = false;
        } else {
            this.isUntilChecked = true;
        }
    }

    initializeAttendantTransfer() {

        if (this.outOfOfficeService.fetchTransferNo()) {
            this.transferNo = this.outOfOfficeService.fetchTransferNo();
        }
    }

    initializeRingSplash() {

        if (this.outOfOfficeService.fetchIsRngSplshActive()) {
            this.isRingSplashChecked = this.outOfOfficeService.fetchIsRngSplshActive();
        }
    }

    initializeTransferEnabled() {
        if (this.outOfOfficeService.fetchIsTransferToAttendantEnabled()) {
            this.isTransferEnabled = this.outOfOfficeService.fetchIsTransferToAttendantEnabled();
        }
    }


    setTransferFocus() {

        this.isTransferFocused = true;
    }

    setUntilFocus() {

        this.isUntilFocused = true;
    }


    blurTransfer() {

        this.isTransferFocused = false;
    }

    blurUntil() {
        this.isUntilFocused = false;
    }

    clearErrMsgs() {
        this.presenceUpdateErrMsg = '';
        this.expiryTimeUpdateErrMsg = '';
        this.ringSplashUpdErrMsg = '';
        this.transferEnableErrMsg = '';
        this.untilUpdateErrMsg = '';
        this.transferNoUpdateErrMsg = '';
        this.formatErrMsg = '';
    }

    onSelectAvailability(event) {
        this.clearErrMsgs();
        this.isUntilToggleDisabled = false;
        let selectedOption = event.srcElement.value;
        let selectedAvailabilityOption;
        let updatedISOTime = '';
        if (selectedOption === this.customizedTextJson.out_of_office.lunch ||
            selectedOption === this.customizedTextJson.out_of_office.meeting ||
            selectedOption === this.customizedTextJson.out_of_office.temporarily_out) {

            updatedISOTime = this.getExpTimeInISO(this.ONE_HOUR_MILLIS);
            this.isUntilChecked = true;
            this.selectedExpiryOption = this.customizedTextJson.out_of_office.one_hour;

        } else if (selectedOption === this.customizedTextJson.out_of_office.business_trip ||
            selectedOption === this.customizedTextJson.out_of_office.gone_for_the_day ||
            selectedOption === this.customizedTextJson.out_of_office.training) {

            updatedISOTime = this.util.getEndOfTheDayTimeISO(new Date().getTime())
            this.isUntilChecked = true;
            this.selectedExpiryOption = this.customizedTextJson.out_of_office.one_day;
        } else if (selectedOption === this.customizedTextJson.out_of_office.out_of_office ||
            selectedOption === this.customizedTextJson.out_of_office.unavailable ||
            selectedOption === this.customizedTextJson.out_of_office.vacation) {
            updatedISOTime = this.outOfOfficeService.fetchExpirationTime();
            this.isUntilChecked = false;
            this.selectedExpiryOption = this.customizedTextJson.out_of_office.forever;
        } else {
            this.isUntilChecked = false;
            this.selectedExpiryOption = '';

        }

        switch (selectedOption) {

            case this.customizedTextJson.out_of_office.lunch: selectedAvailabilityOption = this.outOfOfficeService.LUNCH;
                break;
            case this.customizedTextJson.out_of_office.meeting: selectedAvailabilityOption = this.outOfOfficeService.MEETING;
                break;
            case this.customizedTextJson.out_of_office.temporarily_out: selectedAvailabilityOption =
                this.outOfOfficeService.TEMPORARILY_OUT;
                break;
            case this.customizedTextJson.out_of_office.business_trip: selectedAvailabilityOption = this.outOfOfficeService.BUSINESS_TRIP;
                break;
            case this.customizedTextJson.out_of_office.gone_for_the_day: selectedAvailabilityOption =
                this.outOfOfficeService.GONE_FOR_THE_DAY;
                break;
            case this.customizedTextJson.out_of_office.training: selectedAvailabilityOption = this.outOfOfficeService.TRAINING;
                break;
            case this.customizedTextJson.out_of_office.out_of_office: selectedAvailabilityOption = this.outOfOfficeService.OUT_OF_OFFICE;
                break;
            case this.customizedTextJson.out_of_office.unavailable: selectedAvailabilityOption = this.outOfOfficeService.UNAVAILABLE;
                break;
            case this.customizedTextJson.out_of_office.vacation: selectedAvailabilityOption = this.outOfOfficeService.VACATION;
                break;
            case this.customizedTextJson.out_of_office.none: selectedAvailabilityOption = this.outOfOfficeService.NONE;
                break;
        }
        this.outOfOfficeService.putPresenceOption(this.serviceRouteProvider.fetchPersonalAssistantUrl(), this.isUntilChecked,
            this.selectedExpiryOption, selectedOption, selectedAvailabilityOption, updatedISOTime,
            this.postPutPresenceOption.bind(this));

    }

    getExpTimeInISO(defaultExpTime) {

        let currentEpoch = new Date().getTime();
        currentEpoch += defaultExpTime;
        return this.util.getISOLocalDateTime(currentEpoch);
    }

    postPutPresenceOption(error) {
        if (error) {
            if (error.status === 0) {
                this.presenceUpdateErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.presenceUpdateErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        }
        this.presence = this.outOfOfficeService.fetchPresence();
        if (this.presence === this.customizedTextJson.out_of_office.none) {
            this.isUntilToggleDisabled = true;
        }
        this.isUntilChecked = this.outOfOfficeService.fetchIsExpirationTimeEnabled();
        if (this.presence && this.presence !== this.customizedTextJson.out_of_office.none) {
            this.outOfOfficeService.setIsPAActive(true);
        } else {
            this.outOfOfficeService.setIsPAActive(false);
        }
        if (this.presence && this.presence !== this.customizedTextJson.out_of_office.vacation
            && this.presence !== this.customizedTextJson.out_of_office.unavailable
            && this.presence !== this.customizedTextJson.out_of_office.out_of_office) {
            this.currentDateTime = this.util.setFetchedTimeToLocalTime(new Date(this.outOfOfficeService.fetchExpirationTime()).getTime());

        }
        this.selectedExpiryOption = this.outOfOfficeService.fetchExpirationTimeOption();
        console.log('getLocalDateTimeForUI: ', this.currentDateTime)
    }

    selectExpirationTimeOption(event) {
        this.isDateTimeSelectorFocused = false;
        this.clearErrMsgs();
        this.isUntilFocused = false;
        let selectedTimeInEpoch = event.value;
        if (selectedTimeInEpoch) {
            let selectedDate = + new Date(selectedTimeInEpoch);
            console.log('new Date(selectedTimeInEpoch)', new Date(selectedTimeInEpoch));
            let updatedISOTimeFormat = moment(selectedDate).format('YYYY-MM-DD\T\HH:mm:ss.SSS\Z');
            this.outOfOfficeService.putSelectedExpirationTime(this.serviceRouteProvider.fetchPersonalAssistantUrl(), updatedISOTimeFormat,
            this.postPutSelectedExpTime.bind(this));
        }
    }

    postPutSelectedExpTime(error) {

        if (error) {
            console.log('Error obj: ', error);
            if (error.status === 0) {
                this.expiryTimeUpdateErrMsg = this.customizedTextJson.error.networkerror;

            } else {
                console.log('error._body = ', error._body);
                let errObj = JSON.parse(error._body);
                if (errObj.ErrorInfo.errorCode.$ === '18955' || errObj.ErrorInfo.errorCode.$ === '18956') {
                    this.expiryTimeUpdateErrMsg = this.customizedTextJson.out_of_office.expire_time_err;
                } else {
                    this.expiryTimeUpdateErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
                }

            }
        }
        this.selectedExpiryOption = this.outOfOfficeService.fetchExpirationTimeOption();
        this.currentDateTime = this.util.getLocalDateTimeForUI(new Date(this.outOfOfficeService.fetchExpirationTime()).getTime());
    }

    getUserInpTranferNo(event) {

        this.isPhoneNumFocused = false;
        if (!this.isBlurInvokedForPhNUm) {
            this.clearErrMsgs();
            this.isBlurInvokedForPhNUm = true;
            let userInpTransferNo = event.srcElement.value;
            if (!userInpTransferNo || (userInpTransferNo
                && (this.util.isE164valid(userInpTransferNo) || this.util.isValidSipUri(userInpTransferNo)))) {
                this.outOfOfficeService.putAttendantTransferNo(this.serviceRouteProvider.fetchPersonalAssistantUrl(),
                    userInpTransferNo, this.postAttendantTransferNoPut.bind(this));
            } else {
                this.transferNoUpdateErrMsg = this.customizedTextJson.error.invalid_number;
            }
        }
    }

    toggleEnableTransfer() {

        this.clearErrMsgs();

        if (this.isTransferEnabled) {
            this.isTransferEnabled = false;
        } else {
            this.isTransferEnabled = true;
            if (!this.outOfOfficeService.fetchTransferNo()) {
                this.transferNoUpdateErrMsg = this.customizedTextJson.error.number_required;
            }
        }
        if (!this.transferNoUpdateErrMsg) {
            this.isEnableTransferFetched = false;
            this.outOfOfficeService.putTransferEnabled(this.serviceRouteProvider.fetchPersonalAssistantUrl(), this.isTransferEnabled,
                this.postTransferEnabledPut.bind(this));
        }
        console.log('this.isTransferEnabled = ', this.isTransferEnabled);

    }

    postTransferEnabledPut(error) {

        this.isEnableTransferFetched = true;
        if (error) {
            if (error.status === 0) {
                this.transferEnableErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.transferEnableErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        }
        this.isTransferEnabled = this.outOfOfficeService.fetchIsTransferToAttendantEnabled();
    }

    stopRedundantBlurCall() {
        this.isBlurInvokedForPhNUm = false;
    }

    postAttendantTransferNoPut(error) {

        if (error) {
            if (error.status === 0) {
                this.transferNoUpdateErrMsg = this.customizedTextJson.error.networkerror;
            } else {

                let errObj = JSON.parse(error._body);

                this.transferNoUpdateErrMsg = this.customizedTextJson.error.updatefailed;
                // this.transferNoUpdateErrMsg = errObj.ErrorInfo.
            }
        }
        this.transferNo = this.outOfOfficeService.fetchTransferNo();
        this.isTransferEnabled = this.outOfOfficeService.fetchIsTransferToAttendantEnabled();
    }

    ringSplashActive() {

        this.clearErrMsgs();
        if (this.isRingSplashChecked) {
            this.isRingSplashChecked = false;
        } else {
            this.isRingSplashChecked = true;
        }
        this.outOfOfficeService.putRingSplashChecked(this.serviceRouteProvider.fetchPersonalAssistantUrl(), this.isRingSplashChecked,
            this.postRingSplashPut.bind(this));
    }

    toggleUntil() {

        this.clearErrMsgs();
        if (this.isUntilChecked) {
            this.isUntilChecked = false;
        } else {
            if (!(this.outOfOfficeService.fetchExpirationTime()) || this.outOfOfficeService.fetchExpirationTime() === '') {
                this.untilUpdateErrMsg = this.customizedTextJson.out_of_office.date_time_require;
            }
            this.isUntilChecked = true;
        }
        if (!this.untilUpdateErrMsg) {
            this.isUntilFetched = false;
            this.outOfOfficeService.putUntilChecked(this.serviceRouteProvider.fetchPersonalAssistantUrl(), this.isUntilChecked,
                this.postUntilCheckedPut.bind(this));
        }

    }

    postRingSplashPut(error) {

        if (error) {
            if (error.status === 0) {
                this.ringSplashUpdErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.ringSplashUpdErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        }
        this.isRingSplashChecked = this.outOfOfficeService.fetchIsRngSplshActive();
    }

    postUntilCheckedPut(error, isUntilChecked) {

        this.isUntilFetched = true;
        if (error) {
            if (error.status === 0) {
                this.untilUpdateErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.untilUpdateErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        } else {
            this.selectedExpiryOption = !isUntilChecked && this.presence
                !== this.customizedTextJson.none ? this.customizedTextJson.out_of_office.forever : '';
        }
        this.isUntilChecked = this.outOfOfficeService.fetchIsExpirationTimeEnabled();
    }

    focusNewNumberInp(event) {

        if (event.key !== 'Enter' && event.key !== 'Tab') {
            this.transferNoUpdateErrMsg = '';
            this.isPhoneNumFocused = true;
        }
    }

    focusDateTimeSelector(event) {
        this.isDateTimeSelectorFocused = true;
        console.log('event', event);
    }

}
