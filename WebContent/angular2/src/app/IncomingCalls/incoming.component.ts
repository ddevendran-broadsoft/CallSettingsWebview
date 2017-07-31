/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';

import { DoNotDisturbService } from 'app/IncomingCalls/doNotDisturb.service';
import { CallWaitingService } from 'app/IncomingCalls/callWaiting.service';
import { RemoteOfficeService } from 'app/IncomingCalls/RemoteOffice/remoteOffice.service';
import { AnonymousCallRejectionService } from 'app/IncomingCalls/anonymousCallRejectionService.service';
import { AppComponent } from 'app/AppCommon/app.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { CallForwardingService } from 'app/IncomingCalls/CallForwarding/callForwardingService.service';
import { SimultaneousRingService } from 'app/IncomingCalls/SimultaneousRing/simultaneousRing.service';
import { CallForwardingServiceInput } from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { Util } from 'app/AppCommon/util';

@Component({
  selector: 'incoming',
  templateUrl: 'incoming.component.html',
  providers: [AppComponent, AnonymousCallRejectionService, DoNotDisturbService, CallWaitingService, RemoteOfficeService, SimultaneousRingService]
})

export class incomingComponent {

  customizedTextJson = window['customizedTexts'];

  isDndChecked: boolean = false;
  dndRetrievingError: string = "";
  dndUpdateError: string = "";
  callWaitingUpdateError: string = "";

  acrUpdateError: string = "";
  isAnonymousCallRejectionChecked: boolean = false;

  private isCfRetrievingFailed: string = "";
  isSimultaneousRingExpanded: boolean = false;
  private simulRingRetrievingError: string = "";
  private simRingUpdateError: String = "";

  isRemoteOfficeChecked: boolean = false;
  private isROUpdateInprogress: boolean = false;
  private isCallWaitingUpdateInprogress: boolean = false
  private roUpdateError: string = "";
  private roRetrievingError: string = "";
  isCallWaitingChecked: boolean = false;
  isPersonalAssistantChecked: boolean = false;
  isSequentialRingChecked: boolean = false;

  isCallForwardingAlwaysChecked: boolean = false;
  private cfAlwaysRetrievingError: string = "";
  isCallForwardingBusyChecked: boolean = false;
  private cfBusyRetrievingError: string = "";
  isCallForwardingNoAnswerChecked: boolean = false;
  private cfNoanswerRetrievingError: string = "";
  isCallForwardingNotReachableChecked: boolean = false;
  private cfNotReachableRetrievingError: string = "";

  remoteOfficeNumber: number;

  baseUrl: string = window['callSettingsHeroInput'].xsp + "/com.broadsoft.xsi-actions/v2.0/user/" + window['callSettingsHeroInput'].userId + "/services/";

  doNotDisturbUrl: string;
  anonymousCallRejectionUrl: string;
  remoteOfficeUrl: string;
  callWaitingUrl: string;
  callForwardingAlwaysUrl: string;
  callForwardingBusyUrl: string;
  callForwardingNoAnswerUrl: string;
  blockCallerIdUrl: string;
  callForwardingNotReachableUrl: string;
  simultaneousringUrl: string; personalAssistantUrl: string;

  isCallForwardingActive: boolean = false;
  isCallForwardingExpanded: boolean = false;

  private masterServicesList: {};

  isAcrServiceFetched = false;
  isAcrServiceRetrievingError: string = "";

  isdndServiceFetched = false;
  isdndUpdateInProgress = false;
  isRoServiceFetched = false;
  isACRUpdateInProgress = false;

  iscwServiceFetched = false;
  iscwServiceRetrievingError: string = "";


  isSimRingServiceFetched = false;
  isCFAFetched: boolean = false;
  isCFBFetched: boolean = false;
  isCFNAFetched: boolean = false;
  isCFNRFetched: boolean = false;
  isAllCFServicesFetched: boolean = false;

  dndVisible: boolean = false;
  acrVisible: boolean = false;
  roVisible: boolean = false;
  cwVisible: boolean = false;
  cfVisible: boolean = false;
  cfaVisible: boolean = false;
  cfbVisible: boolean = false;
  cfnaVisible: boolean = false;
  cfnrVisible: boolean = false;
  simultaneousRing: boolean = false;
  simultaneousRingVisible: boolean = false;
  isCallWaitingInProgress = false;
  roUpdateErrMsg: string;

  constructor(private callForwardingServiceInput: CallForwardingServiceInput, private callForwardingService: CallForwardingService, private xsiServices: XSIServices, private serviceRouteProvider: ServiceRouteProvider, private appComponent: AppComponent, private anonymousCallRejectionService: AnonymousCallRejectionService,
    private doNotDisturbService: DoNotDisturbService, private util: Util,
    private callWaitingService: CallWaitingService, private remoteOfficeService: RemoteOfficeService, private simultaneousRingService: SimultaneousRingService) {

  }

