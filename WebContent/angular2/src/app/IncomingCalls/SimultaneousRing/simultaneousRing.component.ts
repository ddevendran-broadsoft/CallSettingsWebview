/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';

import {IncomingComponent} from 'app/IncomingCalls/incoming.component';
import { SimultaneousRingService } from 'app/IncomingCalls/SimultaneousRing/simultaneousRing.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { SimultaneousRingServiceInput } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { SimRingArray } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { CriteriaArray } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { Util } from 'app/AppCommon/util';
@Component({
  selector: 'app-simultaneous-ring',
  templateUrl: 'simultaneousRing.component.html',
  providers: [SimultaneousRingService]
})

export class SimultaneousRingComponent implements OnInit {


  private duplicateSimRingIndex = 100;  // initially should not point any object
  private isSimultaneousRingActive = false;
  private RING_NUMBERS_UPDATE_FLAG = 1; // Setting the value for the update choice
  private CRITERIA_UPDATE_FLAG = 2;    // Setting the value for the update choice
  private SIM_RING_DEFAULT_UPDATE_FLAG = 0; // Setting the value for default update choice
  private simultaneousRingVisible: boolean;
  simRingUpdateError: String = '';
  simRingRetrievingError;
  isSimRingUpdateInProgress = false;
  isWhenToRingExpanded = false;
  isDoNotRingWhenOnCallUpdateError = '';
  isDoNotRingWhenOnCallUpdateInprogress = false;
  isRingNumbersChecked = false;
  isDoNotRingWhenOnCallChecked = false;
  phoneNumberMaxLength: number;
  isPreviousEnterUpdate = false;
  customizedTextJson = window['customizedTexts'];
  simRingArray: SimRingArray[] = new Array();
  criteriaArray: CriteriaArray[] = new Array();

  constructor(private simultaneousRingService: SimultaneousRingService, private serviceRouteProvider: ServiceRouteProvider,
    private simultaneousRingServiceInput: SimultaneousRingServiceInput,
    private util: Util, private xsiServices: XSIServices) {
    this.phoneNumberMaxLength = this.util.INPUTMAXLENGTH;
  }

  ngOnInit() {

    if (IncomingComponent.simRingExpandGet === true) {
      this.isDoNotRingWhenOnCallChecked = this.simultaneousRingService.fetchIsDoNotRingWhenOnCallChecked();
      this.isSimultaneousRingActive = this.simultaneousRingService.fetchIsSimultaneousRingActive();
      this.isRingNumbersChecked = this.isSimultaneousRingActive;
      this.criteriaArray = this.simultaneousRingService.fetchCriteriaArray();
      this.simRingArray = this.simultaneousRingService.fetchSimRingArray();
      IncomingComponent.simRingExpandGet = false;
      this.addDefaultPhoneNumberEntry();
    } else {
      if (this.serviceRouteProvider.fetchSimultaneousRingUrl()) {
        this.simultaneousRingVisible = this.xsiServices.fetchSimultaneousRingVisible();
      }
      if (this.simultaneousRingVisible) {
        this.simRingRetrievingError = '';
        this.simRingUpdateError = '';
        this.simultaneousRingService.getSimultaneousRingService(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
                                        this.postSimultaneousRingGet.bind(this));
      }
    }
    if (!this.criteriaArray) {
      this.criteriaArray = new Array();
    }
    if (!this.simRingArray) {
      this.simRingArray = new Array();
    }
  }

  private addDefaultPhoneNumberEntry() {
    if (!this.simRingArray.length || (this.simRingArray[this.simRingArray.length - 1].getNumber() && this.simRingArray.length <= 9)) {
      let simrArray = new SimRingArray('', true);        // for new entry
      if (!this.simRingArray.length) {
        simrArray.setError(this.customizedTextJson.simultaneous_ring.phone_number_required);
      }
      this.simRingArray.push(simrArray);
    }
  }

