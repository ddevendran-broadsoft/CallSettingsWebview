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
import { SequentialRingService } from 'app/IncomingCalls/SequentialRing/sequentialRing.service';
import { OutOfOfficeService } from 'app/IncomingCalls/OutOfOffice/outOfOfficeService.service';
import { CallForwardingServiceInput } from 'app/IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { Util } from 'app/AppCommon/util';

@Component({
  selector: 'app-incoming',
  templateUrl: 'incoming.component.html',
  providers: [
    AppComponent, AnonymousCallRejectionService, DoNotDisturbService, CallWaitingService, RemoteOfficeService,
    SimultaneousRingService, OutOfOfficeService, SequentialRingService
  ]
})

export class IncomingComponent implements OnInit {

  static simRingExpandGet: boolean;
  static seqRingExpandGet: boolean;
  static isCFFetchingFirstTime: boolean;
  static isPAFetchingFirstTime: boolean;

  private isSimRingServiceFetched = false;
  private isCFAFetched = false;
  private isCFBFetched = false;
  private isCFNAFetched = false;
  private isCFNRFetched = false;
  private isAllCFServicesFetched = false;
  private isPAFetched: boolean;
  private isPAActive: boolean;
  private paRetrievingError: string;
  private callForwardingExpandGet = false;
  private isCallForwardingAlwaysChecked = false;
  private isCallForwardingBusyChecked = false;
  private isCallForwardingNoAnswerChecked = false;
  private isCallForwardingNotReachableChecked = false;
  private remoteOfficeNumber: number;
  private baseUrl: string = window['callSettingsHeroInput'].xsp + '/com.broadsoft.xsi-actions/v2.0/user/'
                              + window['callSettingsHeroInput'].userId + '/services/';
  private doNotDisturbUrl: string;
  private anonymousCallRejectionUrl: string;
  private remoteOfficeUrl: string;
  private callWaitingUrl: string;
  private callForwardingAlwaysUrl: string;
  private callForwardingBusyUrl: string;
  private callForwardingNoAnswerUrl: string;
  private blockCallerIdUrl: string;
  private callForwardingNotReachableUrl: string;
  private personalAssistantUrl: string;

  paVisible: boolean;
  pAFetchErrMsg: any;
  customizedTextJson = window['customizedTexts'];
  isDndChecked = false;
  dndRetrievingError = '';
  dndUpdateError = '';
  callWaitingUpdateError = '';
  acrUpdateError = '';
  isAnonymousCallRejectionChecked = false;
  isCfRetrievingFailed = '';
  isSimultaneousRingExpanded = false;
  isSequentialRingExpanded = false;
  simulRingRetrievingError = '';
  seqRingRetrievingError = '';
  simRingUpdateError: String = '';
  seqRingUpdateError: String = '';
  isRemoteOfficeChecked = false;
  isROUpdateInprogress = false;
  isCallWaitingUpdateInprogress = false
  roUpdateError = '';
  roRetrievingError = '';
  isCallWaitingChecked = false;
  cfAlwaysRetrievingError = '';
  cfBusyRetrievingError = '';
  cfNoanswerRetrievingError = '';
  cfNotReachableRetrievingError = '';
  isCallForwardingActive = false;
  isCallForwardingExpanded = false;
  isAcrServiceFetched = false;
  isAcrServiceRetrievingError = '';
  isdndServiceFetched = false;
  isdndUpdateInProgress = false;
  isRoServiceFetched = false;
  isACRUpdateInProgress = false;
  iscwServiceFetched = false;
  iscwServiceRetrievingError = '';
  dndVisible = false;
  acrVisible = false;
  roVisible = false;
  cwVisible = false;
  cfVisible = false;
  cfaVisible = false;
  cfbVisible = false;
  cfnaVisible = false;
  cfnrVisible = false;
  simultaneousRingVisible = false;
  sequentialRingVisible = false;
  outOfOfficeVisible = false;
  isOutOfOfficeExpanded = false;
  isOutOfOfficeRetrievingFailed = false;
  isCallWaitingInProgress = false;
  roUpdateErrMsg: string;


