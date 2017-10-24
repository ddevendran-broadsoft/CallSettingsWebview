/* Copyright © 2017 BroadSoft Inc. */

import {Component, OnInit} from '@angular/core';

import {IncomingComponent} from 'app/IncomingCalls/incoming.component';
import {SequentialRingService} from 'app/IncomingCalls/SequentialRing/sequentialRing.service';
import {ServiceRouteProvider} from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import {SequentialRingServiceInput} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';
import {SeqRingArray} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';
import {CriteriaArray} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';
import {Util} from 'app/AppCommon/util';
@Component({
  selector: 'sequentialRing',
  templateUrl: 'sequentialRing.component.html',
  providers: [SequentialRingService]
})

export class SequentialRingComponent implements OnInit {

  private isSequentialRingActive = false;
  private ringBaseLocationRings = [];
  private ringNumbersRings = [];
  private isPreviousEnterUpdate = false;
  private RING_BASE_LOCATION_UPDATE_FLAG = 1; // Setting the flag value for the update choice to construct the xml body...
  private CALLER_MAY_CANCEL_UPDATE_FLAG = 2;  // Setting the flag value for the update choice to construct the xml body...
  private RING_NUMBERS_UPDATE_FLAG = 3;       // Setting the flag value for the update choice to construct the xml body...
  private CRITERIA_UPDATE_FLAG = 4;           // Setting the flag value for the update choice to construct the xml body...
  private sequentialRingVisible: boolean;
  customizedTextJson = window['customizedTexts'];
  seqRingRetrievingError;
  isRingBaseLocationChecked = false;
  phoneNumberMaxLength: number;
  baseLocationRingSelected: string;
  isContinueIfBusyChecked = false;
  isCallerMayCancelChecked = false;
  isRingNumberExpanded = false;
  ringBaseUpdateInProgress = false;
  callerCancelUpdateInProgress = false;
  ringNumbersUpdateProgress = false;
  seqRingUpdateError = '';
  criteriaRequiredError = '';
  isWhenToRingExpanded = false;
  seqRingArray: SeqRingArray[] = new Array();
  criteriaArray: CriteriaArray[] = new Array();
  ringBaseUpdateError = '';
  callerCancelUpdateError = '';