  /*Fetch active status of all the services under Incoming Calls from the server*/
  ngOnInit() {

    this.initializeDoNotDisturbService();

    this.initializeAnonymousCallRejectionService();

    this.initializeRemoteOfficeService();

    this.initializeCallWaitingService();

    this.initializeCallForwardingService();

    this.initializeSimultaneousRingService();

  }

  getCFStatus() {
    return this.callForwardingServiceInput.getIsCFActive();
  }


  initializeDoNotDisturbService() {

    if ((this.serviceRouteProvider.fetchDoNotDisturbUrl())) {
      this.dndVisible = this.xsiServices.fetchDndVisible();
    }
    if (this.dndVisible) {
      this.dndRetrievingError = "";
      this.dndUpdateError = "";
      this.doNotDisturbService.getDoNotDisturbService(this.serviceRouteProvider.fetchDoNotDisturbUrl(), this.postDndGet.bind(this));
    }

  }

  initializeCallForwardingService() {

    this.isAllCFServicesFetched = false;
    this.initializeCallForwardingAlwaysService();
    this.initializeCallForwardingBusyService();
    this.initializeCallForwardingNoAnswerService();
    this.initializeCallForwardingNotReachableService();
  }

  initializeCallForwardingAlwaysService() {
    this.clearCFAServiceData();

    this.isCFAFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingAlwaysUrl()) {
      this.cfaVisible = this.xsiServices.fetchCfaVisible();
    }

