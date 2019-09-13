/* Copyright © 2017 BroadSoft Inc. */

import {Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {XSIServices} from 'app/AppCommon/xsiServiceList.service';
import {HttpServices} from 'app/AppCommon/httpservices.service';
import {ServiceRouteProvider} from 'app/AppCommon/serviceRouteProvider.service';
import {ServiceRouter} from 'app/AppCommon/serviceRouter.service';
import {RemoteOfficeServiceInput} from 'app/IncomingCalls/RemoteOffice/remoteOfficeServiceInput.service';
import {XSIMasterServicesList} from 'app/AppCommon/xsiMasterServicesList.service';
import {MasterServiceListVisible} from 'app/AppCommon/masterServicesListVisible.service';
import {CallForwardingService} from 'app/IncomingCalls/CallForwarding/callForwardingService.service';
import {CallForwardingServiceInput} from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import {BroadWorksMobilityServiceInput} from 'app/CallControl/BroadWorksMobility/broadWorksMobilityServiceInput.service';
import {CallControlServiceInput} from 'app/CallControl/callControlServiceInput.service';
import {SimultaneousRingService} from 'app/IncomingCalls/SimultaneousRing/simultaneousRing.service';
import {SimultaneousRingServiceInput} from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import {VoicemailService} from 'app/Voicemail/voicemailService.service';
import {VoicemailServiceInput} from 'app/Voicemail/voicemailServiceInput.service';
import {SequentialRingServiceInput} from 'app/IncomingCalls/SequentialRing/sequentialRingServiceInput.service';
import {CallControlService} from 'app/CallControl/callControlService.service';
import {CallCenterService} from 'app/CallControl/CallCenterQueues/callcenterService.service';
import {CallCenterServiceInput} from 'app/CallControl/CallCenterQueues/callcenterServiceInput.service';
import {OutOfOfficeServiceInput} from 'app/IncomingCalls/OutOfOffice/outOfOfficeServiceInput.service';
import {BroadworksAnywhereService} from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereService.service';
import {BroadworksAnywhereServiceInput} from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereServiceInput.service';
import {BroadWorksAnywhereLocationsInput} from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereLocationsInput.service';
import {Util} from 'app/AppCommon/util';


@Component({
  selector: 'app-bsft-call-settings',
  templateUrl: 'app.component.html',
  providers: [BroadWorksMobilityServiceInput, CallControlServiceInput, CallForwardingServiceInput,
    CallForwardingService, MasterServiceListVisible, XSIMasterServicesList, XSIServices, HttpServices,
    ServiceRouteProvider, ServiceRouter, RemoteOfficeServiceInput, SimultaneousRingService,
    SimultaneousRingServiceInput, VoicemailService, VoicemailServiceInput, CallControlService,
    CallCenterService, CallCenterServiceInput, OutOfOfficeServiceInput, BroadworksAnywhereService,
    BroadworksAnywhereServiceInput, BroadWorksAnywhereLocationsInput, SequentialRingServiceInput,
    Util]
})

/*This class handles the UI components for the application*/
export class AppComponent implements OnInit, AfterViewInit {

  customizedTextJson = {};

  xsiServicesList: string;
  isIncomingCallExpanded = false;
  isOutgoingCallExpanded = false;
  isVoiceMailExpanded = false;
  isCallControlExpanded = false;
  masterServicesList = new Array();
  isReady = false;
  isIncomingCallsVisible: boolean;
  isOutgoingCallsVisible: boolean;
  isCallControlVisible: boolean;
  isVoiceMailVisible: boolean;
  isNoServiceVisible: boolean;

  constructor(private xsiMasterServicesList: XSIMasterServicesList, private serviceRouteProvider: ServiceRouteProvider,
    private xsiServices: XSIServices, private ref: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    const self = this;
    setTimeout (function() {
      if ( self.customizedTextJson !== window['customizedTexts'] ) {
        self.customizedTextJson = window['customizedTexts'];
        self.ref.detectChanges();
      }
    }, 1000);
  }

  ngOnInit() {
    /*Generates the login token for dev/QA purposes only*/
    console.log('Application mode : ' + window['applicationMode']);
    if (window['applicationMode'] === 'dev' || window['applicationMode'] === 'qa') {
      this.xsiServices.generateLoginTokenAndUse(this.postGeneratedLoginToken.bind(this));
    } else {
      if (window['isTextsLoaded']) {
        this.xsiServices.getXSIService(this.serviceRouteProvider.fetchServicesListUrl(), this.postXSIGet.bind(this));
      }
    }

  }

  postGeneratedLoginToken() {
    this.xsiServices.getXSIService(this.serviceRouteProvider.fetchServicesListUrl(), this.postXSIGet.bind(this));
    this.isReady = true;
  }

  postXSIGet(masterServicesList) {

    this.isReady = true;
    if (!masterServicesList) {
      /*No services is to be shown */
      console.log('No services is to be shown ');
    } else { /*Check the visibility criteria for the section headers*/
      console.log('Master Services List: ', this.xsiServices.fetchMasterServicesList());

      this.checkOutgoingCallsVisible();
      this.checkIncomingCallsVisible();
      this.checkVoiceMailVisible();
      this.checkCallControlVisible();
      this.checkNoServiceVisible();

    }
  }

  checkNoServiceVisible() {
    if (this.isIncomingCallsVisible || this.isOutgoingCallsVisible || this.isVoiceMailVisible || this.isCallControlVisible) {
      this.isNoServiceVisible = false;
    } else {
      this.isNoServiceVisible = true;
    }
  }

  checkOutgoingCallsVisible() {

    let bcidVisible = false;
    let acbVisible = false;
    if (this.serviceRouteProvider.fetchBlockCallerIdUrl()) {
      bcidVisible = this.xsiServices.fetchBcidVisible();
    } else {
      this.xsiServices.setBcidVisible(bcidVisible);
    }
    if (this.serviceRouteProvider.fetchAutomaticCallbackUrl()) {
      acbVisible = this.xsiServices.fetchAutomaticCallbackVisible();
    } else {
      this.xsiServices.setAutomaticCallbackVisible(acbVisible);
    }
    if (!bcidVisible && !acbVisible) {
      this.isOutgoingCallsVisible = false;
    } else {
      this.isOutgoingCallsVisible = true;
    }
  }

  checkIncomingCallsVisible() {

    let isDNDVisible = false;
    let isACRVisible = false;
    let isCFAVisible = false;
    let isCFBVisible = false;
    let isCFNAVisible = false;
    let isCFNRVisible = false;
    let isSimultaneousRingvisible = false;
    let isRemoteOfficeVisible = false;
    let isCWVisible = false;
    let isPAVisible = false;

    if (this.serviceRouteProvider.fetchDoNotDisturbUrl()) {
      isDNDVisible = this.xsiServices.fetchDndVisible();
    } else {
      this.xsiServices.setDndVisible(isDNDVisible);
    }
    if (this.serviceRouteProvider.fetchAnonymousCallRejectionUrl()) {
      isACRVisible = this.xsiServices.fetchAcrVisible();
    } else {
      this.xsiServices.setAcrVisible(isACRVisible);
    }
    if (this.serviceRouteProvider.fetchCallForwardingAlwaysUrl()) {
      isCFAVisible = this.xsiServices.fetchCfaVisible();
    } else {
      this.xsiServices.setCfaVisible(isCFAVisible);
    }
    if (this.serviceRouteProvider.fetchCallForwardingBusyUrl()) {
      isCFBVisible = this.xsiServices.fetchCfbVisible();
    } else {
      this.xsiServices.setCfbVisible(isCFBVisible);
    }
    if (this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl()) {
      isCFNAVisible = this.xsiServices.fetchCfnaVisible();
    } else {
      this.xsiServices.setCfnaVisible(isCFNAVisible);
    }
    if (this.serviceRouteProvider.fetchCallForwardingNotReachableUrl()) {
      isCFNRVisible = this.xsiServices.fetchCfnrVisible();
    } else {
      this.xsiServices.setCfnrVisible(isCFNRVisible);
    }
    if (this.serviceRouteProvider.fetchSimultaneousRingUrl()) {
      isSimultaneousRingvisible = this.xsiServices.fetchSimultaneousRingVisible();
    } else {
      this.xsiServices.setSimultaneousRingVisible(isSimultaneousRingvisible);
    }
    if (this.serviceRouteProvider.fetchRemoteOfficeUrl()) {
      isRemoteOfficeVisible = this.xsiServices.fetchRoVisible();
    } else {
      this.xsiServices.setRoVisible(isRemoteOfficeVisible);
    }
    if (this.serviceRouteProvider.fetchCallWaitingUrl()) {
      isCWVisible = this.xsiServices.fetchCwVisible();
    } else {
      this.xsiServices.setCwVisible(isCWVisible);
    }
    if (this.serviceRouteProvider.fetchPersonalAssistantUrl()) {
      isPAVisible = this.xsiServices.fetchPAVisible();
    }

    if (!isDNDVisible && !isACRVisible && !isCFAVisible &&
      !isCFBVisible && !isCFNAVisible && !isCFNRVisible &&
      !isSimultaneousRingvisible && !isRemoteOfficeVisible
      && !isCWVisible && !isPAVisible) {

      this.isIncomingCallsVisible = false;
    } else {
      this.isIncomingCallsVisible = true;
    }
  }

  checkVoiceMailVisible() {

    let isVoiceMailVisible = false;
    if (this.serviceRouteProvider.fetchVoicemailUrl()) {
      isVoiceMailVisible = this.xsiServices.fetchVoicemailVisible();
    } else {
      this.xsiServices.setVoicemailVisible(isVoiceMailVisible);
    }
    if (!isVoiceMailVisible) {
      this.isVoiceMailVisible = false;
    } else {
      this.isVoiceMailVisible = true;
    }
  }

  checkCallControlVisible() {

    let isBroadWorksMobilityVisible = false;
    let isCallCenterVisible = false;
    let isBroadWorksAnywhereVisible = false;

    if (this.serviceRouteProvider.fetchBroadWorksMobilityUrl()) {
      isBroadWorksMobilityVisible = this.xsiServices.fetchBWMobilityVisible();
    } else {
      this.xsiServices.setBWMobilityVisible(isBroadWorksMobilityVisible);
    }
    if (this.serviceRouteProvider.fetchCallCenterUrl()) {
      isCallCenterVisible = this.xsiServices.fetchCallcenterQueueVisible();
    } else {
      this.xsiServices.setCallcenterQueueVisible(isCallCenterVisible);
    }
    if (this.serviceRouteProvider.fetchBroadWorksAnywhereUrl()) {
      isBroadWorksAnywhereVisible = this.xsiServices.fetchBroadWorksAnywhereVisible();
    } else {
      this.xsiServices.setBroadWorksAnywhereVisible(isBroadWorksAnywhereVisible);
    }
    if (!isBroadWorksMobilityVisible && !isCallCenterVisible && !isBroadWorksAnywhereVisible) {
      this.isCallControlVisible = false;
    } else {
      this.isCallControlVisible = true;
    }
  }

  incomingCallExpanded() {
    if (this.isIncomingCallExpanded) {
      this.isIncomingCallExpanded = false;
    } else {
      this.isIncomingCallExpanded = true;
      if (this.isOutgoingCallExpanded || this.isCallControlExpanded) {
        this.isOutgoingCallExpanded = false;
      }
      if (this.isVoiceMailExpanded) {
        this.isVoiceMailExpanded = false;
      }
      this.isCallControlExpanded = false;
    }
  }

  outgoingCallExpanded() {
    if (this.isOutgoingCallExpanded) {
      this.isOutgoingCallExpanded = false;
    } else {
      this.isOutgoingCallExpanded = true;
    }
    if (this.isVoiceMailExpanded) {
      this.isVoiceMailExpanded = false;
    }
    if (this.isIncomingCallExpanded || this.callControlExpanded) {
      this.isIncomingCallExpanded = false;
    }
    this.isCallControlExpanded = false;
  }


  callControlExpanded() {

    if (this.isCallControlExpanded) {
      this.isCallControlExpanded = false;
    } else {
      this.isCallControlExpanded = true;
      if (this.isIncomingCallExpanded || this.isOutgoingCallExpanded) {
        this.isIncomingCallExpanded = false;
        this.isOutgoingCallExpanded = false;

      }
    }
    if (this.isVoiceMailExpanded) {
      this.isVoiceMailExpanded = false;
    }
  }

  voicemailExpanded() {
    if (this.isVoiceMailExpanded) {
      this.isVoiceMailExpanded = false;
    } else {
      this.isVoiceMailExpanded = true;
    }
    if (this.isIncomingCallExpanded) {
      this.isIncomingCallExpanded = false;
    }
    if (this.isOutgoingCallExpanded) {
      this.isOutgoingCallExpanded = false;
    }
    if (this.isCallControlExpanded) {
      this.isCallControlExpanded = false;
    }
  }


}
