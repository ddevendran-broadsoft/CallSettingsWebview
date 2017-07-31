/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';

import { SimultaneousRingService } from 'app/IncomingCalls/SimultaneousRing/simultaneousRing.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { SimultaneousRingServiceInput } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { SimRingArray } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { CriteriaArray } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { Util } from 'app/AppCommon/util';
@Component({
  selector: 'simultaneousRing',
  templateUrl: 'simultaneousRing.component.html',
  providers: [SimultaneousRingService]
})

export class SimultaneousRingComponent {

  private simRingArray: SimRingArray[] = new Array();
  private duplicateSimRingIndex: number = 100;  //Initially should not point any object
  private criteriaArray: CriteriaArray[] = new Array();

  private isWhenToRingExpanded: boolean = false;
  private isSimultaneousRingActive: boolean = false;
  private isRingNumbersChecked: boolean = false;
  private isDoNotRingWhenOnCallChecked: boolean = false;
  private phoneNumberMaxLength: number;

  private RING_NUMBERS_UPDATE_FLAG: number = 1; //Setting the value for the update choice
  private CRITERIA_UPDATE_FLAG: number = 2;    //Setting the value for the update choice
  private SIM_RING_DEFAULT_UPDATE_FLAG: number = 0; //Setting the value for default update choice
  private simRingUpdateError: String = "";
  private isSimRingUpdateInProgress: boolean = false;
  private isDoNotRingWhenOnCallUpdateError: string = "";

  private isCriteriaUpdateError: string = "";
  private isDoNotRingWhenOnCallUpdateInprogress: boolean = false;

  private customizedTextJson = window['customizedTexts'];

  constructor(private simultaneousRingService: SimultaneousRingService, private serviceRouteprovider: ServiceRouteProvider, private simultaneousRingServiceInput: SimultaneousRingServiceInput,
    private util: Util) {
    this.phoneNumberMaxLength = this.util.INPUTMAXLENGTH;
  }

  ngOnInit() {

    this.isDoNotRingWhenOnCallChecked = this.simultaneousRingService.fetchIsDoNotRingWhenOnCallChecked();
    this.isSimultaneousRingActive = this.simultaneousRingService.fetchIsSimultaneousRingActive();
    this.isRingNumbersChecked = this.isSimultaneousRingActive;
    this.criteriaArray = this.simultaneousRingService.fetchCriteriaArray();
    if (!this.criteriaArray) {
      this.criteriaArray = new Array();
    }


    this.simRingArray = this.simultaneousRingService.fetchSimRingArray();
    if (!this.simRingArray) {
      this.simRingArray = new Array();
    }
    this.addDefaultPhoneNumberEntry();
  }

  private addDefaultPhoneNumberEntry() {
    if (!this.simRingArray.length || (this.simRingArray[this.simRingArray.length - 1].getNumber() && this.simRingArray.length <= 9)) {
      let simrArray = new SimRingArray("", true);   //for new entry
      if (!this.simRingArray.length) {
        simrArray.setError(this.customizedTextJson.simultaneous_ring.phone_number_required);
      }
      this.simRingArray.push(simrArray);
    }
  }


  private onPhoneNumberKeydown(event) {
    if (event.keyCode == 8 || event.key == "Backspace" || event.keyCode == 46 || event.key == "Delete") {
      let inputId = event.srcElement.id;
      let index = parseInt(inputId.charAt(0));
      this.clearFieldErrorMessage(index);
    }
  }

  private onPhoneNumberChange(event: any) {
    let inputId = event.srcElement.id;
    let index = parseInt(inputId.charAt(0));
    this.clearFieldErrorMessage(index);
    this.simRingArray[index].setIsValidNumber(true);  //updates the input line color as green
  }

  clearFieldErrorMessage(index: number) {
    this.simRingArray[index].setError("");
  }

