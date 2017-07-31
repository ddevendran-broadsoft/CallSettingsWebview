/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { ServiceRouter } from 'app/AppCommon/serviceRouter.service';
import { RemoteOfficeServiceInput } from 'app/IncomingCalls/RemoteOffice/remoteOfficeServiceInput.service';
import { XSIMasterServicesList } from 'app/AppCommon/xsiMasterServicesList.service';
import { MasterServiceListVisible } from 'app/AppCommon/masterServicesListVisible.service';
import { CallForwardingService } from 'app/IncomingCalls/CallForwarding/callForwardingService.service';
import { CallForwardingServiceInput } from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';
import { BroadWorksMobilityServiceInput } from 'app/CallControl/BroadWorksMobility/broadWorksMobilityServiceInput.service';
import { CallControlService } from 'app/CallControl/callControlService.service'
import { SimultaneousRingService } from 'app/IncomingCalls/SimultaneousRing/simultaneousRing.service';
import { SimultaneousRingServiceInput } from 'app/IncomingCalls/SimultaneousRing/simultaneousRingServiceInput.service';
import { VoicemailService } from 'app/Voicemail/voicemailService.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';

@Component({
  selector: 'bsft-call-settings',
  templateUrl: 'app.component.html',
  providers: [BroadWorksMobilityServiceInput, CallControlServiceInput, CallForwardingServiceInput, CallForwardingService,
    MasterServiceListVisible, XSIMasterServicesList, XSIServices, HttpServices, ServiceRouteProvider,
    ServiceRouter, RemoteOfficeServiceInput, SimultaneousRingService, SimultaneousRingServiceInput,
    VoicemailService, VoicemailServiceInput, CallControlService]
})

/*This class handles the UI components for the application*/
export class AppComponent {

  customizedTextJson = window['customizedTexts'];

  xsiServicesList: string;
  isIncomingCallExpanded: boolean = false;
  isOutgoingCallExpanded: boolean = false;
  isVoiceMailExpanded: boolean = false;
  isCallControlExpanded: boolean = false;
  masterServicesList = new Array();
  private isReady: boolean = false;
  isIncomingCallsVisible: boolean;
  isOutgoingCallsVisible: boolean;
  isCallControlVisible: boolean;
  isVoiceMailVisible: boolean;
  isNoServiceVisible: boolean;

  constructor(private xsiMasterServicesList: XSIMasterServicesList, private serviceRouteProvider: ServiceRouteProvider, private xsiServices: XSIServices) {

  }

  ngOnInit() {

    /*Generates the login token for dev/QA purposes only*/
    console.log("Application mode : " + window['applicationMode']);
    if (window['applicationMode'] == 'dev' || window['applicationMode'] == 'qa') {
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
      console.log("No services is to be shown ");
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

    var bcidVisible: boolean = false;
    var acbVisible: boolean = false;
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

    var isDNDVisible: boolean = false;
    var isACRVisible: boolean = false;
    var isCFAVisible: boolean = false;
    var isCFBVisible: boolean = false;
    var isCFNAVisible: boolean = false;
    var isCFNRVisible: boolean = false;
    var isSimultaneousRingvisible: boolean = false;
    var isRemoteOfficeVisible: boolean = false;
    var isCWVisible: boolean = false;

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

    if (!isDNDVisible && !isACRVisible && !isCFAVisible && !isCFBVisible && !isCFNAVisible && !isCFNRVisible && !isSimultaneousRingvisible && !isRemoteOfficeVisible && !isCWVisible) {
      this.isIncomingCallsVisible = false;
    } else {
      this.isIncomingCallsVisible = true;
    }
  }

  checkVoiceMailVisible() {

    var isVoiceMailVisible: boolean = false;
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

    var isBroadWorksMobilityVisible: boolean = false;
    if (this.serviceRouteProvider.fetchBroadWorksMobilityUrl()) {
      isBroadWorksMobilityVisible = this.xsiServices.fetchBWMobilityVisible();
    } else {
      this.xsiServices.setBWMobilityVisible(isBroadWorksMobilityVisible);
    }
    if (!isBroadWorksMobilityVisible) {
      this.isCallControlVisible = false;
    } else {
      this.isCallControlVisible = true;
    }
  }

  incomingCallExpanded() {
    if (this.isIncomingCallExpanded)
      this.isIncomingCallExpanded = false;
    else {
      this.isIncomingCallExpanded = true;
      if (this.isOutgoingCallExpanded || this.isCallControlExpanded)
        this.isOutgoingCallExpanded = false;
      if (this.isVoiceMailExpanded)
        this.isVoiceMailExpanded = false;
      this.isCallControlExpanded = false;
    }
  }

  outgoingCallExpanded() {
    if (this.isOutgoingCallExpanded)
      this.isOutgoingCallExpanded = false;
    else {
      this.isOutgoingCallExpanded = true;
      if (this.isVoiceMailExpanded)
        this.isVoiceMailExpanded = false;
      if (this.isIncomingCallExpanded || this.callControlExpanded)
        this.isIncomingCallExpanded = false;
      this.isCallControlExpanded = false;
    }
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
    if (this.isVoiceMailExpanded)
      this.isVoiceMailExpanded = false;
  }

  voicemailExpanded() {
    if (this.isVoiceMailExpanded)
      this.isVoiceMailExpanded = false;
    else
      this.isVoiceMailExpanded = true;
    if (this.isIncomingCallExpanded)
      this.isIncomingCallExpanded = false;
    if (this.isOutgoingCallExpanded)
      this.isOutgoingCallExpanded = false;
    if (this.isCallControlExpanded)
      this.isCallControlExpanded = false;
  }


}
