/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit, Input } from '@angular/core';
import { CallForwardingService } from 'app/IncomingCalls/CallForwarding/callForwardingService.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { CallForwardingServiceInput } from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { IncomingComponent } from 'app/IncomingCalls/incoming.component';
import { Util } from 'app/AppCommon/util';

@Component({
  selector: 'callForward',
  templateUrl: 'callForward.component.html',
  providers: [XSIServices, CallForwardingService, ServiceRouteProvider]
})
export class CallForwardComponent implements OnInit {

  private isCFChecked = false;
  private isBlurInvokedForPhNum: boolean;

  customizedTextJson = window['customizedTexts'];

  @Input() cfAlwaysRetrievingError = '';
  @Input() cfNoanswerRetrievingError = '';
  @Input() cfBusyRetrievingError = '';
  @Input() cfNotReachableRetrievingError = '';

  isCallForwardingAlwaysChecked = false;
  isCallForwardingBusyChecked = false;
  isCallForwardingNoAnswerChecked = false;
  isCallForwardingNotReachableChecked = false;
  isCfaRingSplashChecked = false;
  RingIndex;
  rings = [];
  noOfRingsSelected: number;
  cfaUpdateSvrErrMsg: string;
  cfbUpdateSrvErrMsg: string;
  cfnaUpdateSrvErrMsg: string;
  cfnrUpdateSrvErrMsg: string;
  isCFActive = false;
  cfAlwaysNumber;
  cfBusyNumber;
  cfNoAnswerNumber;
  cfNotReachableNumber;
  cfaVisible: boolean;
  cfbVisible: boolean;
  cfnaVisible: boolean;
  cfnrVisible: boolean;
  cfaPhonenumberFieldValidationError: string;
  cfnaPhonenumberFieldValidationError: string;
  cfbPhonenumberFieldValidationError: string;
  cfnrPhonenumberFieldValidationError: string;
  isCFAInputFieldFocused = false;
  isCFNAInputFieldFocused = false;
  isCFBInputFieldFocused = false;
  isCFNRInputFieldFocused = false;
  isCFAFetched = true;
  isCFNAFetched = true;
  isCFBFetched = true;
  isCFNRFetched = true;

  constructor(private util: Util, private incomingComponent: IncomingComponent,
    private callForwardingServiceInput: CallForwardingServiceInput, private xsiServices: XSIServices,
    private callForwardingService: CallForwardingService, private serviceRouteProvider: ServiceRouteProvider) {
    this.rings = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  }

  ngOnInit() {

    if (IncomingComponent.isCFFetchingFirstTime) {
      this.isCallForwardingAlwaysChecked = this.callForwardingService.fetchIsCFAChecked();
      this.isCallForwardingBusyChecked = this.callForwardingService.fetchIsCFBChecked();
      this.isCallForwardingNoAnswerChecked = this.callForwardingService.fetchCFNAActive();
      this.isCallForwardingNotReachableChecked = this.callForwardingService.fetchCFNRActive();
      this.cfAlwaysNumber = this.callForwardingService.fetchCFANumber();
      this.cfBusyNumber = this.callForwardingService.fetchCFBNumber();
      this.cfNoAnswerNumber = this.callForwardingService.fetchCFNANumber();
      this.cfNotReachableNumber = this.callForwardingService.fetchCFNRNumber();
      this.isCfaRingSplashChecked = this.callForwardingService.fetchCFARngSplsh();
      this.noOfRingsSelected = this.callForwardingService.fetchCFNARings();
      IncomingComponent.isCFFetchingFirstTime = false;
    } else {
      this.initializeCallForwardingAlwaysService();
      this.initializeCallForwardingBusyService();
      this.initializeCallForwardingNoAnswerService();
      this.initializeCallForwardingNotReachableService();
    }

  }