  constructor(private sequentialRingService: SequentialRingService, private serviceRouteProvider: ServiceRouteProvider,
    private sequentialRingServiceInput: SequentialRingServiceInput,
    private util: Util, private xsiServices: XSIServices) {
    this.phoneNumberMaxLength = this.util.INPUTMAXLENGTH;
    this.ringBaseLocationRings =
      ['0', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.ringNumbersRings =
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  }

  ngOnInit() {

    if(IncomingComponent.seqRingExpandGet === true) {
      this.isRingBaseLocationChecked = this.sequentialRingService.fetchIsRingBaseLocationFirst();
      this.baseLocationRingSelected = this.sequentialRingService.fetchBaseLocationNumberOfRings();
      this.isContinueIfBusyChecked = this.sequentialRingService.fetchIsContinueIfBaseLocationIsBusy();
      this.isCallerMayCancelChecked = this.sequentialRingService.fetchIsCallerMayCancelSearch();
      this.criteriaArray = this.sequentialRingService.fetchCriteriaArray();
      this.seqRingArray = this.sequentialRingService.fetchSeqRingArray();
      this.addDefaultPhoneNumberEntry();
      IncomingComponent.seqRingExpandGet = false;
    } else {
      if (this.serviceRouteProvider.fetchSequentialRingUrl()) {
        this.sequentialRingVisible = this.xsiServices.fetchSequentialRingVisible();
      }
      if (this.sequentialRingVisible) {
        this.seqRingRetrievingError = '';
        this.seqRingUpdateError = '';
        this.sequentialRingService.getSequentialRingService(this.serviceRouteProvider.fetchSequentialRingUrl(),
                                        this.postSequentialRingGet.bind(this));
      }
    }
    if (!this.criteriaArray) {
      this.criteriaArray = new Array();
    }

    if (!this.seqRingArray) {
      this.seqRingArray = new Array();
    }

    // Checking whether any criteria is activated and setting the error message accordingly...
    if (!this.sequentialRingService.fetchIsSequentialRingActive() && this.criteriaArray.length) {
      this.setCriteriaActivationReqError();
    }
  }

  // For adding default entry and input fields...
  private addDefaultPhoneNumberEntry() {
    if (!this.seqRingArray.length || (this.seqRingArray[this.seqRingArray.length - 1].getNumber() && this.seqRingArray.length <= 4)) {
      let seqRingArray = new SeqRingArray('', '3', true);   // for new entry
      this.seqRingArray.push(seqRingArray);
    }
  }

  // Checking whether GET is successful and setting Sequential Ring as ON/OFF...
  postSequentialRingGet(simultaneousRingParsedJson) {
    if (simultaneousRingParsedJson) {
      this.isSequentialRingActive = this.sequentialRingService.fetchIsSequentialRingActive();
      this.isRingBaseLocationChecked = this.sequentialRingService.fetchIsRingBaseLocationFirst();
      this.baseLocationRingSelected = this.sequentialRingService.fetchBaseLocationNumberOfRings();
      this.isContinueIfBusyChecked = this.sequentialRingService.fetchIsContinueIfBaseLocationIsBusy();
      this.isCallerMayCancelChecked = this.sequentialRingService.fetchIsCallerMayCancelSearch();
      this.seqRingArray = this.sequentialRingService.fetchSeqRingArray();
      this.criteriaArray = this.sequentialRingService.fetchCriteriaArray();
      this.addDefaultPhoneNumberEntry();
    // Checking if any criterion is present and setting the error message accordingly...
    if (!this.criteriaArray.length) {
      this.criteriaRequiredError = this.customizedTextJson.sequential_ring.criteria_required;
    }
    } else {
      console.log('Some error occured in getting Sequential Ring.');
    }
  }


  ringBaseLocationUpdate(event) {
    this.ringBaseUpdateError = '';
    this.ringBaseUpdateInProgress = true;
    if(event.key) {
      if(event.key == 'Enter') {
        this.isRingBaseLocationChecked = !this.isRingBaseLocationChecked;
      }
    } else {
      this.isRingBaseLocationChecked = event.checked;
    }

    this.sequentialRingServiceInput.setIsRingBaseLocationFirst(this.isRingBaseLocationChecked);
    
    this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
      this.postRingBaseLocationPut.bind(this), this.RING_BASE_LOCATION_UPDATE_FLAG);
  }

