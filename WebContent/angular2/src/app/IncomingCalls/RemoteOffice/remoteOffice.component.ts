/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { RemoteOfficeService } from 'app/IncomingCalls/RemoteOffice/remoteOffice.service';
import { IncomingComponent } from 'app/IncomingCalls/incoming.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { Util } from 'app/AppCommon/util';

@Component({
    selector: 'remoteOffice',
    templateUrl: 'remoteOffice.component.html',
    providers: [ServiceRouteProvider, RemoteOfficeService, IncomingComponent]
})

export class RemoteOfficeComponent implements AfterViewInit, OnInit {

    private isBlurInvokedForPhNum = false;
    @Output('onRONumberChange') onRONumberChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    inputWidth = 160;
    isRemoteOfficeInputFieldFocused = false;
    roPhonenumberFieldValidationError = '';
    customizedTextJson = window['customizedTexts'];
    remoteOfficeNumber;
    roUpdateSrvErrMsg: string;
    constructor(private serviceRouteProvider: ServiceRouteProvider, private incomingComponent: IncomingComponent,
                  private remoteOfficeService: RemoteOfficeService,
        private util: Util) {
    }

    ngOnInit() {

        this.remoteOfficeNumber = this.remoteOfficeService.fetchRemoteOfficeNumber();

    }

    ngAfterViewInit() {
        let self = this;
        setTimeout(function () {
            self.validateROPhoneNumber();
        }, 1);
    }

    validateROPhoneNumber() {
        if (!this.remoteOfficeNumber) {
            this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
        }
    }



    onPhonenumberChange(event) {
        let key;
        this.roUpdateSrvErrMsg = '';
        this.isRemoteOfficeInputFieldFocused = true;
        if (event.key) {
            key = event.key;
        } else {
            key = String.fromCharCode(event.keyCode);
        }
        if (key === 'Enter') {
            this.onAdditionalsettingsPhonenumberBlur(event);
        } else if (!this.util.phoneNumberRegx.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) {
                event.preventDefault();
            }
            if (event.srcElement.value === '') {
                this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
            }
        } else {
            this.roPhonenumberFieldValidationError = '';
        }
    }

    onPasteEvent(event) {
        this.util.validatePhoneNumberOnCopyPaste(event);
    }

    updateInputCotainerWidth() {
        this.inputWidth = this.util.getInputDynamicWidth(this.remoteOfficeNumber);
    }

    onAdditionalsettingsPhonenumberBlur(event) {

        this.isRemoteOfficeInputFieldFocused = false;
        if (!this.isBlurInvokedForPhNum) {
            this.roUpdateSrvErrMsg = '';
            this.isBlurInvokedForPhNum = true;
            let pnumber = event.target.value;
            if (!pnumber) {
                this.remoteOfficeService.setRemoteOfficeNumber('');
                this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
                this.incomingComponent.isRemoteOfficeChecked = false;
                this.setRemoteOfficeInput(this.incomingComponent.isRemoteOfficeChecked);

                this.onRONumberChange.emit(false);

            } else if (pnumber && !(this.util.isValidSipUri(pnumber) || this.util.isE164valid(pnumber))) {
                this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.invalid_phone_number_msg;
            } else {
                this.roPhonenumberFieldValidationError = '';
                this.incomingComponent.isRemoteOfficeChecked = true;
                this.setRemoteOfficeInput(this.incomingComponent.isRemoteOfficeChecked);
            }
        }

    }

    stopRedundantBlurCall() {
        this.isBlurInvokedForPhNum = false;
    }

    setRemoteOfficeInput(isRemoteOfficeChecked) {

        this.roUpdateSrvErrMsg = '';
        this.incomingComponent.isRoServiceFetched = false;
        this.remoteOfficeService.putRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), isRemoteOfficeChecked,
                                  this.remoteOfficeNumber, this.postROPut.bind(this));
    }

    /*Callback method to be invoked after the server has responded for Remote Office service HTTP PUT request*/
    postROPut(error) {

        this.remoteOfficeNumber = this.remoteOfficeService.fetchRemoteOfficeNumber();
        if (error) {
            console.log('Error object: ', error.status);
            if (error.status === 0) {
                this.roUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.roUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        }
    }
}
