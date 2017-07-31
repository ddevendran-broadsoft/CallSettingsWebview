/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { RemoteOfficeService } from 'app/IncomingCalls/RemoteOffice/remoteOffice.service';
import { incomingComponent } from 'app/IncomingCalls/incoming.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { Util } from 'app/AppCommon/util';

@Component({
    selector: 'remoteOffice',
    templateUrl: 'remoteOffice.component.html',
    providers: [ServiceRouteProvider, RemoteOfficeService, incomingComponent]
})

export class remoteOfficeComponent implements AfterViewInit {

    @Output("onRONumberChange") onRONumberChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    customizedTextJson = window['customizedTexts'];
    remoteOfficeNumber;
    isRemoteOfficeInputFieldFocused: boolean = false;
    roUpdateSrvErrMsg: string;
    inputWidth = 160;

    private roPhonenumberFieldValidationError: string = "";

    constructor(private serviceRouteProvider: ServiceRouteProvider, private incomingComponent: incomingComponent, private remoteOfficeService: RemoteOfficeService,
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

    private validateROPhoneNumber() {
        if (!this.remoteOfficeNumber) {
            this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
        }
    }

    /*This method validates for each keystroke given by the user*/
    private onPhonenumberChange(event) {
        let key;
        this.roUpdateSrvErrMsg = "";
        this.isRemoteOfficeInputFieldFocused = true;
        if (event.key) {
            key = event.key;
        } else {
            key = String.fromCharCode(event.keyCode);
        }
        if (key == "Enter") {
            this.onAdditionalsettingsPhonenumberBlur(event);
        } else if (!this.util.phoneNumberRegx.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) {
                event.preventDefault();
            }
            if (event.srcElement.value == "") {
                this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
            }
        } else {
            this.roPhonenumberFieldValidationError = "";
        }
    }

    private updateInputCotainerWidth() {
        this.inputWidth = this.util.getInputDynamicWidth(this.remoteOfficeNumber);
    }

    private onAdditionalsettingsPhonenumberBlur(event) {

        this.roUpdateSrvErrMsg = "";
        this.isRemoteOfficeInputFieldFocused = false;
        let pnumber = event.target.value;
        if (!pnumber) {
            this.remoteOfficeService.setRemoteOfficeNumber("");
            this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.err_msg;
            this.incomingComponent.isRemoteOfficeChecked = false;
            this.setRemoteOfficeInput(this.incomingComponent.isRemoteOfficeChecked);

            this.onRONumberChange.emit(false);

        } else if (pnumber && !(this.util.isValidSipUri(pnumber) || this.util.isE164valid(pnumber))) {
            this.roPhonenumberFieldValidationError = this.customizedTextJson.remote_office.invalid_phone_number_msg;
        } else {
            this.roPhonenumberFieldValidationError = "";
            this.incomingComponent.isRemoteOfficeChecked = true;
            this.setRemoteOfficeInput(this.incomingComponent.isRemoteOfficeChecked);
        }
    }

    /*This method sends the updated Remote office number to the server*/
    private setRemoteOfficeInput(isRemoteOfficeChecked) {

        this.roUpdateSrvErrMsg = "";
        this.incomingComponent.isRoServiceFetched = false;
        this.remoteOfficeService.putRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), isRemoteOfficeChecked, this.remoteOfficeNumber, this.postROPut.bind(this));
    }

    /*Callback method to be invoked after the server has responded for Remote Office service HTTP PUT request*/
    postROPut(error) {

        this.remoteOfficeNumber = this.remoteOfficeService.fetchRemoteOfficeNumber();
        if (error) {
            if (error.status == 0) {
                this.roUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
            } else {
                this.roUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
            }
        }
    }
}