/* Copyright © 2017 BroadSoft Inc. */

import {Injectable, Inject} from '@angular/core';

@Injectable()

export class SequentialRingServiceInput {
  isSequentialRingActive = false;
  isRingBaseLocationFirst = false;
  baseLocationNumberOfRings = '0';
  isContinueIfBaseLocationIsBusy = false;
  isCallerMayStopSearch = false;
  seqRingArray: SeqRingArray[];
  criteriaArray: CriteriaArray[];
  constructor() {}

  setIsSequentialRingActive(value: boolean) {
    this.isSequentialRingActive = value;
  }

  getIsSequentialRingActive() {
    return this.isSequentialRingActive;
  }

  setIsRingBaseLocationFirst(ringBaseLocationFirst) {
    this.isRingBaseLocationFirst = ringBaseLocationFirst;
  }

  getIsRingBaseLocationFirst() {
    return this.isRingBaseLocationFirst;
  }

  setBaseLocationNumberOfRings(baseLocationNumberOfRings) {
    this.baseLocationNumberOfRings = baseLocationNumberOfRings;
  }

  getBaseLocationNumberOfRings() {
    return this.baseLocationNumberOfRings;
  }

  setIsContinueIfBaseLocationIsBusy(continueIfBaseLocationIsBusy) {
    this.isContinueIfBaseLocationIsBusy = continueIfBaseLocationIsBusy;
  }

  getIsContinueIfBaseLocationIsBusy() {
    return this.isContinueIfBaseLocationIsBusy;
  }

  setIsCallerMayStopSearch(callerMayStopSearch) {
    this.isCallerMayStopSearch = callerMayStopSearch;
  }

  getIsCallerMayStopSearch() {
    return this.isCallerMayStopSearch;
  }

  // Initially getting the values from the Server and setiing in the POJO...
  setSeqRingArrayInit(parsedJson) {
    this.seqRingArray = new Array();
    let locationKey = ''
    for (let index = 0, locIndex = 1; locIndex <= 5; index++ , locIndex++) {
      locationKey = 'location' + (locIndex);
      if (parsedJson['SequentialRing'][locationKey]['address']) {
        this.seqRingArray[index] = new SeqRingArray(parsedJson['SequentialRing'][locationKey]['address']['$'],
          parsedJson['SequentialRing'][locationKey]['numberOfRings']['$'],
          parsedJson['SequentialRing'][locationKey]['answerConfirmationRequired']['$'] === 'true');
      } else {
        --index;
      }
    }
  }

  // Initially getting the values from the Server and setiing in the POJO...
  setCriteriaArrayInit(parsedJson) {
    this.criteriaArray = new Array();
    if (parsedJson.SequentialRing.criteriaActivationList && parsedJson.SequentialRing.criteriaActivationList.criteriaActivation &&
      (parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.length ||
        parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.criteriaName)) {
      if (parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.length) {
        let size = parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.length;
        for (let index = 0; index < size; ++index) {
          this.criteriaArray.push(new CriteriaArray
            (parsedJson.SequentialRing.criteriaActivationList.criteriaActivation[index].criteriaName.$,
            parsedJson.SequentialRing.criteriaActivationList.criteriaActivation[index].active.$ === 'true'));
        }
      } else {
        this.criteriaArray.push(new CriteriaArray
          (parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.criteriaName.$,
          parsedJson.SequentialRing.criteriaActivationList.criteriaActivation.active.$ === 'true'));
      }
    }
  }

  // Updating the POJO with the modified values...
  setSeqRingArray(seqRing, index) {
    this.seqRingArray[index].setIsAnswerConfirmationRequired(seqRing.isAnswerConfirmationRequired);
    this.seqRingArray[index].setNumberOfRing(seqRing.numberOfRings);
  }

  // Updating the POJO with the modified values...
  setCriteriaArray(criteria) {
    for (let index = 0; index < this.criteriaArray.length; ++index) {
      if (this.criteriaArray[index].getName() === criteria.name) {
        this.criteriaArray[index].setIsActive(criteria.isActive);
      }
    }
  }

  getSeqRingArray() {
    return this.seqRingArray ? this.seqRingArray : new Array();
  }

  getCriteriaArray() {
    return this.criteriaArray ? this.criteriaArray : new Array();
  }

}


export class SeqRingArray {
  private number;
  isAnswerConfirmationRequired;
  numberOfRings;
  error: string;
  validNumber: boolean;
  constructor(number: string, rings: string, isrequired: boolean) {
    this.number = number;
    this.numberOfRings = rings;
    this.isAnswerConfirmationRequired = isrequired;
  }
  getNumber() {
    return this.number;
  }
  setNumber(number: string) {
    this.number = number;
  }
  getIsAnswerConfirmationRequired() {
    return this.isAnswerConfirmationRequired;
  }
  setIsAnswerConfirmationRequired(isAnswerConfirmationRequired: boolean) {
    this.isAnswerConfirmationRequired = isAnswerConfirmationRequired;
  }
  setNumberOfRing(ringNumber: string) {
    this.numberOfRings = ringNumber;
  }
  getNumberOfRing() {
    return this.numberOfRings;
  }
  setError(errorMsg: string) {
    this.error = errorMsg;
  }
  getError() {
    return this.error;
  }
  setIsValidNumber(flag: boolean) {
    this.validNumber = flag;
  }
  isValidNumber() {
    return this.validNumber;
  }

}


export class CriteriaArray {
  private name;
  isActive;
  updateInprogress = false;
  errorMessage = '';
  constructor(name: string, isActive: boolean) {
    this.name = name;
    this.isActive = isActive;
  }
  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }
  getIsActive() {
    return this.isActive;
  }
  setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }
  getErrorMsg() {
    return this.errorMessage;
  }
  setErrorMsg(errorMessage) {
    this.errorMessage = errorMessage;
  }
  setUpdateInprogress(flag: boolean) {
    this.updateInprogress = flag;
  }
  isUpdateInprogress() {
    return this.updateInprogress;
  }
}