  initializeCallForwardingAlwaysService() {
    this.isCFAFetched = false;
    if (this.serviceRouteProvider.fetchCallForwardingAlwaysUrl()) {
      this.cfaVisible = this.xsiServices.fetchCfaVisible();
    }

    if (this.cfaVisible) {
      this.cfAlwaysRetrievingError = '';
      this.callForwardingService.getCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
        this.postCFAGet.bind(this));

    }
  }

  postCFAGet(cfaParsedJson) {

    this.isCFAFetched = true;
    if (!cfaParsedJson) {
      this.cfAlwaysRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isCallForwardingAlwaysChecked = this.callForwardingService.fetchIsCFAChecked();
      this.cfAlwaysNumber = this.callForwardingService.fetchCFANumber();
      this.isCfaRingSplashChecked = this.callForwardingService.fetchCFARngSplsh();

    }
  }

  initializeCallForwardingBusyService() {
    this.isCFBFetched = false;
    if (this.serviceRouteProvider.fetchCallForwardingBusyUrl()) {
      this.cfbVisible = this.xsiServices.fetchCfbVisible();
    }

    if (this.cfbVisible) {
      this.cfBusyRetrievingError = '';
      this.callForwardingService.getCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
        this.postCFBGet.bind(this));

    }
  }

  postCFBGet(cfbParsedJson) {

    this.isCFBFetched = true;

    if (!cfbParsedJson) {
      this.cfBusyRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isCallForwardingBusyChecked = this.callForwardingService.fetchIsCFBChecked();
      this.cfBusyNumber = this.callForwardingService.fetchCFBNumber();

    }
  }

  initializeCallForwardingNoAnswerService() {
    this.isCFNAFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl()) {
      this.cfnaVisible = this.xsiServices.fetchCfnaVisible();
    }

    if (this.cfnaVisible) {
      this.cfNoanswerRetrievingError = '';
      this.callForwardingService.getCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
        this.postCFNAGet.bind(this));
    }
  }

  postCFNAGet(cfnaParsedJson) {

    this.isCFNAFetched = true;

    if (cfnaParsedJson) {
      this.isCallForwardingNoAnswerChecked = this.callForwardingService.fetchIsCFNAChecked();
      this.cfNoAnswerNumber = this.callForwardingService.fetchCFNANumber();
      this.noOfRingsSelected = this.callForwardingService.fetchCFNARings();

    } else {
      this.cfNoanswerRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  initializeCallForwardingNotReachableService() {
    this.isCFNRFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNotReachableUrl()) {
      this.cfnrVisible = this.xsiServices.fetchCfnrVisible();
    }

    if (this.cfnrVisible) {
      this.cfNotReachableRetrievingError = '';
      this.callForwardingService.getCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
        this.postCFNRGet.bind(this));
    }
  }

  postCFNRGet(cfnrParsedJson) {

    this.isCFNRFetched = true;

    if (cfnrParsedJson) {
      this.isCallForwardingNotReachableChecked = this.callForwardingService.fetchIsCFNRChecked();
      this.cfNotReachableNumber = this.callForwardingService.fetchCFNRNumber();
    } else {
      this.cfNotReachableRetrievingError = this.customizedTextJson.error.unabletofetch;
    }

  }

  callForwardingAlwaysActive() {

    this.cfaPhonenumberFieldValidationError = '';
    this.cfaUpdateSvrErrMsg = '';
    if (this.isCallForwardingAlwaysChecked) {

      this.isCallForwardingAlwaysChecked = false;
      this.isCFAFetched = false;
      this.callForwardingService.putCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
        this.isCallForwardingAlwaysChecked, this.callForwardingService.fetchCFANumber(),
        this.postCFAPut.bind(this));
      this.callForwardingServiceInput.setIsCFActive(false || this.isCallForwardingBusyChecked
        || this.isCallForwardingNoAnswerChecked || this.isCallForwardingNotReachableChecked);

    } else {
      this.isCallForwardingAlwaysChecked = true;
      if (this.callForwardingService.fetchCFANumber()) {
        this.isCFAFetched = false;
        this.callForwardingService.putCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
          this.isCallForwardingAlwaysChecked, this.callForwardingService.fetchCFANumber(),
          this.postCFAPut.bind(this));
        this.callForwardingServiceInput.setIsCFActive(true || this.isCallForwardingBusyChecked
          || this.isCallForwardingNoAnswerChecked || this.isCallForwardingNotReachableChecked);
      } else {
        this.cfaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_always.err_text;
      }
    }

  }

  cfaRingSplashActive() {

    this.cfaUpdateSvrErrMsg = '';

    if (this.callForwardingService.fetchIsCFAChecked()) {
      if (this.callForwardingService.fetchCFARngSplsh()) {
        this.isCfaRingSplashChecked = false;
      } else {
        this.isCfaRingSplashChecked = true;
      }
      this.callForwardingService.putCFARingSplash(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
        this.isCfaRingSplashChecked, this.postCFARingSplashPut.bind(this));
    } else {
      console.log('CFA is disabled. Please enable CFA first!');
    }
  }

  callForwardingBusyActive() {

    this.cfbPhonenumberFieldValidationError = '';
    this.cfbUpdateSrvErrMsg = '';

    if (this.isCallForwardingBusyChecked) {
      this.isCallForwardingBusyChecked = false;
      this.isCFBFetched = false;
      this.callForwardingService.putCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
        this.isCallForwardingBusyChecked, this.callForwardingService.fetchCFBNumber(),
        this.postCFBPut.bind(this));
      this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked || false
        || this.isCallForwardingNoAnswerChecked || this.isCallForwardingNotReachableChecked);
    } else {

      this.isCallForwardingBusyChecked = true;

      if (this.callForwardingService.fetchCFBNumber()) {
        this.isCFBFetched = false;
        this.callForwardingService.putCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
          this.isCallForwardingBusyChecked, this.callForwardingService.fetchCFBNumber(),
          this.postCFBPut.bind(this));
        this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked || true ||
          this.isCallForwardingNoAnswerChecked || this.isCallForwardingNotReachableChecked);
      } else {
        this.cfbPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_busy.err_text;
      }
    }

  }

  callForwardingNoAnswerActive() {

    this.cfnaUpdateSrvErrMsg = '';
    this.cfnaPhonenumberFieldValidationError = '';
    if (this.isCallForwardingNoAnswerChecked) {
      this.isCallForwardingNoAnswerChecked = false;
      this.isCFNAFetched = false;
      this.callForwardingService.putCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
        this.isCallForwardingNoAnswerChecked, this.callForwardingService.fetchCFNANumber(),
        this.postCFNAPut.bind(this));
      this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked || false
        || this.isCallForwardingBusyChecked || this.isCallForwardingNotReachableChecked);
    } else {
      this.cfnaPhonenumberFieldValidationError = '';
      this.isCallForwardingNoAnswerChecked = true;
      if (this.callForwardingService.fetchCFNANumber()) {
        this.isCFNAFetched = false;
        this.callForwardingService.putCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
          this.isCallForwardingNoAnswerChecked, this.callForwardingService.fetchCFNANumber(),
          this.postCFNAPut.bind(this));
        this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked || true ||
          this.isCallForwardingBusyChecked || this.isCallForwardingNotReachableChecked);
      } else {
        this.cfnaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_no_answer.err_text;
      }
    }

  }

  callForwardingNotReachableActive() {

    this.cfnrPhonenumberFieldValidationError = '';
    this.cfnrUpdateSrvErrMsg = '';
    if (this.isCallForwardingNotReachableChecked) {
      this.isCallForwardingNotReachableChecked = false;
      this.isCFNRFetched = false;
      this.callForwardingService.putCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
        this.isCallForwardingNotReachableChecked, this.callForwardingService.fetchCFNRNumber(),
        this.postCFNRPut.bind(this));
      this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked ||
        this.isCallForwardingBusyChecked || this.isCallForwardingNoAnswerChecked || false);
    } else {
      this.isCallForwardingNotReachableChecked = true;
      if (this.callForwardingService.fetchCFNRNumber()) {
        this.isCFNRFetched = false;
        this.callForwardingService.putCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
          this.isCallForwardingNotReachableChecked, this.callForwardingService.fetchCFNRNumber(),
          this.postCFNRPut.bind(this));
        this.callForwardingServiceInput.setIsCFActive(this.isCallForwardingAlwaysChecked || true
          || this.isCallForwardingBusyChecked || this.isCallForwardingNoAnswerChecked);
      } else {
        this.cfnrPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_not_reachable.err_text;
      }
    }
  }

  postCFARingSplashPut(isCFARingSplashActive, err) {

    if (err) {

      if (err.status === 0) {
        this.cfaUpdateSvrErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfaUpdateSvrErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    this.isCfaRingSplashChecked = isCFARingSplashActive;

  }

  onPhonenumberKeydown(event) {
    this.onPhonenumberChange1(event);
  }

  /*This method validates for each keystroke given by the user*/
  onPhoneNumberChange(event) {
    this.onPhonenumberChange1(event);
  }

  // =To-do unused method, should be removed.
  clearErrorMessages() {
    this.cfaPhonenumberFieldValidationError = '';
    this.cfnaPhonenumberFieldValidationError = '';
    this.cfbPhonenumberFieldValidationError = '';
    this.cfnrPhonenumberFieldValidationError = '';
  }

  onPhonenumberChange1(event) {
    let inputField = event.srcElement.id;
    if (inputField === 'cfaNumberId') {
      this.isCFNAInputFieldFocused = false;
      this.isCFBInputFieldFocused = false;
      this.isCFNRInputFieldFocused = false;
      this.isCFAInputFieldFocused = true;
      this.cfaPhonenumberFieldValidationError = '';
      this.cfAlwaysRetrievingError = '';
      if (event.srcElement.value === '') {
        this.cfaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_always.err_text;
      }
    } else if (inputField === 'cfnaNumberId') {
      this.isCFAInputFieldFocused = false;
      this.isCFBInputFieldFocused = false;
      this.isCFNRInputFieldFocused = false;
      this.isCFNAInputFieldFocused = true;
      this.cfnaPhonenumberFieldValidationError = '';
      this.cfNoanswerRetrievingError = '';
      if (event.srcElement.value === '') {
        this.cfnaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_no_answer.err_text;
      }
    } else if (inputField === 'cfbNumberId') {
      this.isCFAInputFieldFocused = false;
      this.isCFNRInputFieldFocused = false;
      this.isCFNAInputFieldFocused = false;
      this.isCFBInputFieldFocused = true;
      this.cfbPhonenumberFieldValidationError = '';
      this.cfBusyRetrievingError = '';
      if (event.srcElement.value === '') {
        this.cfbPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_busy.err_text;
      }
    } else if (inputField === 'cfnrNumberId') {
      this.isCFAInputFieldFocused = false;
      this.isCFNAInputFieldFocused = false;
      this.isCFBInputFieldFocused = false;
      this.isCFNRInputFieldFocused = true;
      this.cfnrPhonenumberFieldValidationError = '';
      this.cfNotReachableRetrievingError = '';
      if (event.srcElement.value === '') {
        this.cfnrPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_not_reachable.err_text;
      }
    }
  }

  stopReduntantBlurCall() {

    this.isBlurInvokedForPhNum = false;
  }

  getCallForwardingAlwaysInput(event) {

    this.isCFAInputFieldFocused = false;
    if (!this.isBlurInvokedForPhNum) {
      this.cfaPhonenumberFieldValidationError = '';
      this.cfaUpdateSvrErrMsg = '';
      this.cfAlwaysNumber = event.srcElement.value;
      this.isBlurInvokedForPhNum = true;
      if (!this.cfAlwaysNumber) {
        this.cfaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_always.err_text;
        this.callForwardingService.setCallForwardingAlwaysNumber('');
        this.isCallForwardingAlwaysChecked = false;
        this.callForwardingService.putCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
          this.isCallForwardingAlwaysChecked, this.cfAlwaysNumber, this.postCFAPut.bind(this));

      } else if (this.cfAlwaysNumber && !(this.util.isE164valid(this.cfAlwaysNumber) || this.util.isValidSipUri(this.cfAlwaysNumber))) {
        this.cfaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_always.invalid_phone_number_msg;
      } else {
        this.isCFAFetched = false;
        this.callForwardingService.putCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
          this.isCallForwardingAlwaysChecked, this.cfAlwaysNumber, this.postCFAPut.bind(this));

      }
    }



  }

  getCallForwardingNoAnswerInput(event) {

    this.isCFNAInputFieldFocused = false;
    if (!this.isBlurInvokedForPhNum) {
      this.cfnaPhonenumberFieldValidationError = '';
      this.cfnaUpdateSrvErrMsg = '';
      this.cfNoAnswerNumber = event.srcElement.value;
      this.isBlurInvokedForPhNum = true;

      if (!this.cfNoAnswerNumber) {
        this.cfnaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_no_answer.err_text;
        this.callForwardingService.setCallForwardingNoAnswerNumber('');
        this.isCallForwardingNoAnswerChecked = false;
        this.callForwardingService.putCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
          this.isCallForwardingNoAnswerChecked, this.cfNoAnswerNumber, this.postCFNAPut.bind(this));

      } else if (this.cfNoAnswerNumber && !(this.util.isE164valid(this.cfNoAnswerNumber)
        || this.util.isValidSipUri(this.cfNoAnswerNumber))) {
        this.cfnaPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_no_answer.invalid_phone_number_msg;
      } else {
        this.cfnaPhonenumberFieldValidationError = '';
        this.isCFNAFetched = false;
        this.callForwardingService.putCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
          this.isCallForwardingNoAnswerChecked, this.cfNoAnswerNumber, this.postCFNAPut.bind(this));

      }
    }


  }

  getCallForwardingBusyInput(event) {

    this.isCFBInputFieldFocused = false;
    if (!this.isBlurInvokedForPhNum) {
      this.cfbPhonenumberFieldValidationError = '';
      this.cfbUpdateSrvErrMsg = '';
      this.cfBusyNumber = event.srcElement.value;
      this.isBlurInvokedForPhNum = true;

      if (!this.cfBusyNumber) {
        this.cfbPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_busy.err_text;
        this.callForwardingService.setCallForwardingBusyNumber('');
        this.isCallForwardingBusyChecked = false;
        this.callForwardingService.putCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
          this.isCallForwardingBusyChecked, this.cfBusyNumber, this.postCFBPut.bind(this));

      } else if (this.cfBusyNumber && !(this.util.isE164valid(this.cfBusyNumber) || this.util.isValidSipUri(this.cfBusyNumber))) {
        this.cfbPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_busy.invalid_phone_number_msg;
      } else {
        this.cfbPhonenumberFieldValidationError = '';
        this.isCFBFetched = false;
        this.callForwardingService.putCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
          this.isCallForwardingBusyChecked, this.cfBusyNumber, this.postCFBPut.bind(this));
      }
    }
  }

  getCallForwardingNotReachableInput(event) {

    this.isCFNRInputFieldFocused = false;
    if (!this.isBlurInvokedForPhNum) {

      this.cfnrPhonenumberFieldValidationError = '';
      this.cfnrUpdateSrvErrMsg = '';
      this.cfNotReachableNumber = event.srcElement.value;
      this.isBlurInvokedForPhNum = true;

      if (!this.cfNotReachableNumber) {
        this.cfnrPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_not_reachable.err_text;
        this.callForwardingService.setCallForwardingNotReachableNumber('');
        this.isCallForwardingNotReachableChecked = false;
        this.callForwardingService.putCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
          this.isCallForwardingNotReachableChecked, this.cfNotReachableNumber, this.postCFNRPut.bind(this));

      } else if (this.cfNotReachableNumber && !(this.util.isE164valid(this.cfNotReachableNumber)
        || this.util.isValidSipUri(this.cfNotReachableNumber))) {
        this.cfnrPhonenumberFieldValidationError = this.customizedTextJson.call_forwarding_not_reachable.invalid_phone_number_msg;
      } else {
        this.cfnrPhonenumberFieldValidationError = '';
        this.isCFNRFetched = false;
        this.callForwardingService.putCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
          this.isCallForwardingNotReachableChecked, this.cfNotReachableNumber, this.postCFNRPut.bind(this));
      }
    }
  }

  /*Callback method to be invoked after server's response had come. */
  postCFAPut(isCallForwardingAlwaysActive, err) {

    this.isCFAFetched = true;
    if (err) {
      if (err.status === 0) {
        this.cfaUpdateSvrErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfaUpdateSvrErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    this.isCallForwardingAlwaysChecked = this.callForwardingService.fetchCFAActive();
    this.cfAlwaysNumber = this.callForwardingService.fetchCFANumber();
  }

  /*Callback method to be invoked after server's response had come. */
  postCFBPut(isCallForwardingBusyActive, err) {

    this.isCFBFetched = true;
    if (err) {
      if (err.status === 0) {
        this.cfbUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfbUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    this.isCallForwardingBusyChecked = this.callForwardingService.fetchCFBActive();
    this.cfBusyNumber = this.callForwardingService.fetchCFBNumber();
  }

  /*Callback method to be invoked after server's response had come. */
  postCFNAPut(isCallForwardingNoAnswerActive, err) {
    this.isCFNAFetched = true;
    if (err) {
      if (err.status === 0) {
        this.cfnaUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfnaUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }

    }
    this.isCallForwardingNoAnswerChecked = this.callForwardingService.fetchCFNAActive();
    this.cfNoAnswerNumber = this.callForwardingService.fetchCFNANumber();
  }

  /*Callback method to be invoked after server's response had come. */
  postCFNRPut(isCallForwardingNotReachableActive, err) {

    this.isCFNRFetched = true;
    if (err) {
      if (err.status === 0) {
        this.cfnrUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfnrUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    this.isCallForwardingNotReachableChecked = this.callForwardingService.fetchCFNRActive();
    this.cfNotReachableNumber = this.callForwardingService.fetchCFNRNumber();
  }



  selectNoOfRings(event) {

    this.cfnaUpdateSrvErrMsg = '';
    if (this.callForwardingService.fetchIsCFNAChecked() && this.callForwardingService.fetchCFNANumber()) {

      this.noOfRingsSelected = event.target.value;
      this.callForwardingService.putCallForwardingNoAnswerRings(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
        Number(this.noOfRingsSelected), this.postCFNARingsPut.bind(this));

    } else {
      console.log('Please enable CFNA first or Provide CFNA number.');
    }
  }

  /*Callback method to be invoked after server's response had come. */
  postCFNARingsPut(cfnaNoOfRings, err) {

    if (err) {
      if (err.status === 0) {
        this.cfnaUpdateSrvErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.cfnaUpdateSrvErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    if (cfnaNoOfRings) {
      this.noOfRingsSelected = this.callForwardingService.fetchCFNARings();
    }
  }

  getIncomingComponentInstance() {
    return this.incomingComponent;
  }
}