  private onPhonenumberChange(event: any) {
    // this.clearErrorMessages();

    let inputId = event.srcElement.id;
    let index = parseInt(inputId.charAt(0));
    this.clearFieldErrorMessage(index);
    this.simRingArray[index].setIsValidNumber(true);      // updates the input border color as green
    if (event.key !== 'Enter') {
      this.isPreviousEnterUpdate = false;
    }
  }

  clearFieldErrorMessage(index: number) {
    this.simRingArray[index].setError('');
  }

  clearErrorMessages() {

    this.simRingUpdateError = '';
    for (let i = 0; i < this.simRingArray.length; i++) {
      this.simRingArray[i].setError('');
    }
  }

  onfocus(simRingArray: SimRingArray) {
    if (simRingArray.getError()) {
      simRingArray.setIsValidNumber(false);
    } else {
      simRingArray.setIsValidNumber(true);
    }
  }

  simultaneousRingNumberEntered(event) {


    let self = this;
    setTimeout(function () {

      let inputId = event.srcElement.id;
      let input = event.srcElement.value;

      let index = parseInt(inputId.charAt(0));
      self.simRingArray[index].setIsValidNumber(false);

      if (!self.isPreviousEnterUpdate) {
        if (input) {
          self.simRingArray[index].setNumber(input);
          self.deleteTempDeletedSimRingArrayElements();
          // } else if (index != self.simRingArray.length - 1) {
          //   self.simultaneousRingNumberDelete(index);
        } else if (index === self.simRingArray.length - 1) { // Should make last phonenumber  empty
          self.simRingArray[self.simRingArray.length - 1].setNumber('');
          if (index) {
            self.simRingArray[self.simRingArray.length - 1].setError('');
          } else {
            self.setDefaultNoReqError();
          }
        }
        self.validateDuplicatePhoneNumbers();

        let isValidateData: boolean = self.validatePhoneNumbers(input, index);
        if (!input && index !== self.simRingArray.length - 1) {
          self.simultaneousRingNumberDelete(index, isValidateData);
        }
        if (isValidateData) {
          if (!self.simRingArray[0].getNumber()) {
            self.simultaneousRingServiceInput.setIsSimultaneousRingActive(false);
            self.isRingNumbersChecked = false;
          }
          self.isSimRingUpdateInProgress = true;
          self.simultaneousRingService.sendSimultaneousRingPut(self.serviceRouteProvider.fetchSimultaneousRingUrl(),
            self.updateSimultaneousRingServiceCb.bind(self), self.RING_NUMBERS_UPDATE_FLAG);
        }
      }

    }, 100);


  }

  private setDefaultNoReqError() {
    this.simRingArray[0].setError(this.customizedTextJson.simultaneous_ring.phone_number_required);
  }

  private validatePhoneNumbers(number: string, index: number) {
    return this.isAllPhoneNumbersValid() && !this.isPNumberAlreadyExist(number, index) && this.hasNoDuplicatePhoneNumbers();
  }

  private isAllPhoneNumbersValid() {// Validates all phone numbers
    let flag = true;
    if (this.simRingArray) {
      let sArray: SimRingArray;
      for (let i = 0; i < this.simRingArray.length; i++) {
        sArray = this.simRingArray[i];
        if (sArray.getNumber()) {
          if (!sArray.isPersisted() || (sArray.isPersisted() && sArray.getPersistedNumber() !== sArray.getNumber())) {
            if (!(this.util.isE164valid(sArray.getNumber()) || this.util.isValidSipUri(sArray.getNumber()))) {
              sArray.setError(this.customizedTextJson.remote_office.invalid_phone_number_msg);
              flag = false;
            }
          }
        }
      }
    }
    return flag;
  }

