/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject } from '@angular/core';

@Injectable()

export class SimultaneousRingServiceInput {
    isDoNotRingWhenOnCallChecked: boolean = false;
    isSimultaneousRingActive: boolean = false;
    simRingArray: SimRingArray[];
    criteriaArray: CriteriaArray[];
    constructor() { }

    setIsDoNotRingWhenOnCallChecked(isDoNotRingWhenOnCallChecked) {
        this.isDoNotRingWhenOnCallChecked = isDoNotRingWhenOnCallChecked;
    }

    setIsSimultaneousRingActive(isSimultaneousRingActive) {
        this.isSimultaneousRingActive = isSimultaneousRingActive;
    }

//  Setting the Ring numbers array initially, during the GET...
    setSimRingArrayInit(parsedJson) {
        this.simRingArray = new Array();

        if (parsedJson.SimultaneousRingPersonal.simRingLocations) {

            if (parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation.length) { //  If there are more than one number, then the response comes as an array of objects....
                let size = parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation.length;
                let s;
                for (let index = 0; index < size; ++index) {
                    s = new SimRingArray(parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation[index].address.$,
                        parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation[index].answerConfirmationRequired.$ == "true")
                    s.setPersisted(true);
                    this.simRingArray.push(s);
                }
            } else {  //   If there is only one number then a single object is recieved....
                let s = new SimRingArray(parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation.address.$,
                    parsedJson.SimultaneousRingPersonal.simRingLocations.simRingLocation.answerConfirmationRequired.$ == "true");
                s.setPersisted(true);
                this.simRingArray.push(s);
            }
        }
    }

    setCriteriaArrayInit(parsedJson) {
        this.criteriaArray = new Array();
        if (parsedJson.SimultaneousRingPersonal.criteriaActivationList && parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation &&
            (parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.length || parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.criteriaName)) {
            if (parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.length) {  //  If there are more than one criterion, then the response comes as an array of objects....
                let size = parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.length;
                for (let index = 0; index < size; ++index) {
                    this.criteriaArray.push(new CriteriaArray(parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation[index].criteriaName.$,
                        parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation[index].active.$ == "true", parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation[index].uri.$));
                }
            } else {   //   If there is only one criterion then a single object is recieved....
                this.criteriaArray.push(new CriteriaArray(parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.criteriaName.$,
                    parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.active.$ == "true", parsedJson.SimultaneousRingPersonal.criteriaActivationList.criteriaActivation.uri.$));
            }
        }

    }

    setSimRingArray(simRing) {  // Settting the other modified fields of the existing numbers....
        for (let index = 0; index < this.simRingArray.length; ++index) {
            if (this.simRingArray[index].getNumber() == simRing.number) this.simRingArray[index].setIsAnswerConfirmationRequired(simRing.isAnswerConfirmationRequired);
        }
    }

    setCriteriaArray(criteria) {
        for (let index = 0; index < this.criteriaArray.length; ++index) {  // Settting the other modified fields of the existing criteria....
            if (this.criteriaArray[index].getName() == criteria.name) this.criteriaArray[index].setIsActive(criteria.isActive);
        }
    }

    getIsSimultaneousRingActive() {
        return this.isSimultaneousRingActive;
    }

    getIsDoNotRingWhenOnCallChecked() {
        return this.isDoNotRingWhenOnCallChecked;
    }

    getSimRingArray() {
        return this.simRingArray ? this.simRingArray : new Array();
    }

    getCriteriaArray() {
        return this.criteriaArray ? this.criteriaArray : new Array();
    }

}

//  This is the class representing the Ring numbers, the objects of this class are used to store the numbers and the properties....
export class SimRingArray {

    private number;
    private persistedNumber;  // To keep the persisting number backed up....
    private isAnswerConfirmationRequired;
    private persistedAnswerConfirmation; // To keep the persisting number associated value backed up....
    private error: string;
    private validNumber: boolean = false;
    private persisted: boolean = false;    // Will be true if it is already persisted in the server.
    private tempDeleted: boolean = false;  // true if persisted but contains some invalid numbers.
    constructor(number: string, isrequired: boolean) {
        this.number = number;
        this.persistedNumber = number;
        this.isAnswerConfirmationRequired = isrequired;
        this.persistedAnswerConfirmation = isrequired;

    }
    getNumber() {
        return this.number;
    }
    setNumber(number: string) {
        this.number = number;;
    }
    public getPersistedNumber() {
        return this.persistedNumber;
    }
    public setPersistedNumber(numberPersisted: string) {
        this.persistedNumber = numberPersisted;
    }
    getIsAnswerConfirmationRequired() {
        return this.isAnswerConfirmationRequired;
    }
    setIsAnswerConfirmationRequired(isAnswerConfirmationRequired: boolean) {
        this.isAnswerConfirmationRequired = isAnswerConfirmationRequired;
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
    setPersisted(flag: boolean) {
        this.persisted = flag;
    }
    isPersisted() {
        return this.persisted;
    }
    setTempDeleted(flag: boolean) {
        this.tempDeleted = flag;
    }
    isTempDeleted() {
        return this.tempDeleted;
    }

    public setPersistedAnswerConfirmation(answerConfirmationReqd: boolean) {
        this.persistedAnswerConfirmation = answerConfirmationReqd;
    }
    public getPersistedAnswerConfirmation() {
        return this.persistedAnswerConfirmation;
    }
}

//  This is the class representing the criteria, the objects of this class are used to store the criteria and the properties....
export class CriteriaArray {
    private name;
    private isActive;
    private uri;
    private updateInprogress: boolean = false;
    private errorMessage: string = "";
    constructor(name: string, isActive: boolean, uri: string) {
        this.name = name;
        this.isActive = isActive;
        this.uri = uri;
    }
    getName() {
        return this.name;
    }
    setName(name: string) {
        this.name = name;;
    }
    getIsActive() {
        return this.isActive;
    }
    setIsActive(isActive: boolean) {
        this.isActive = isActive;
    }
    getUri() {
        return this.uri;
    }
    getErrorMsg() {
        return this.errorMessage;
    }
    setErrorMsg(errorMessage) {
        this.errorMessage = errorMessage;
    }
    setUri(uri: string) {
        this.uri = uri;
    }
    setUpdateInprogress(flag: boolean) {
        this.updateInprogress = flag;
    }
    isUpdateInprogress() {
        this.updateInprogress;
    }
}