  postRingBaseLocationPut(res) {
    this.ringBaseUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isRingBaseLocationChecked = !this.isRingBaseLocationChecked;
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.ringBaseUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          errorStatus = ' ' + res.status;
          this.ringBaseUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }


    } else {
      this.sequentialRingServiceInput.setIsRingBaseLocationFirst(this.isRingBaseLocationChecked);
    }
  }

  updateBaseNumberOfRings(event) {
    this.ringBaseUpdateError = '';
    this.ringBaseUpdateInProgress = true;
    this.sequentialRingServiceInput.setBaseLocationNumberOfRings(event.target.value);
    this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
      this.postUpdateBaseNumberOfRingsPut.bind(this), this.RING_BASE_LOCATION_UPDATE_FLAG);
  }

  postUpdateBaseNumberOfRingsPut(res) {
    this.ringBaseUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.sequentialRingServiceInput.setBaseLocationNumberOfRings(this.baseLocationRingSelected);
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.ringBaseUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          errorStatus = ' ' + res.status;
          this.ringBaseUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }


    } else {
      this.sequentialRingServiceInput.setBaseLocationNumberOfRings(this.sequentialRingServiceInput.getBaseLocationNumberOfRings());
    }
  }

  updateContinueIfBusy(event) {
    this.ringBaseUpdateError = '';
    this.ringBaseUpdateInProgress = true;
    if(event.key) {
      if(event.key == 'Enter') {
        this.isContinueIfBusyChecked = !this.isContinueIfBusyChecked;
      }
    } else {
      this.isContinueIfBusyChecked = event.checked;
    }
    this.sequentialRingServiceInput.setIsContinueIfBaseLocationIsBusy(this.isContinueIfBusyChecked);
    this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
      this.postUpdateContinueIfBusyPut.bind(this), this.RING_BASE_LOCATION_UPDATE_FLAG);
  }

  postUpdateContinueIfBusyPut(res) {
    this.ringBaseUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.sequentialRingServiceInput.setIsContinueIfBaseLocationIsBusy(!this.isContinueIfBusyChecked);
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.ringBaseUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          errorStatus = ' ' + res.status;
          this.ringBaseUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }


    } else {
      this.sequentialRingServiceInput.setIsContinueIfBaseLocationIsBusy(this.sequentialRingServiceInput
        .getIsContinueIfBaseLocationIsBusy());
    }
  }

  updateCallerMayCancel(event) {
    this.callerCancelUpdateError = '';
    this.callerCancelUpdateInProgress = true;
    if(event.key) {
      if(event.key == 'Enter') {
        this.isCallerMayCancelChecked = !this.isCallerMayCancelChecked;
      }
    } else {
      this.isCallerMayCancelChecked = event.checked;
    }
    this.sequentialRingServiceInput.setIsCallerMayStopSearch(this.isCallerMayCancelChecked);
    
    this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
      this.postUpdateCallerMayCancelPut.bind(this), this.CALLER_MAY_CANCEL_UPDATE_FLAG);
  }

  postUpdateCallerMayCancelPut(res) {
    this.callerCancelUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isCallerMayCancelChecked = !this.isCallerMayCancelChecked;
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.callerCancelUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          errorStatus = ' ' + res.status;
          this.callerCancelUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }


    } else {
      this.sequentialRingServiceInput.setIsCallerMayStopSearch(this.sequentialRingServiceInput.getIsCallerMayStopSearch());
    }
  }

  // Handles the number entered in the Ring Numbers field....
  sequentialRingNumberEntered(event) {
    let inputId = event.srcElement.id;
    let input = event.srcElement.value;
    let index = parseInt(inputId.charAt(0));
    this.seqRingArray[index].setIsValidNumber(false);
    let isValidData = false;
    if (!this.isPreviousEnterUpdate) {
      if (input) {
        this.seqRingArray[index].setNumber(input);
        isValidData = this.validatePhoneNumber(input, index);
      }
      if (!input && index !== this.seqRingArray.length - 1) {
        this.sequentialRingNumberDelete(index);
      } else if (!input && index === this.seqRingArray.length - 1) {   // To make last number field empty...
        this.sequentialRingService.setIsModified(true);
        this.sequentialRingService.setDeletePosition(this.seqRingArray.length);
        this.seqRingArray[index].setNumber('');
        this.seqRingArray[index].setError('');
      }
      let self = this;
      setTimeout(function() {
        if ((!input || isValidData) && self.isAllValidNumbers()) {
          self.ringNumbersUpdateProgress = true;

          self.sequentialRingService.sendSequentialRingPut(self.serviceRouteProvider.fetchSequentialRingUrl(),
            self.postUpdateRingNumberPut.bind(self), self.RING_NUMBERS_UPDATE_FLAG);
        }
      }, 50);
    }
  }

  postUpdateRingNumberPut(res) {
    this.ringNumbersUpdateProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        if (res.status === 0) {
          this.seqRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          errorStatus = ' ' + res.status;
          this.seqRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus);
        }
      }
    } else {
      this.clearErrorMessages();
      this.sequentialRingService.setIsModified(false);        // Resetting the flag to false...
      this.isPreviousEnterUpdate = true;
      if (this.seqRingArray[this.seqRingArray.length - 1].getNumber()) {   // For new entry, adding an input field...
        if (this.seqRingArray.length < 5) {
          let seqRingArray = new SeqRingArray('', '3', true);
          this.seqRingArray.push(seqRingArray);
        }
      }
    }
  }

  sequentialRingNumberDelete(index: number) {
    this.sequentialRingService.setIsModified(true);
    if (this.seqRingArray[4] && this.seqRingArray[4].getNumber() && this.seqRingArray[4].getNumber().trim()) {
      this.sequentialRingService.setDeletePosition(this.seqRingArray.length);
    } else {
      this.sequentialRingService.setDeletePosition(this.seqRingArray.length - 1);
    }

    this.seqRingArray.splice(index, 1);
  }

  validatePhoneNumber(number, index) {
    let flag = true;
    if (!(this.util.isE164valid(number) || this.util.isValidSipUri(number))) {
      this.seqRingArray[index].setError(this.customizedTextJson.sequential_ring.invalid_phone_number_msg);
      flag = false;
    }
    return flag;
  }

  isAllValidNumbers() {
    for (let index = 0; index < this.seqRingArray.length; index++) {
      if (this.seqRingArray[index].getError()) {
        return false;
      }
    }
    return true;
  }

  clearErrorMessages() {
    this.seqRingUpdateError = '';
    for (let i = 0; i < this.seqRingArray.length; i++) {
      this.seqRingArray[i].setError('');
    }
  }

  clearFieldErrorMessage(index: number) {
    this.seqRingArray[index].setError('');
  }

  onNumberChangeUp(event) {
    let inputId = event.srcElement.id;
    let index = parseInt(inputId.charAt(0));
    this.clearFieldErrorMessage(index);
    this.seqRingArray[index].setIsValidNumber(true);  // updates the input line color as green
    if (event.key !== 'Enter') {
      this.isPreviousEnterUpdate = false;
    }
  }

  onfocus(seqRing: SeqRingArray) {
    if (seqRing.getError()) {
      seqRing.setIsValidNumber(false);
    } else {
      seqRing.setIsValidNumber(true);
    }
  }

  updateNumberOfRings(seqRing, index) {
    if (this.isAllValidNumbers()) {
      this.sequentialRingServiceInput.setSeqRingArray(seqRing, index);
      this.seqRingUpdateError = '';
      this.ringNumbersUpdateProgress = true;
      this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
        this.postUpdateRingNumberComponentPut.bind(this), this.RING_NUMBERS_UPDATE_FLAG);
    }
  }

  postUpdateRingNumberComponentPut(res) {
    this.ringNumbersUpdateProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      if (res) {
        if (res.status === 0) {
          this.seqRingUpdateError = this.customizedTextJson.error.networkerror;
        } else if (res.status >= 400) {
          this.seqRingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  updateAnswerConfirmation(seqRing, index) {
    if (this.isAllValidNumbers()) {
      if(seqRing.isAnswerConfirmationRequired) {
        seqRing.isAnswerConfirmationRequired = false;
      } else {
        seqRing.isAnswerConfirmationRequired = true;
      }
      this.sequentialRingServiceInput.setSeqRingArray(seqRing, index);
      this.seqRingUpdateError = '';
      this.ringNumbersUpdateProgress = true;
      this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
        this.postUpdateRingNumberComponentPut.bind(this), this.RING_NUMBERS_UPDATE_FLAG);
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
    this.sequentialRingServiceInput.setCriteriaArray(criteria);
    if(criteria.getIsActive()) {
      criteria.setIsActive(false);
    } else {
      criteria.setIsActive(true);
    }
    criteria.setUpdateInprogress(true);
    criteria.setErrorMsg('');
    this.sequentialRingService.sendSequentialRingPut(this.serviceRouteProvider.fetchSequentialRingUrl(),
      this.postCriteriaUpdatePut.bind(this, criteria), this.CRITERIA_UPDATE_FLAG);
  }

  postCriteriaUpdatePut(criteria: CriteriaArray, res) {
    criteria.setUpdateInprogress(false);

    if (!res || !(res.status >= 200 && res.status < 400)) {
      criteria.setIsActive(!criteria.getIsActive());
      let errorStatus = '';
      if (res && (res.status === 0 || res.status)) {
        errorStatus = ' ' + res.status;
        if (res.status === 0) {
          criteria.setErrorMsg(this.customizedTextJson.error.networkerror);
        } else {
          criteria.setErrorMsg(this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus));
        }
      }
    } else {
      this.criteriaArray = this.sequentialRingServiceInput.getCriteriaArray();
      let flag = false;
      for (let index = 0; index < this.criteriaArray.length; index++) {
        if (this.criteriaArray[index].getIsActive()) {
          this.clearCriteriaReqMessage();
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.setCriteriaActivationReqError();
      }
    }

  }

  private setCriteriaActivationReqError() {
    this.criteriaRequiredError = this.customizedTextJson.sequential_ring.criteria_activation_required;
  }

  private clearCriteriaReqMessage() {
    this.criteriaRequiredError = '';
  }


  ringNumbersExpand() {
    if (this.isRingNumberExpanded) {
      this.isRingNumberExpanded = false;
    } else {
      this.isRingNumberExpanded = true;
    }
  }

}