  private isPNumberAlreadyExist(pnumber: string, index: number) {
    let noAlreadyExists = false;
    if (this.simRingArray.length > 1) {
      for (let i = 0; i < this.simRingArray.length; i++) {
        if (index !== i) {
          if (!this.simRingArray[i].isTempDeleted() && pnumber && pnumber === this.simRingArray[i].getNumber()) {
            this.setAsDuplicatePhNumEntry(index, pnumber);
            this.setAsDuplicatePhNumEntry(i, pnumber);
            noAlreadyExists = true;
          }
        }
      }
    }
    return noAlreadyExists;
  }

  private hasNoDuplicatePhoneNumbers() {
    if (this.simRingArray.length > 1) {
      for (let i = 0; i < this.simRingArray.length; i++) {
        if (this.simRingArray[i].getNumber() && this.isPNumberAlreadyExist(this.simRingArray[i].getNumber(), i)) {
          return false;
        }
      }
    }
    return true;
  }

  private validateDuplicatePhoneNumbers() {
    if (this.simRingArray.length > 1) {
      for (let i = 0; i < this.simRingArray.length; i++) {
        if (this.simRingArray[i].getNumber() && !this.isPNumberAlreadyExist(this.simRingArray[i].getNumber(), i)) {
          this.simRingArray[i].setError('');
        }
      }
    }
  }

  private setAsDuplicatePhNumEntry(index: number, pnumber: string) {

    this.simRingArray[index].setError(this.customizedTextJson.error.numberexist);
  }