  constructor(private outOfOfficeService: OutOfOfficeService, private callForwardingServiceInput: CallForwardingServiceInput,
              private callForwardingService: CallForwardingService, private xsiServices: XSIServices,
              private serviceRouteProvider: ServiceRouteProvider, private appComponent: AppComponent,
              private anonymousCallRejectionService: AnonymousCallRejectionService,
              private doNotDisturbService: DoNotDisturbService, private util: Util,
              private callWaitingService: CallWaitingService, private remoteOfficeService: RemoteOfficeService,
              private simultaneousRingService: SimultaneousRingService, private sequentialRingService: SequentialRingService) {

  }

  ngOnInit() {

    IncomingComponent.isCFFetchingFirstTime = true;
    IncomingComponent.isPAFetchingFirstTime = true;
    IncomingComponent.simRingExpandGet = true;
    IncomingComponent.seqRingExpandGet = true;

    this.initializeDoNotDisturbService();

    this.initializeOutOfOffice();

    this.initializeAnonymousCallRejectionService();

    this.initializeRemoteOfficeService();

    this.initializeCallWaitingService();

    this.initializeCallForwardingService();

    this.initializeSimultaneousRingService();

    this.initializeSequentialringService();

  }

  getCFStatus() {
    return this.callForwardingServiceInput.getIsCFActive();
  }

  getPAStatus() {
    return this.outOfOfficeService.fetchIsPAActive();
  }


  initializeDoNotDisturbService() {

    if ((this.serviceRouteProvider.fetchDoNotDisturbUrl())) {
      this.dndVisible = this.xsiServices.fetchDndVisible();
    }
    if (this.dndVisible) {
      this.dndRetrievingError = '';
      this.dndUpdateError = '';
      this.doNotDisturbService.getDoNotDisturbService(this.serviceRouteProvider.fetchDoNotDisturbUrl(), this.postDndGet.bind(this));
    }

  }

  initializeOutOfOffice() {


    if (this.serviceRouteProvider.fetchPersonalAssistantUrl()) {
      this.paVisible = this.xsiServices.fetchPAVisible();
    }
    if (this.paVisible) {
      this.isPAFetched = false;
      this.pAFetchErrMsg = '';
      let self = this;
      this.paRetrievingError = '';
      this.outOfOfficeService.getPersonalAssistantData(this.serviceRouteProvider.fetchPersonalAssistantUrl(),
                                  this.postOutOfOfficeGet.bind(self));
    }
  }

  initializeCallForwardingService() {

    this.isAllCFServicesFetched = false;
    // this.cfVisible = this.xsiServices.fetchCfVisible();
    this.initializeCallForwardingAlwaysService();
    this.initializeCallForwardingBusyService();
    this.initializeCallForwardingNoAnswerService();
    this.initializeCallForwardingNotReachableService();
    console.log('isCFFetchingFirstTime is set to ', IncomingComponent.isCFFetchingFirstTime);
  }

