/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';
import { Util } from 'app/AppCommon/util';

import { AppComponent } from 'app/AppCommon/app.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { CallCenterService } from 'app/CallControl/CallCenterQueues/callcenterService.service';
import { CallCenterServiceInput } from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';
import { UnavailableCodeArray } from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';
import { CallCenterArray } from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';
import { CallControlService } from 'app/CallControl/callControlService.service';


@Component({
  selector: 'callcenter',
  templateUrl: 'callcenter.component.html',
  providers: [XSIServices, ServiceRouteProvider, AppComponent]
})

export class CallCenterComponent {

  private unavailableCodeUrl: string;
  private callCenterNameUrl: string;
  private unavailableCodeArray: UnavailableCodeArray[];
  private unavailableCodeIndex: number;

  static isCallCenterUpdated: boolean;
  static callcenterServiceRetrievingError: string = "";
  static acdStateSelected: string;

  unavailableCodeUpdateErrMsg: any;
  isCallCenterIdUpdated: boolean;
  ccActiveUpdateErrMsg: string;
  acdStateUpdateErrMsg: any;
  isCCIdAvailable: any;
  customizedTextJson = window['customizedTexts'];
  acdState = [];
  isCallCenterChecked: boolean = false;
  newAcdState: string;
  callcenterArray: CallCenterArray[];
  isUnavailableStateSet: boolean = false;
  unavailableCode: string;
  unavailableCodeSelected: string;
  isUCenabled: boolean;
  ucArray = [];
  static isCallcenterFetchedFirstTime: boolean;
  isCallCenterQueueVisible: boolean;

  constructor(private xsiServices: XSIServices, private serviceRouteProvider: ServiceRouteProvider,
    private callCenterService: CallCenterService, private callCenterServiceInput: CallCenterServiceInput,
    private callControlServiceInput: CallControlServiceInput, private callControlService: CallControlService, private util: Util) {

    this.acdState = [this.customizedTextJson.callcenter.sign_in, this.customizedTextJson.callcenter.sign_out,
    this.customizedTextJson.callcenter.available, this.customizedTextJson.callcenter.unavailable, this.customizedTextJson.callcenter.wrap_up];

  }

  ngOnInit() {

    if (CallCenterComponent.isCallcenterFetchedFirstTime) {

      this.newAcdState = this.callCenterService.fetchCCAcdState();
      if (this.newAcdState == this.customizedTextJson.callcenter.unavailable) {
        this.isUnavailableStateSet = true;
      }
      else {
        this.isUnavailableStateSet = false;
      }
      this.callcenterArray = this.callCenterServiceInput.getCallCenterArray();
      this.initializeCallCenterNames();
      CallCenterComponent.isCallcenterFetchedFirstTime = false;
    } else {

      this.initializeCCqueue();
      this.initializeprofile();

    }
    this.initializeUnavailableCodes();
  }

  initializeCCqueue() {

    if ((this.serviceRouteProvider.fetchCallCenterUrl())) {
      this.isCallCenterQueueVisible = this.xsiServices.fetchCallcenterQueueVisible();
    }
    if (this.isCallCenterQueueVisible) {
      CallCenterComponent.isCallCenterUpdated = false;
      CallCenterComponent.callcenterServiceRetrievingError = '';
      this.callCenterService.getCallCenterService(this.serviceRouteProvider.fetchCallCenterUrl(), this.postCCDataGet.bind(this));
    }
  }

  postCCDataGet(error) {

    CallCenterComponent.isCallCenterUpdated = true;
    if (error) {
      if (error.status === 0) {
        CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.networkerror;
      } else {
        CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
      }
    } else {
      CallCenterComponent.acdStateSelected = this.callCenterService.fetchCCAcdState();
      this.newAcdState = CallCenterComponent.acdStateSelected;
      if (this.newAcdState === this.customizedTextJson.callcenter.unavailable) {
        this.isUnavailableStateSet = true;
      }
      else {
        this.isUnavailableStateSet = false;
      }
      this.callcenterArray = this.callCenterServiceInput.getCallCenterArray();
      this.initializeCallCenterNames();

    }
  }