  clearErrorMessages() {
    this.simRingUpdateError = "";
    for (let i = 0; i < this.simRingArray.length; i++) {
      this.simRingArray[i].setError("");
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
      if (input) {
        self.simRingArray[index].setNumber(input);
        self.deleteTempDeletedSimRingArrayElements();
      } else if (index == self.simRingArray.length - 1) {   //Should make last phonenumber  empty
        self.simRingArray[self.simRingArray.length - 1].setNumber("");
        if (index) {
          self.simRingArray[self.simRingArray.length - 1].setError("");
        } else {
          self.setDefaultNoReqError();
        }
      }
      self.validateDuplicatePhoneNumbers();
      let isValidateData: boolean = self.validatePhoneNumbers(input, index);
      if (!input && index != self.simRingArray.length - 1) {
        self.simultaneousRingNumberDelete(index, isValidateData);
      }
      if (isValidateData) {
        if (!self.simRingArray[0].getNumber()) {
          self.simultaneousRingServiceInput.setIsSimultaneousRingActive(false);
          self.isRingNumbersChecked = false;
        }
        self.isSimRingUpdateInProgress = true;
        self.simultaneousRingService.sendSimultaneousRingPut(self.serviceRouteprovider.fetchSimultaneousRingUrl(), self.updateSimultaneousRingServiceCb.bind(self), self.RING_NUMBERS_UPDATE_FLAG);
      }
    }, 100);
  }

  private setDefaultNoReqError() {
    this.simRingArray[0].setError(this.customizedTextJson.simultaneous_ring.phone_number_required);
  }

  private validatePhoneNumbers(number: string, index: number) {
    return this.isAllPhoneNumbersValid() && !this.isNumberAlreadyExist(number, index) && this.hasNoDuplicatePhoneNumbers();
  }

  private isAllPhoneNumbersValid() {  //Validates all phone numbers
    let flag = true;
    if (this.simRingArray) {
      let sArray: SimRingArray;
      for (let i = 0; i < this.simRingArray.length; i++) {
        sArray = this.simRingArray[i];
        if (sArray.getNumber()) {
          if (!sArray.isPersisted() || (sArray.isPersisted() && sArray.getPersistedNumber() != sArray.getNumber())) {
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

  private isNumberAlreadyExist(number: string, index: number) {
    let noAlreadyExists = false;
    if (this.simRingArray.length > 1) {
      for (let count = 0; count < this.simRingArray.length; count++) {
        if (index != count) {
          if (!this.simRingArray[count].isTempDeleted() && number && number == this.simRingArray[count].getNumber()) {
            this.setAsDuplicatePhNumEntry(index);
            this.setAsDuplicatePhNumEntry(count);
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
        if (this.simRingArray[i].getNumber() && this.isNumberAlreadyExist(this.simRingArray[i].getNumber(), i)) {
          return false;
        }
      }
    }
    return true;
  }

  private validateDuplicatePhoneNumbers() {
    if (this.simRingArray.length > 1) {
      for (let i = 0; i < this.simRingArray.length; i++) {
        if (this.simRingArray[i].getNumber() && !this.isNumberAlreadyExist(this.simRingArray[i].getNumber(), i)) {
          this.simRingArray[i].setError("");
        }
      }
    }
  }

  private setAsDuplicatePhNumEntry(index: number) {

    this.simRingArray[index].setError(this.customizedTextJson.error.numberexist);
  }

  updateSimultaneousRingServiceCb(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      let errorStatus = "";
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        }
        else if (res.status >= 400) {
          errorStatus = " " + res.status;
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }
      this.isSimRingUpdateInProgress = false;
    }
    else {      //populate pojo with server details
      this.markAllPhoneNumbersAsPersisted();
      this.clearErrorMessages();
      if (this.simRingArray[this.simRingArray.length - 1].getNumber()) {   //for new entry
        if (this.simRingArray.length <= 9) {
          let simRingArray = new SimRingArray("", true);
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

    if (this.simRingArray.length == 1 || !this.simRingArray[0].getNumber()) {
      this.setDefaultNoReqError();
    }
  }

  private deleteTempDeletedSimRingArrayElements() {
    for (let index = 0; index < this.simRingArray.length; index++) {
      if (this.simRingArray[index].isTempDeleted()) {
        this.simRingArray.splice(index, 1);
        index--;
      }
    }
  }

  doNotRingWhenOnCallActive(event) {
    this.isDoNotRingWhenOnCallUpdateError = "";
    this.isDoNotRingWhenOnCallUpdateInprogress = true;
    this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(event.checked);
    this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteprovider.fetchSimultaneousRingUrl(), this.postDoNotRingWhenOnCallPutCB.bind(this), this.SIM_RING_DEFAULT_UPDATE_FLAG);
  }

  postDoNotRingWhenOnCallPutCB(res) {

    this.isDoNotRingWhenOnCallUpdateInprogress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isDoNotRingWhenOnCallChecked = !this.isDoNotRingWhenOnCallChecked;
      let errorStatus = "";
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.isDoNotRingWhenOnCallUpdateError = this.customizedTextJson.error.networkerror;
        }
        else {
          errorStatus = " " + res.status;
          this.isDoNotRingWhenOnCallUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }


    } else {
      this.simultaneousRingServiceInput.setIsDoNotRingWhenOnCallChecked(this.isDoNotRingWhenOnCallChecked);
    }
  }

  postSimultaneousRingPut(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {

      this.isRingNumbersChecked = !this.isRingNumbersChecked;

      if (res && res.status) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }

    this.restoreTempDeletedSimRingArrayNumbers();
    this.updateSimultaniousRingHeader(true);
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
      this.isSimultaneousRingActive = this.simultaneousRingService.fetchIsSimultaneousRingActive();
      this.isDoNotRingWhenOnCallChecked = this.simultaneousRingService.fetchIsDoNotRingWhenOnCallChecked();

    } else {
    }
  }

// Removing the invalid numbers by validating...
  private removeInvalidSimRingNumbers() {
    let sArray: SimRingArray;
    for (let index = 0; index < this.simRingArray.length; index++) {
      sArray = this.simRingArray[index];
      if (!sArray.isPersisted()) {
        if (!sArray.getNumber() || (sArray.getNumber() && !(this.util.isE164valid(sArray.getNumber()) || this.util.isValidSipUri(sArray.getNumber())))) { // Validitiy checked...
          this.simRingArray.splice(index, 1);
          index--;
        } else if (!sArray.getPersistedNumber()) {  // If not a persisting number, it is removed.
          this.simRingArray.splice(index, 1);
          index--;
        }
      } else {
        if (!(this.util.isE164valid(sArray.getNumber()) || this.util.isValidSipUri(sArray.getNumber()))) {  // Resetting the previously existing valid number which was changed to invalid...
          sArray.setNumber(sArray.getPersistedNumber());
        }

        if (sArray.getNumber() != sArray.getPersistedNumber()) {  
          sArray.setNumber(sArray.getPersistedNumber());
        }

        sArray.setIsAnswerConfirmationRequired(sArray.getPersistedAnswerConfirmation());
      }
    }

    this.addDefaultPhoneNumberEntry();
  }

  private removeDuplicatePhNumbers() {
    for (let index1 = 0; index1 < this.simRingArray.length; index1++) {
      for (let index2 = 0; index2 < this.simRingArray.length; index2++) {
        if (index1 == index2) continue;
        if (this.simRingArray[index1].getNumber() == this.simRingArray[index2].getNumber()) {
          this.simRingArray.splice(index2, 1);
          index1--;
          break;
        }
      }
    }
  }


  ringNumberSwitch() {
    this.removeInvalidSimRingNumbers();
    this.removeDuplicatePhNumbers();
    this.clearErrorMessages();
    if (this.simRingArray.length == 1 && !this.simRingArray[0].getNumber()) {
      this.setDefaultNoReqError();
    }

    if (this.simultaneousRingServiceInput.getSimRingArray().length >= 2) {
      this.simultaneousRingServiceInput.setIsSimultaneousRingActive(this.isRingNumbersChecked);
    }
    else {
      this.simultaneousRingServiceInput.setIsSimultaneousRingActive(false);
    }
    if (!this.simultaneousRingService.fetchIsSimultaneousRingActive() || this.simRingArray.length > 1) {
      this.isSimRingUpdateInProgress = true;
      this.simRingUpdateError = "";
      this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteprovider.fetchSimultaneousRingUrl(), this.postSimultaneousRingPut.bind(this), this.SIM_RING_DEFAULT_UPDATE_FLAG);
    }
  }

  whenToRingChecked() {
    if (this.isWhenToRingExpanded)
      this.isWhenToRingExpanded = false;
    else
      this.isWhenToRingExpanded = true;
  }

  onCriteriaUpdate(criteria: CriteriaArray) {
    this.simultaneousRingServiceInput.setCriteriaArray(criteria);
    criteria.setUpdateInprogress(true);
    criteria.setErrorMsg("");
    this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteprovider.fetchSimultaneousRingUrl(), this.criteriaUpdateCB.bind(this, criteria), this.CRITERIA_UPDATE_FLAG);

  }

  criteriaUpdateCB(criteria: CriteriaArray, res) {
    criteria.setUpdateInprogress(false);

    if (!res || !(res.status >= 200 && res.status < 400)) {
      criteria.setIsActive(!criteria.getIsActive());
      let errorStatus = "";
      if (res && (res.status === 0 || res.status)) {
        errorStatus = " " + res.status;
        if (res.status === 0) {
          criteria.setErrorMsg(this.customizedTextJson.error.networkerror);
        }
        else {
          criteria.setErrorMsg(this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus));
          this.isSimRingUpdateInProgress = false;
        }
      }
    }

  }

  updateAnswerConfirmationRequired(simRing) {
    this.simultaneousRingServiceInput.setSimRingArray(simRing);
    this.simRingUpdateError = "";
    if (this.isAllPhoneNumbersValid() && this.hasNoDuplicatePhoneNumbers()) {
      this.simultaneousRingService.sendSimultaneousRingPut(this.serviceRouteprovider.fetchSimultaneousRingUrl(), this.answerConfirmationRequiredCB.bind(this), this.RING_NUMBERS_UPDATE_FLAG);
    }
  }

  answerConfirmationRequiredCB(res) {
    this.isSimRingUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      if (res && res.status) {
        if (res.status === 0) {
          this.simRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          this.simRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    } else {
      this.markAllPhoneNumbersAsPersisted();
    }
  }
}