  updateSimultaneousRingServiceCb(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
         errorStatus = ' ' + res.status;
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.limit_exceeded, errorStatus);
        }
      }
      this.isSimRingUpdateInProgress = false;
    } else {    // populate pojo with server details

      this.markAllPhoneNumbersAsPersisted();
      this.clearErrorMessages();
      this.isPreviousEnterUpdate = true;
      if (this.simRingArray[this.simRingArray.length - 1].getNumber()) {// for new entry
        if (this.simRingArray.length <= 9) {
          let simRingArray = new SimRingArray('', true);
          this.simRingArray.push(simRingArray);
        }
      }
    }

    this.updateSimultaniousRingHeader(false);
  }

  private markAllPhoneNumbersAsPersisted() {
    for (let i = 0; i < this.simRingArray.length; i++) {
      if (this.simRingArray[i].getNumber()) {
        this.simRingArray[i].setPersisted(true);
        this.simRingArray[i].setPersistedNumber(this.simRingArray[i].getNumber());
        this.simRingArray[i].setPersistedAnswerConfirmation(this.simRingArray[i].getIsAnswerConfirmationRequired());
      }
    }
  }

  private updateSimultaniousRingHeader(isFromSwitch) {
    let flag = false;
    for (let i = 0; i < this.simRingArray.length; i++) {
      if (this.simRingArray[i].isPersisted()) {
        flag = true;
        break;
      }
    }
    if (!isFromSwitch) {
      this.simultaneousRingServiceInput.setIsSimultaneousRingActive(flag);
    }
  }

  simultaneousRingNumberDelete(arrayIndex: number, isAllValidNumbers: boolean) {

    if (!isAllValidNumbers) {
      if (this.simRingArray[arrayIndex].isPersisted()) {
        this.simRingArray[arrayIndex].setTempDeleted(true);
      } else {
        this.simRingArray.splice(arrayIndex, 1);
      }
    } else {
      this.simRingArray.splice(arrayIndex, 1);
      this.deleteTempDeletedSimRingArrayElements();
    }

    if (this.simRingArray.length === 1 || !this.simRingArray[0].getNumber()) {
      this.setDefaultNoReqError();
    }
  }

  private deleteTempDeletedSimRingArrayElements() {
    for (let i = 0; i < this.simRingArray.length; i++) {
      if (this.simRingArray[i].isTempDeleted()) {
        this.simRingArray.splice(i, 1);
        i--;
      }
    }
  }

  doNotRingWhenOnCallActive(event) {
    this.isDoNotRingWhenOnCallUpdateError = '';
    this.isDoNotRingWhenOnCallUpdateInprogress = true;
    this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(event.checked);
    this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
      this.postDoNotRingWhenOnCallPutCB.bind(this), this.SIM_RING_DEFAULT_UPDATE_FLAG);
  }

  doNotRingWhenOnCallKeyup(doNotRingWhenOnCallChecked) {

    this.isDoNotRingWhenOnCallUpdateError = '';
    this.isDoNotRingWhenOnCallUpdateInprogress = true;
    this.isDoNotRingWhenOnCallChecked = !doNotRingWhenOnCallChecked;
    this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(this.isDoNotRingWhenOnCallChecked);
    this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
      this.postDoNotRingWhenOnCallPutCB.bind(this), this.SIM_RING_DEFAULT_UPDATE_FLAG);
  }

  postDoNotRingWhenOnCallPutCB(res) {

    this.isDoNotRingWhenOnCallUpdateInprogress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isDoNotRingWhenOnCallChecked = !this.isDoNotRingWhenOnCallChecked;
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.isDoNotRingWhenOnCallUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          errorStatus = ' ' + res.status;
          this.isDoNotRingWhenOnCallUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.limit_exceeded, errorStatus);
        }
      }


    } else {
      this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(this.isDoNotRingWhenOnCallChecked);
    }

    console.log('Do Not Ring When On Call is set to : ', this.isDoNotRingWhenOnCallChecked);
  }

  postSimultaneousRingPut(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {

      this.isRingNumbersChecked = !this.isRingNumbersChecked;

      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.limit_exceeded, res.status);
        }
      }
    }

    this.restoreTempDeletedSimRingArrayNumbers();
    this.updateSimultaniousRingHeader(true);

    console.log('Simultaneous ring is set to : ', this.simultaneousRingService.fetchIsSimultaneousRingActive());
  }

  private restoreTempDeletedSimRingArrayNumbers() {
    this.simRingArray.forEach((item) => {
      if (item.isTempDeleted()) {
        item.setNumber(item.getPersistedNumber());
        item.setIsAnswerConfirmationRequired(item.getPersistedAnswerConfirmation());
        item.setTempDeleted(false);
      }
    });
  }
  postSimultaneousRingGet(simultaneousRingParsedJson) {
    if (simultaneousRingParsedJson) {
      this.isDoNotRingWhenOnCallChecked = this.simultaneousRingService.fetchIsDoNotRingWhenOnCallChecked();
      this.isSimultaneousRingActive = this.simultaneousRingService.fetchIsSimultaneousRingActive();
      this.isRingNumbersChecked = this.isSimultaneousRingActive;
      this.criteriaArray = this.simultaneousRingService.fetchCriteriaArray();
      this.simRingArray = this.simultaneousRingService.fetchSimRingArray();
      this.isSimultaneousRingActive = this.simultaneousRingService.fetchIsSimultaneousRingActive();
      this.isDoNotRingWhenOnCallChecked = this.simultaneousRingService.fetchIsDoNotRingWhenOnCallChecked();
      this.addDefaultPhoneNumberEntry();
    } else {
      console.log('Some error occured in getting Simultaneous Ring.');
    }
  }

  private removeInvalidSRPhNumbers() {
    let sArray: SimRingArray;
    for (let i = 0; i < this.simRingArray.length; i++) {
      sArray = this.simRingArray[i];
      if (!sArray.isPersisted()) {
        if (!sArray.getNumber() || (sArray.getNumber() && !(this.util.isE164valid(sArray.getNumber())
          || this.util.isValidSipUri(sArray.getNumber())))) {
          this.simRingArray.splice(i, 1);
          i--;
        } else if (!sArray.getPersistedNumber()) {
          this.simRingArray.splice(i, 1);
          i--;
        }
      } else {
        if (!(this.util.isE164valid(sArray.getNumber()) || this.util.isValidSipUri(sArray.getNumber()))) {
          sArray.setNumber(sArray.getPersistedNumber());
        }

        if (sArray.getNumber() !== sArray.getPersistedNumber()) {
          sArray.setNumber(sArray.getPersistedNumber());
        }

        sArray.setIsAnswerConfirmationRequired(sArray.getPersistedAnswerConfirmation());
      }
    }

    this.addDefaultPhoneNumberEntry();
  }

  private removeDuplicatePhNumbers() {
    for (let i = 0; i < this.simRingArray.length; i++) {
      for (let j = 0; j < this.simRingArray.length; j++) {
        if (i === j) {
          continue;
        }
        if (this.simRingArray[i].getNumber() === this.simRingArray[j].getNumber()) {
          this.simRingArray.splice(j, 1);
          i--;
          break;
        }
      }
    }
  }


  ringNumberSwitch() {

    if (this.isRingNumbersChecked) {
      this.isRingNumbersChecked = false;
    } else {
      this.isRingNumbersChecked = true;
    }
    this.removeInvalidSRPhNumbers();
    this.removeDuplicatePhNumbers();
    this.clearErrorMessages();
    if (this.simRingArray.length === 1 && !this.simRingArray[0].getNumber()) {
      this.setDefaultNoReqError();
    }

    if (this.simultaneousRingServiceInput.getSimRingArray().length >= 2) {
      this.simultaneousRingServiceInput.setIsSimultaneousRingActive(this.isRingNumbersChecked);
    } else {
      this.simultaneousRingServiceInput.setIsSimultaneousRingActive(false);
    }
    if (!this.simultaneousRingService.fetchIsSimultaneousRingActive() || this.simRingArray.length > 1) {
      this.isSimRingUpdateInProgress = true;
      this.simRingUpdateError = '';

      this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
        this.postSimultaneousRingPut.bind(this), this.SIM_RING_DEFAULT_UPDATE_FLAG);
    }
  }

  whenToRingChecked() {
    if (this.isWhenToRingExpanded) {
      this.isWhenToRingExpanded = false;
    } else {
      this.isWhenToRingExpanded = true;
    }
  }

  onCriteriaUpdate(criteria: CriteriaArray) {
    this.simultaneousRingServiceInput.setCriteriaArray(criteria);
    if (criteria.getIsActive()) {
      criteria.setIsActive(false);
    } else {
      criteria.setIsActive(true);
    }
    criteria.setUpdateInprogress(true);
    criteria.setErrorMsg('');
    this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
      this.criteriaUpdateCB.bind(this, criteria), this.CRITERIA_UPDATE_FLAG);

  }

  criteriaUpdateCB(criteria: CriteriaArray, res) {
    criteria.setUpdateInprogress(false);

    if (!res || !(res.status >= 200 && res.status < 400)) {
      criteria.setIsActive(!criteria.getIsActive());
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        errorStatus = ' ' + res.status;
        if (res.status === 0) {
          criteria.setErrorMsg(this.customizedTextJson.error.networkerror);
        } else {
          criteria.setErrorMsg(this.util.frameErrorMessage(this.customizedTextJson.error.limit_exceeded, errorStatus));
          this.isSimRingUpdateInProgress = false;
        }
      }
    }

  }

  updateAnswerConfirmationRequired(simRing) {
    let self = this;
    if (simRing.isAnswerConfirmationRequired) {
        simRing.isAnswerConfirmationRequired = false;
      } else {
        simRing.isAnswerConfirmationRequired = true;
      }
    setTimeout(function () {

      self.simultaneousRingServiceInput.setSimRingArray(simRing);
      self.simRingUpdateError = '';
      if (self.isAllPhoneNumbersValid() && self.hasNoDuplicatePhoneNumbers()) {
        self.simultaneousRingService.sendSimultaneousRingPut(self.serviceRouteProvider.fetchSimultaneousRingUrl(),
          self.answerConfirmationRequiredCB.bind(self), self.RING_NUMBERS_UPDATE_FLAG);
      }
    }, 100);
  }

  answerConfirmationRequiredCB(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.limit_exceeded, res.status);
        }
      }
    } else {
      this.markAllPhoneNumbersAsPersisted();
    }
  }
}