  initializeprofile() {
    this.callControlService.getProfileData(this.serviceRouteProvider.fetchProfileUrl(), this.postProfileDataGet.bind(this));
    CallCenterComponent.callcenterServiceRetrievingError = '';
  }

  postProfileDataGet(profileParsedJSON) {
    if (profileParsedJSON) {
      console.log('Fetched profile ');
    } else {
      CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
      console.log('Fetched profile FAIL');
    }
  }



  getIsCCIdAvailable() {
    return this.callCenterService.fetchIsCCIdAvailable();
  }

  postAcdStatePut(error) {
    CallCenterComponent.isCallCenterUpdated = true;

    if (error) {
      if (error.status == 0) {
        this.acdStateUpdateErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.acdStateUpdateErrMsg = this.customizedTextJson.error.updatefailed;
      }
      this.newAcdState = CallCenterComponent.acdStateSelected;
    }
    CallCenterComponent.acdStateSelected = this.callCenterService.fetchCCAcdState();

  }

  postUCPut(error) {

    CallCenterComponent.isCallCenterUpdated = true;

    if (error) {
      if (error.status == 0) {
        this.unavailableCodeUpdateErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.unavailableCodeUpdateErrMsg = this.customizedTextJson.error.updatefailed;
      }
      this.setUnavailableCodeText();
    }

  }

  acdStateChange(event) {


    this.newAcdState = event.target.value;
    CallCenterComponent.isCallCenterUpdated = false;
    this.clearErrorMessages()
    if (this.newAcdState == this.customizedTextJson.callcenter.unavailable) {
      this.isUnavailableStateSet = true;
    }
    else {
      this.isUnavailableStateSet = false;
    }

    this.unavailableCode = this.customizedTextJson.callcenter.none;
    this.unavailableCodeSelected = this.customizedTextJson.callcenter.none;

    this.callCenterService.putAcdState(this.serviceRouteProvider.fetchCallCenterUrl(),
      this.newAcdState, this.isUnavailableStateSet,
      this.isUCenabled, this.unavailableCode,
      this.postAcdStatePut.bind(this));
  }

  setUnavailableCode(event) {

    this.clearErrorMessages();
    CallCenterComponent.isCallCenterUpdated = false;
    for (let index = 0; index < this.ucArray.length; ++index) {

      if (event.srcElement.options[index].selected == true) {
        this.unavailableCodeIndex = index;
      }
    }

    if (this.unavailableCodeIndex != 0) {

      this.unavailableCode = this.unavailableCodeArray[this.unavailableCodeIndex - 1].code;
    }
    else {
      this.unavailableCode = this.customizedTextJson.callcenter.none;
    }
    console.log("Unavailable code set >>>> ", this.unavailableCode);

    this.callCenterService.putAcdState(this.serviceRouteProvider.fetchCallCenterUrl(),
      this.newAcdState, this.isUnavailableStateSet,
      this.isUCenabled, this.unavailableCode,
      this.postUCPut.bind(this));

  }

  callcenterActiveChange(ccElement) {

    if (ccElement.getCallCenterActive()) {
      ccElement.setCallCenterActive(false);
    } else {
      ccElement.setCallCenterActive(true);
    }

    ccElement.setUpdateInprogress(true);
    ccElement.setErrorMsg("");
    this.clearErrorMessages();
    console.log("event ", ccElement);

    this.callCenterService.putCCData(this.serviceRouteProvider.fetchCallCenterUrl(), ccElement, this.postCCput.bind(this, ccElement));


  }

