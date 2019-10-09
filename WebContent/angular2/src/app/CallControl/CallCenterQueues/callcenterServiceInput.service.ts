/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class CallCenterServiceInput {
    isAcdUpdateInProgress: any;
    isCCIdAvailable: boolean = true;
    customizedTextJson = window['customizedTexts'];

    private acdState: string;
    private isUCEnabled: boolean;
    private selectedUnavailableCode;
    unavailableCodeArray: UnavailableCodeArray[];
    callcenterArray: CallCenterArray[];

    setAcdState(acdState) {
        this.acdState = acdState;
    }


    getAcdState() {

        return this.acdState;
    }


    setCallcenter(ccParsedjson) {

        console.log('>>>>>>>>>CallCenter details ', ccParsedjson.CallCenter)

        this.callcenterArray = new Array();
        if (ccParsedjson.CallCenter.callCenterList && ccParsedjson.CallCenter.callCenterList.callCenterDetails) {

            this.setCCIdAvailable(true);

            if (ccParsedjson.CallCenter.callCenterList.callCenterDetails.constructor === Array) {
                let size = ccParsedjson.CallCenter.callCenterList.callCenterDetails.length;

                console.log('>>>>>>>>>CallCenter size ', size)

                for (let index = 0; index < size; ++index) {
                    if (ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].serviceUserId && ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].available) {
                        if (ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].phoneNumber && ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].extension) {
                            this.callcenterArray.push(new CallCenterArray(ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].serviceUserId.$,
                                (ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].available.$ === 'true'),
                                ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].phoneNumber.$,
                                ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].extension.$));
                        } else {
                            this.callcenterArray.push(new CallCenterArray(ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].serviceUserId.$,
                                ccParsedjson.CallCenter.callCenterList.callCenterDetails[index].available.$ === 'true', '', ''));

                        }
                    }
                }
                console.log('Callcenter Array >>>>>>', this.callcenterArray)
            } else {

                console.log('>>>>>>>>>>>>OBJECT')

                if (ccParsedjson.CallCenter.callCenterList.callCenterDetails.serviceUserId && ccParsedjson.CallCenter.callCenterList.callCenterDetails.available) {
                    if (ccParsedjson.CallCenter.callCenterList.callCenterDetails.phoneNumber && ccParsedjson.CallCenter.callCenterList.callCenterDetails.extension) {
                        this.callcenterArray.push(new CallCenterArray(ccParsedjson.CallCenter.callCenterList.callCenterDetails.serviceUserId.$,
                            ccParsedjson.CallCenter.callCenterList.callCenterDetails.available.$ === 'true',
                            ccParsedjson.CallCenter.callCenterList.callCenterDetails.phoneNumber.$,
                            ccParsedjson.CallCenter.callCenterList.callCenterDetails.extension.$));
                    } else {
                        this.callcenterArray.push(new CallCenterArray(ccParsedjson.CallCenter.callCenterList.callCenterDetails.serviceUserId.$,
                            ccParsedjson.CallCenter.callCenterList.callCenterDetails.available.$ === 'true', '', ''));

                    }


                }
            }
        } else {

            console.log('No CC available>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            this.setCCIdAvailable(false);

        }
    }


    getCallCenterArray() {

        return this.callcenterArray;
    }

    setCCIdAvailable(isCCIdAvailable) {

        this.isCCIdAvailable = isCCIdAvailable;
    }

    getCCIdAvailable() {
        return this.isCCIdAvailable;
    }


    setSelectedUnavailableCode(selectedUnavailableCode) {

        this.selectedUnavailableCode = selectedUnavailableCode;

    }


    getSelectedUnavailableCode() {

        return this.selectedUnavailableCode;
    }


    setUnavailableCodeArray(ucParsedJson) {
        console.log('>>>>>>>>>Unavaiable code details ', ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail)
        this.unavailableCodeArray = new Array();
        if (ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.constructor === Array) {
            let size = ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.length;
            for (let index = 0; index < size; ++index) {
                if (ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].active.$ === 'true') {
                    if (ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].description.$) {
                        this.unavailableCodeArray.push(new UnavailableCodeArray(ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].description.$,
                            ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].code.$));
                    } else {
                        this.unavailableCodeArray.push(new UnavailableCodeArray(ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].code.$,
                            ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail[index].code.$));
                    }
                }
            }
            console.log('Unavailable code Array >>>>>>', this.unavailableCodeArray)
        } else {
            if (ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.active.$ === 'true') {
                if (ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.description.$) {
                    this.unavailableCodeArray.push(new UnavailableCodeArray(ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.description.$,
                        ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.code.$));
                } else {
                    this.unavailableCodeArray.push(new UnavailableCodeArray(ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.code.$,
                        ucParsedJson.ACDAgentUnavailableCodes.unavailableCodes.unavailableCodeDetail.code.$));
                }
            }
        }

    }


    getUnavailableCodeArray() {

        return this.unavailableCodeArray;
    }

    setCallCenterName(callCenterName, index) {

        this.callcenterArray[index].setCallCenterName(callCenterName);
        console.log('index >>> callcenter name >>>', this.callcenterArray[index].getCallCenterName());
    }

    setIsUCenabled(isUCEnabled) {

        this.isUCEnabled = isUCEnabled;
    }

    getIsUCenabled() {

        return this.isUCEnabled;
    }
}

export class UnavailableCodeArray {
    name: string;
    code: string;

    constructor(name: string, code: string) {
        this.name = name;
        this.code = code;
    }
    getName() {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    getCode() {
        return this.code;
    }
    setCode(code: string) {
        this.code = code;
    }

}

export class CallCenterArray {
    private callCenterId;
    private number;
    private active;
    private extension;
    private callCenterName;
    private updateInprogress = false;
    private errorMessage;

    constructor(callCenterId: string, active: boolean, number: string, extension: string) {
        this.callCenterId = callCenterId;
        this.number = number;
        this.extension = extension;
        this.active = active;
        this.callCenterName = '';
    }
    getCallCenterId() {
        return this.callCenterId;
    }
    setCallCenterId(callCenterId: string) {
        this.callCenterId = callCenterId;
    }
    getCallCenterNumber() {
        return this.number;
    }
    setCallCenterNumber(number: string) {
        this.number = number;
    }

    public getCallCenterActive() {

        return this.active;
    }

    setCallCenterActive(active: boolean) {

        this.active = active;
    }

    getExtension() {
        return this.extension;
    }

    setExtension(extension) {

        this.extension = extension;
    }

    getCallCenterName() {
        return this.callCenterName;
    }
    setCallCenterName(callCenterName: string) {
        this.callCenterName = callCenterName;
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
    isUpdateInprogress(flag: boolean) {
        this.updateInprogress = flag;
    }
}