  initializeCallForwardingAlwaysService() {

    this.clearCFAServiceData();
    this.isCFAFetched = false;
    if (this.serviceRouteProvider.fetchCallForwardingAlwaysUrl()) {
      this.cfaVisible = this.xsiServices.fetchCfaVisible();
    }

    if (this.cfaVisible) {
      this.cfVisible = true;
      this.cfAlwaysRetrievingError = '';
      this.updateCFRetrievingError();
      this.clearCFAServiceData();
      this.callForwardingService.getCallForwardingAlwaysService(this.serviceRouteProvider.fetchCallForwardingAlwaysUrl(),
                                  this.postCFAGet.bind(this));

    }
  }
  clearCFAServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingAlwaysChecked(false);
    this.callForwardingServiceInput.setCallForwardingAlwaysNumber('');
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
      this.cfBusyRetrievingError = '';
      this.updateCFRetrievingError();
      this.clearCFBServiceData();
      this.callForwardingService.getCallForwardingBusyService(this.serviceRouteProvider.fetchCallForwardingBusyUrl(),
                                    this.postCFBGet.bind(this));

    }
  }
  clearCFBServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingBusyChecked(false);
    this.callForwardingServiceInput.setCallForwardingBusyNumber('');
    this.callForwardingServiceInput.setIsCFActive(false);
  }

  initializeCallForwardingNoAnswerService() {

    this.isCFNAFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl()) {
      this.cfnaVisible = this.xsiServices.fetchCfnaVisible();
    }

    if (this.cfnaVisible) {
      this.cfVisible = true;
      this.cfNoanswerRetrievingError = '';
      this.updateCFRetrievingError();
      this.clearCFNAServiceData();
      this.callForwardingService.getCallForwardingNoAnswerService(this.serviceRouteProvider.fetchCallForwardingNoAnswerUrl(),
                                    this.postCFNAGet.bind(this));
    }
  }
  clearCFNAServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingNoAnswerChecked(false);
    this.callForwardingServiceInput.setCallForwardingNoAnswerRings('');
    this.callForwardingServiceInput.setCallForwardingNoAnswerNumber('');
    this.callForwardingServiceInput.setIsCFActive(false);
  }

  initializeCallForwardingNotReachableService() {

    this.isCFNRFetched = false;

    if (this.serviceRouteProvider.fetchCallForwardingNotReachableUrl()) {
      this.cfnrVisible = this.xsiServices.fetchCfnrVisible();
    }

    if (this.cfnrVisible) {
      this.cfVisible = true;
      this.cfNotReachableRetrievingError = '';
      this.updateCFRetrievingError();
      this.clearCFNRServiceData();
      this.callForwardingService.getCallForwardingNotReachableService(this.serviceRouteProvider.fetchCallForwardingNotReachableUrl(),
                                          this.postCFNRGet.bind(this));
    }
  }
  clearCFNRServiceData() {
    this.callForwardingServiceInput.setIsCallForwardingNotReachableChecked(false);
    this.callForwardingServiceInput.setCallForwardingNotReachableNumber('');
    this.callForwardingServiceInput.setIsCFActive(false);
  }

  postCFAGet(cfaParsedJson) {

    this.isCFAFetched = true;


    if (!cfaParsedJson) {
      console.log('Some Error Occurred while retrieving CFA value');
      this.cfAlwaysRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    } else {
      this.isCallForwardingAlwaysChecked = this.callForwardingService.fetchIsCFAChecked();

    }
    this.checkAllCFServicesFetched();
  }

  postCFBGet(cfbParsedJson) {

    this.isCFBFetched = true;

    if (!cfbParsedJson) {
      console.log('Some Error occurred while retrieving CFB value');
      this.cfBusyRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
      // this.isErrOccurred = true;
    } else {
      // this.isErrOccurred = false;
      this.isCallForwardingBusyChecked = (cfbParsedJson['CallForwardingBusy']['active']['$'] === 'true');

    }
    this.checkAllCFServicesFetched();
  }

  postCFNAGet(cfnaParsedJson) {

    this.isCFNAFetched = true;

    if (cfnaParsedJson) {
      // this.isErrOccurred = false;
      this.isCallForwardingNoAnswerChecked = (this.callForwardingService.fetchIsCFNAChecked());
      console.log('isCallForwardingNoAnswerChecked is set to ', this.isCallForwardingNoAnswerChecked);

    } else {
      this.cfNoanswerRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    }
    this.checkAllCFServicesFetched();
  }

  postCFNRGet(cfnrParsedJson) {

    this.isCFNRFetched = true;

    if (cfnrParsedJson) {
      this.isCallForwardingNotReachableChecked = this.callForwardingService.fetchIsCFNRChecked();
      console.log('isCallForwardingNotReachableChecked: ', this.isCallForwardingNotReachableChecked);
    } else {
      this.cfNotReachableRetrievingError = this.customizedTextJson.error.unabletofetch;
      this.updateCFRetrievingError();
    }

    this.checkAllCFServicesFetched();

  }

  updateCFRetrievingError() {
    this.isCfRetrievingFailed = this.cfAlwaysRetrievingError && this.cfBusyRetrievingError
                                && this.cfNoanswerRetrievingError && this.cfNotReachableRetrievingError;
  }

  checkAllCFServicesFetched() {
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
    } else {
      this.isCallForwardingExpanded = true;
    }

  }

  outOfOfficeActive() {

    if (this.isOutOfOfficeExpanded) {
      this.isOutOfOfficeExpanded = false;
    } else {
      this.isOutOfOfficeExpanded = true;
    }

  }
  initializeRemoteOfficeService() {
    if (this.serviceRouteProvider.fetchRemoteOfficeUrl()) {
      this.roVisible = this.xsiServices.fetchRoVisible();
    }

    if (this.roVisible) {
      this.roRetrievingError = '';
      this.remoteOfficeService.getRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), this.postROGet.bind(this));
    }

  }

  initializeCallWaitingService() {

    if (this.serviceRouteProvider.fetchCallWaitingUrl()) {
      this.cwVisible = this.xsiServices.fetchCwVisible();
    }

    if (this.cwVisible) {
      this.iscwServiceRetrievingError = '';
      this.callWaitingUpdateError = '';
      this.callWaitingService.getCallWaitingService(this.serviceRouteProvider.fetchCallWaitingUrl(), this.postCWSGet.bind(this));
    }
  }

  initializeAnonymousCallRejectionService() {

    if (this.serviceRouteProvider.fetchAnonymousCallRejectionUrl()) {
      this.acrVisible = this.xsiServices.fetchAcrVisible();
    }

    if (this.acrVisible) {
      this.isAcrServiceRetrievingError = '';
      this.acrUpdateError = '';
      this.anonymousCallRejectionService.getAnonymousCallRejectionService(this.serviceRouteProvider.fetchAnonymousCallRejectionUrl(),
                                                  this.postACRGet.bind(this));
    }
  }

  initializeSimultaneousRingService() {
    if (this.serviceRouteProvider.fetchSimultaneousRingUrl()) {
      this.simultaneousRingVisible = this.xsiServices.fetchSimultaneousRingVisible();
    }
    if (this.simultaneousRingVisible) {
      this.simulRingRetrievingError = '';
      this.simRingUpdateError = '';
      this.simultaneousRingService.getSimultaneousRingService(this.serviceRouteProvider.fetchSimultaneousRingUrl(),
                                      this.postSimultaneousRingGet.bind(this));
    }
  }

  initializeSequentialringService() {
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
  postDndGet(dndParsedJson) {

    this.isdndServiceFetched = true;
    if (dndParsedJson) {
      this.isDndChecked = (dndParsedJson['DoNotDisturb']['active']['$'] === 'true');
      console.log('isDndChecked: ', this.isDndChecked);
    } else {
      console.log('Some Error in DND');
      this.dndRetrievingError = this.customizedTextJson.error.unabletofetch;
    }

  }

  postOutOfOfficeGet(error) {

    this.isPAFetched = true;
    if (error) {

      if (error.status === 0) {
        this.pAFetchErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.pAFetchErrMsg = this.customizedTextJson.error.unabletofetch;
      }
    }
    this.isPAActive = this.outOfOfficeService.fetchIsPAActive();
  }

  postDndPut(res) {
    this.isdndUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isDndChecked = !this.isDndChecked;
      if (res) {
        if (res.status === 0) {
          this.dndUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.dndUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  postACRGet(acrParsedJson) {
    this.isAcrServiceFetched = true;
    if (!acrParsedJson) {
      console.log('Some Error in ACR');
      this.isAcrServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isAnonymousCallRejectionChecked = (acrParsedJson['AnonymousCallRejection']['active']['$'] === 'true');
      console.log('isAnonymousCallRejectionChecked: ', this.isAnonymousCallRejectionChecked);
    }

  }

  postACRPut(res) {

    this.isACRUpdateInProgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isAnonymousCallRejectionChecked = !this.isAnonymousCallRejectionChecked;
      if (res) {
        if (res.status === 0) {
          this.acrUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.acrUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }


  postCWSGet(cwsParsedJson) {

    this.iscwServiceFetched = true;
    if (!cwsParsedJson) {
      console.log('Some Error in Call Waiting.');
      this.iscwServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isCallWaitingChecked = (cwsParsedJson['CallWaiting']['active']['$'] === 'true');
      console.log('isCallWaitingChecked: ', this.isCallWaitingChecked);
    }
  }

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
      console.log('Some Error Occurred in RO');
      this.roRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isRemoteOfficeChecked = (roParsedJson['RemoteOffice']['active']['$'] === 'true');
      console.log('isRemoteOfficeChecked: ', this.isRemoteOfficeChecked);
    }
  }
  postSimultaneousRingGet(simultaneousRingParsedJson) {
    if (simultaneousRingParsedJson) {
      // this.isSimultaneousRingExpanded = (simultaneousRingParsedJson['SimultaneousRingPersonal']['active']['$'] == 'true')
      // To expand the card if the service is on.
    } else {
      console.log('Some Error occured in SimultaneousRing!');
      this.simulRingRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  postSequentialRingGet(sequentialRingParsedJson) {
    if (sequentialRingParsedJson) {
      console.log('SequentialRing : ', this.giveIsSequentialRingActive());
    } else {
      console.log('Some Error occured in Sequential Ring!');
      this.seqRingRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  postROPutCB(error) {

    this.isROUpdateInprogress = false;
    if (error) {
      if (error.status === 0) {
        this.roUpdateError = this.customizedTextJson.error.networkerror;
      } else {
        this.roUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    } else {
      console.log('RO successfully set to ', this.remoteOfficeService.fetchIsRemoteOfficeChecked());
    }
    this.isRemoteOfficeChecked = this.remoteOfficeService.fetchIsRemoteOfficeChecked();
    this.remoteOfficeService.fetchRemoteOfficeNumber();

  }

  onRONumberChange(flag) {
    this.isRemoteOfficeChecked = flag;
  }

  dndActive() {

    // this.isdndServiceFetched = false;
    if (this.isDndChecked) {
      console.log('isDndChecked = ', this.isDndChecked);
      this.isDndChecked = false;
    } else {
      console.log('isDndChecked = ', this.isDndChecked);
      this.isDndChecked = true;
    }
    this.dndUpdateError = '';
    this.isdndUpdateInProgress = true;
    this.doNotDisturbService.putDoNotDisturbService(this.serviceRouteProvider.fetchDoNotDisturbUrl(), this.isDndChecked,
                                  this.postDndPut.bind(this));
  }

  callWaitingActive() {

    // this.iscwServiceFetched = false;
    if (this.isCallWaitingChecked) {
      console.log('isCallWaitingChecked is', this.isCallWaitingChecked);
      this.isCallWaitingChecked = false;
    } else {
      console.log('isCallWaitingChecked is', this.isCallWaitingChecked);
      this.isCallWaitingChecked = true;
    }
    this.callWaitingUpdateError = '';
    this.isCallWaitingInProgress = true;
    this.callWaitingService.putCallWaitingService(this.serviceRouteProvider.fetchCallWaitingUrl(), this.isCallWaitingChecked,
                                this.postCWSPut.bind(this));
  }

  simultaneousRingActive() {

    if (this.isSimultaneousRingExpanded) {
      this.isSimultaneousRingExpanded = false;
    } else {
      this.isSimultaneousRingExpanded = true;
    }
  }

  sequentialRingActive() {
    if (this.isSequentialRingExpanded) {
      this.isSequentialRingExpanded = false;
    } else {
      this.isSequentialRingExpanded = true;
    }
  }

  remoteOfficeActive() {

    console.log('In remoteOfficeChecked RO = ', this.isRemoteOfficeChecked)
    this.roUpdateErrMsg = '';
    if (this.isRemoteOfficeChecked) {
      this.isRemoteOfficeChecked = false;
    } else {
      this.isRemoteOfficeChecked = true;
    }

    this.roUpdateError = '';
    if (this.remoteOfficeService.fetchRemoteOfficeNumber()) {
      this.isROUpdateInprogress = true;
      this.remoteOfficeService.putRemoteOfficeService(this.serviceRouteProvider.fetchRemoteOfficeUrl(), this.isRemoteOfficeChecked,
                                                      this.remoteOfficeService.fetchRemoteOfficeNumber(), this.postROPutCB.bind(this));
    }
  }

  anonymousCallRejectionActive() {

    // this.isAcrServiceFetched = false;
    if (this.isAnonymousCallRejectionChecked) {
      console.log('isAnonymousCallRejectionChecked = ', this.isAnonymousCallRejectionChecked);
      this.isAnonymousCallRejectionChecked = false;
    } else {
      console.log('isAnonymousCallRejectionChecked = ', this.isAnonymousCallRejectionChecked);
      this.isAnonymousCallRejectionChecked = true;
    }
    this.acrUpdateError = '';
    this.isACRUpdateInProgress = true;

    this.anonymousCallRejectionService.putAnonymousCallRejectionService(this.serviceRouteProvider.fetchAnonymousCallRejectionUrl(),
                                                                  this.isAnonymousCallRejectionChecked, this.postACRPut.bind(this));
  }

  giveIsSimultaneousRingActive() {
    return (this.simultaneousRingService.fetchIsSimultaneousRingActive());
  }

  giveIsSequentialRingActive() {
    return (this.sequentialRingService.fetchIsSequentialRingActive());
  }
}