  postCCput(ccElement: CallCenterArray, res) {

    ccElement.setUpdateInprogress(false);

    if (!res || !(res.status >= 200 && res.status < 400)) {
      let errorStatus = "";
      if (res && (res.status === 0 || res.status)) {
        errorStatus = " " + res.status;
        if (res.status === 0) {
          ccElement.setErrorMsg(this.customizedTextJson.error.networkerror);
        }
        else {
          ccElement.setErrorMsg(this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, errorStatus));
        }
      }
    }
  }

  initializeUnavailableCodes() {

    console.log("this.callControlServiceInput.getIsEnterprise >>>>>>>>>>>", this.callControlServiceInput.getIsEnterprise())
    CallCenterComponent.callcenterServiceRetrievingError = "";

    if (this.callControlServiceInput.getIsEnterprise() == "true") {

      this.unavailableCodeUrl = window['xsiActionsBaseURL'] + "/v2.0/group/" + this.callControlServiceInput.getGroupId() + "/services/callcenter/unavailablecodes?enterpriseId=" +
        this.callControlServiceInput.getServiceProviderId();
    } else {

      this.unavailableCodeUrl = window['xsiActionsBaseURL'] + "/v2.0/group/" + this.callControlServiceInput.getGroupId() + "/services/callcenter/unavailablecodes?serviceProviderId=" +
        this.callControlServiceInput.getServiceProviderId();
    }

    this.callCenterService.getUnavailableCodes(this.unavailableCodeUrl, this.postUCget.bind(this));

  }

  postUCget(error) {
    if (!error) {

      console.log("Unavailable codes fetched");

      this.isUCenabled = this.callCenterServiceInput.getIsUCenabled();
      console.log("this.isUCenabled >>>>>>>", this.isUCenabled);
      if (this.isUCenabled) {
        this.unavailableCodeArray = this.callCenterServiceInput.getUnavailableCodeArray();

        for (let index = 0; index < this.unavailableCodeArray.length; ++index) {
          this.ucArray[index] = this.unavailableCodeArray[index].code + " - " + this.unavailableCodeArray[index].name;
        }

        this.ucArray.unshift(this.customizedTextJson.callcenter.none);

        console.log("this.callCenterServiceInput.getSelectedUnavailableCode()", this.callCenterServiceInput.getSelectedUnavailableCode())

        this.setUnavailableCodeText();

      }
    }
    else {
      CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    }

  }


  initializeCallCenterNames() {

    let size = this.callcenterArray.length;
    this.isCallCenterIdUpdated = false;
    CallCenterComponent.callcenterServiceRetrievingError = "";

    for (let index = 0; index < size; ++index) {

      this.callCenterNameUrl = window['xsiActionsBaseURL'] + "/v2.0/callcenter/" + this.callcenterArray[index].getCallCenterId() + "/profile?";
      this.callCenterService.getCallCenterName(this.callCenterNameUrl, index, this.postCCnameGet.bind(this));

    }
  }

  postCCnameGet(error) {

    if (!error) {
      this.isCallCenterIdUpdated = true;
      console.log(this.callcenterArray);
    }
    else {
      CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }


  callCenterChecked() {

    if (this.isCallCenterChecked) {
      this.isCallCenterChecked = false;
    }
    else {
      this.isCallCenterChecked = true;
    }
  }

  clearErrorMessages() {
    this.acdStateUpdateErrMsg = "";
    this.ccActiveUpdateErrMsg = "";
    this.unavailableCodeUpdateErrMsg = "";
  }

  setUnavailableCodeText() {
    if (this.callCenterServiceInput.getSelectedUnavailableCode() != null) {

      for (let index = 0; index < this.unavailableCodeArray.length; ++index) {

        if (this.unavailableCodeArray[index].code == this.callCenterServiceInput.getSelectedUnavailableCode()) {

          this.unavailableCodeSelected = this.unavailableCodeArray[index].code + " - " + this.unavailableCodeArray[index].name;
        }
      }
    }
    else {
      this.unavailableCodeSelected = this.customizedTextJson.callcenter.none;
    }
  }

}