    if (this.cfaVisible) {
      this.cfVisible = true;
      this.cfAlwaysRetrievingError = "";
      this.updateCFRetrievingError();
      this.clearCFAServiceData();
      this.callForwardingService.getCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(), this.postCFAGet.bind(this));

    }

  }
  private clearCFAServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingAlwaysChecked(false);
    this.callForwardingServiceInput.setCallForwardingAlwaysNumber("");
    this.callForwardingServiceInput.setIsCFActive(false);
    this.callForwardingServiceInput.setCfaRingSplashChecked(false);
  }

  initializeCallForwardingBusyService() {
    this.clearCFBServiceData();
    this.isCFBFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingBusyUrl()) {
      this.cfbVisible = this.xsiServices.fetchCfbVisible();
    }

    if (this.cfbVisible) {
      this.cfVisible = true;
      this.cfBusyRetrievingError = "";
      this.updateCFRetrievingError();
      this.clearCFBServiceData();
      this.callForwardingService.getCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(), this.postCFBGet.bind(this));

    }
  }
  private clearCFBServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingBusyChecked(false);
    this.callForwardingServiceInput.setCallForwardingBusyNumber("");
    this.callForwardingServiceInput.setIsCFActive(false);
  }

  initializeCallForwardingNoAnswerService() {

    this.isCFNAFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl()) {
      this.cfnaVisible = this.xsiServices.fetchCfnaVisible();
    }

    if (this.cfnaVisible) {
      this.cfVisible = true;
      this.cfNoanswerRetrievingError = "";
      this.updateCFRetrievingError();
      this.clearCFNAServiceData();
      this.callForwardingService.getCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(), this.postCFNAGet.bind(this));
    }
  }
  private clearCFNAServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingNoAnswerChecked(false);
    this.callForwardingServiceInput.setCallForwardingNoAnswerRings("");
    this.callForwardingServiceInput.setCallForwardingNoAnswerNumber("");
    this.callForwardingServiceInput.setIsCFActive(false);
  }

  initializeCallForwardingNotReachableService() {

    this.isCFNRFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNotReachableUrl()) {
      this.cfnrVisible = this.xsiServices.fetchCfnrVisible();
    }

    if (this.cfnrVisible) {
      this.cfVisible = true;
      this.cfNotReachableRetrievingError = "";
      this.updateCFRetrievingError();
      this.clearCFNRServiceData();
      this.callForwardingService.getCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(), this.postCFNRGet.bind(this));
    }
  }
  private clearCFNRServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingNotReachableChecked(false);
    this.callForwardingServiceInput.setCallForwardingNotReachableNumber("");
    this.callForwardingServiceInput.setIsCFActive(false);
  }


  /*Callback method to be invoked after the server's response had come for Call Forwarding Always HTTP GET request*/
  postCFAGet(cfaParsedJson) {

    this.isCFAFetched = true;
    if (!cfaParsedJson) {
      this.cfAlwaysRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    } else {
      this.isCallForwardingAlwaysChecked = this.callForwardingService.fetchIsCFAChecked();

    }
    this.checkAllCFServicesFetched();
  }

  /*Callback method to be invoked after the server's response had come for Call Forwarding Busy HTTP GET request*/
  postCFBGet(cfbParsedJson) {

    this.isCFBFetched = true;

    if (!cfbParsedJson) {
      this.cfBusyRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    } else {
      this.isCallForwardingBusyChecked = (cfbParsedJson["CallForwardingBusy"]["active"]["$"] == "true");

    }
    this.checkAllCFServicesFetched();
  }

  /*Callback method to be invoked after the server's response had come for Call Forwarding Not Answer HTTP GET request*/
  postCFNAGet(cfnaParsedJson) {

    this.isCFNAFetched = true;

    if (cfnaParsedJson) {
      this.isCallForwardingNoAnswerChecked = (this.callForwardingService.fetchIsCFNAChecked());

    } else {
      this.cfNoanswerRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    }
    this.checkAllCFServicesFetched();
  }

  /*Callback method to be invoked after the server's response had come for Call Forwarding Not Reachable HTTP GET request*/
  postCFNRGet(cfnrParsedJson) {

    this.isCFNRFetched = true;

    if (cfnrParsedJson) {
      this.isCallForwardingNotReachableChecked = this.callForwardingService.fetchIsCFNRChecked();
    } else {
      this.cfNotReachableRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    }

    this.checkAllCFServicesFetched();

  }

  /*This method checks if any field under Call Forwarding was failed to get active data from the server*/
  private updateCFRetrievingError() {
    this.isCfRetrievingFailed = this.cfAlwaysRetrievingError && this.cfBusyRetrievingError && this.cfNoanswerRetrievingError && this.cfNotReachableRetrievingError;
  }

  private checkAllCFServicesFetched() {
    if (!this.cfaVisible) {
      this.isCFAFetched = true;
    }
    if (!this.cfbVisible) {
      this.isCFBFetched = true;
    }
    if (!this.cfnaVisible) {
      this.isCFNAFetched = true;
    }
    if (!this.cfnrVisible) {
      this.isCFNRFetched = true;
    }
    this.isAllCFServicesFetched = this.isCFAFetched && this.isCFBFetched && this.isCFNAFetched && this.isCFNRFetched;

  }


  callForwardingActive() {

    if (this.isCallForwardingExpanded) {
      this.isCallForwardingExpanded = false;
    }

    else {
      this.isCallForwardingExpanded = true;
    }

  }

  initializeRemoteOfficeService() {
    if (this.serviceRouteProvider.fetchRemoteOfficeUrl()) {
      this.roVisible = this.xsiServices.fetchRoVisible();
    }

    if (this.roVisible) {
      this.roRetrievingError = "";
      this.remoteOfficeService.getRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), this.postROGet.bind(this));
    }

  }

  initializeCallWaitingService() {

    if (this.serviceRouteProvider.fetchCallWaitingUrl()) {
      this.cwVisible = this.xsiServices.fetchCwVisible();
    }

    if (this.cwVisible) {
      this.iscwServiceRetrievingError = "";
      this.callWaitingUpdateError = "";
      this.callWaitingService.getCallWaitingService(this.serviceRouteProvider.fetchCallWaitingUrl(), this.postCWSGet.bind(this));
    }
  }

  initializeAnonymousCallRejectionService() {

    if (this.serviceRouteProvider.fetchAnonymousCallRejectionUrl()) {
      this.acrVisible = this.xsiServices.fetchAcrVisible();
    }

    if (this.acrVisible) {
      this.isAcrServiceRetrievingError = "";
      this.acrUpdateError = "";
      this.anonymousCallRejectionService.getAnonymousCallRejectionService(this.serviceRouteProvider.fetchAnonymousCallRejectionUrl(), this.postACRGet.bind(this));
    }
  }

  initializeSimultaneousRingService() {
    if (this.serviceRouteProvider.fetchSimultaneousRingUrl()) {
      this.simultaneousRingVisible = this.xsiServices.fetchSimultaneousRingVisible();
    }
    if (this.simultaneousRingVisible) {
      this.simulRingRetrievingError = "";
      this.simRingUpdateError = "";
      this.simultaneousRingService.getSimultaneousRingService(this.serviceRouteProvider.fetchSimultaneousRingUrl(), this.postSimultaneousRingGet.bind(this));
    }
  }

  /*Callback method to be invoked after the server's response had come for Do Not Disturb HTTP GET request*/
  postDndGet(dndParsedJson) {

    this.isdndServiceFetched = true;
    if (dndParsedJson) {
      this.isDndChecked = (dndParsedJson["DoNotDisturb"]["active"]["$"] == "true");
    } else {
      this.dndRetrievingError = this.customizedTextJson.error.unabletofetch;
    }

  }

  /*Callback method to be invoked after the server's response had come for Do Not Disturb service HTTP PUT request*/
  postDndPut(res) {
    this.isdndUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isDndChecked = !this.isDndChecked;
      if (res) {
        if (res.status == 0) {
          this.dndUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.dndUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  /*Callback method to be invoked after the server's response had come for Anonymous Call Rejection service HTTP GET request*/
  postACRGet(acrParsedJson) {

    this.isAcrServiceFetched = true;
    if (!acrParsedJson) {
      this.isAcrServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isAnonymousCallRejectionChecked = (acrParsedJson["AnonymousCallRejection"]["active"]["$"] == "true");
    }

  }

  /*Callback method to be invoked after the server's response had come for Anonymous Call Rejection service HTTP PUT request*/
  postACRPut(res) {

    this.isACRUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isAnonymousCallRejectionChecked = !this.isAnonymousCallRejectionChecked;
      if (res) {
        if (res.status == 0) {
          this.acrUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.acrUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  /*Callback method to be invoked after the server's response had come for Call Waiting service HTTP GET request*/
  postCWSGet(cwsParsedJson) {

    this.iscwServiceFetched = true;
    if (!cwsParsedJson) {
      this.iscwServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isCallWaitingChecked = (cwsParsedJson["CallWaiting"]["active"]["$"] == "true");
    }
  }

  /*Callback method to be invoked after the server's response had come for Call Waiting service HTTP PUT request*/
  postCWSPut(res) {

    this.isCallWaitingInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isCallWaitingChecked = !this.isCallWaitingChecked;
      if (res) {
        if (res.status === 0) {
          this.callWaitingUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.callWaitingUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }

  }

  postROGet(roParsedJson) {

    this.isRoServiceFetched = true;
    if (!roParsedJson) {
      this.roRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isRemoteOfficeChecked = (roParsedJson["RemoteOffice"]["active"]["$"] == "true");
    }
  }
  
  postSimultaneousRingGet(simultaneousRingParsedJson) {
    if (simultaneousRingParsedJson) {
    } else {
      this.simulRingRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  postROPutCB(error) {

    this.isROUpdateInprogress = false;
    if (error) {
      if (error.status == 0) {
        this.roUpdateError = this.customizedTextJson.error.networkerror;
      } else {
        this.roUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    this.isRemoteOfficeChecked = this.remoteOfficeService.fetchIsRemoteOfficeChecked();
    this.remoteOfficeService.fetchRemoteOfficeNumber();

  }

  onRONumberChange(flag) {
    this.isRemoteOfficeChecked = flag;
  }

  dndActive() {

    if (this.isDndChecked) {
      this.isDndChecked = false;
    }
    else {
      this.isDndChecked = true;
    }
    this.dndUpdateError = "";
    this.isdndUpdateInProgress = true;
    this.doNotDisturbService.putDoNotDisturbService(this.serviceRouteProvider.fetchDoNotDisturbUrl(), this.isDndChecked, this.postDndPut.bind(this));
  }

  callWaitingActive() {

    if (this.isCallWaitingChecked) {
      this.isCallWaitingChecked = false;
    }

    else {
      this.isCallWaitingChecked = true;
    }
    this.callWaitingUpdateError = "";
    this.isCallWaitingInProgress = true;
    this.callWaitingService.putCallWaitingService(this.serviceRouteProvider.fetchCallWaitingUrl(), this.isCallWaitingChecked, this.postCWSPut.bind(this));
  }

  simultaneousRingActive() {

    if (this.isSimultaneousRingExpanded)
      this.isSimultaneousRingExpanded = false;
    else
      this.isSimultaneousRingExpanded = true;
  }

  remoteOfficeActive() {

    this.roUpdateErrMsg = "";
    this.roUpdateError = "";
    if (this.remoteOfficeService.fetchRemoteOfficeNumber()) {
      this.isROUpdateInprogress = true;
      this.remoteOfficeService.putRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), this.isRemoteOfficeChecked, this.remoteOfficeService.fetchRemoteOfficeNumber(), this.postROPutCB.bind(this));
    }
  }

  anonymousCallRejectionActive() {

    if (this.isAnonymousCallRejectionChecked) {
      this.isAnonymousCallRejectionChecked = false;
    }
    else {
      this.isAnonymousCallRejectionChecked = true;
    }
    this.acrUpdateError = "";
    this.isACRUpdateInProgress = true;

    this.anonymousCallRejectionService.putAnonymousCallRejectionService(this.serviceRouteProvider.fetchAnonymousCallRejectionUrl(), this.isAnonymousCallRejectionChecked, this.postACRPut.bind(this));
  }

  giveIsSimultaneousRingActive() {
    return (this.simultaneousRingService.fetchIsSimultaneousRingActive());
  }
}
