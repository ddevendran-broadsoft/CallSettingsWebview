/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';
import { BroadWorksMobilityService } from 'app/CallControl/BroadWorksMobility/broadWorksMobility.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { BroadworksMobilityComponent } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';
import { CallControlService } from 'app/CallControl/callControlService.service';
import { CallCenterComponent } from 'app/CallControl/CallCenterQueues/callcenter.component';
import { CallCenterService } from 'app/CallControl/CallCenterQueues/callcenterService.service';
import { BroadworksAnywhereService } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereService.service';

@Component({
  selector: 'app-call-control',
  templateUrl: 'callControl.component.html',
  providers: [BroadWorksMobilityService]
})


export class CallControlComponent implements OnInit {

  static isAnyLocationEnabled: boolean;
  static isBWAnywhereActive: boolean;
  static isBWAnywhereFetched = false;
  // private isQueueChecked: boolean;
  // private isCCIdAvailable: any;
  // private acdUpdate: any;
  BWAnywhereFetchErr: any;
  broadWorksAnywhereRetrievingErr: string;
  isBWAnywhereVisible: boolean;
  isBWAnywhereExpanded = false;
  bwMobilityRetrievingError = '';
  customizedTextJson = window['customizedTexts'];
  isBroadWorksMobilityActive = false;
  isBWMobilityfetched = false;
  status: string[];
  broadWorksMobilityVisible = false;
  isCallCenterQueueVisible = false;
  isBWMobilityExpanded: boolean;
  isCallcenterExpanded: boolean;


  constructor(private xsiServices: XSIServices, private broadWorksMobilityService: BroadWorksMobilityService,
              private serviceRouteProvider: ServiceRouteProvider, private callControlService: CallControlService,
              private callCenterService: CallCenterService, private broadWorksAnywhereService: BroadworksAnywhereService) {

    this.status = ['Available', 'Wrapping up', 'Unavailable', 'Signed out 1 Hour'];
  }

  ngOnInit() {

    BroadworksMobilityComponent.isBWMobFetchingFirstTime = true;
    CallCenterComponent.isCallcenterFetchedFirstTime = true ;

    this.initializeBWMobility();
    this.initializeCallCenterQueue();
    this.initializeProfileData();
    this.initializeBroadWorksAnywhere();
  }

  initializeBWMobility() {

    if (this.serviceRouteProvider.fetchBroadWorksMobilityUrl()) {
      this.broadWorksMobilityVisible = this.xsiServices.fetchBWMobilityVisible();
    }
    if (this.broadWorksMobilityVisible) {
      this.isBWMobilityfetched = false;
      this.bwMobilityRetrievingError = '';
      this.broadWorksMobilityService.getBWMobilityStatus(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(),
      this.postBroadWorksMobilityGet.bind(this));
    }
  }


  initializeCallCenterQueue() {

    if ((this.serviceRouteProvider.fetchCallCenterUrl())) {
      this.isCallCenterQueueVisible = this.xsiServices.fetchCallcenterQueueVisible();
    }
    if (this.isCallCenterQueueVisible) {
      CallCenterComponent.isCallCenterUpdated = false;
      CallCenterComponent.callcenterServiceRetrievingError = '';
      this.callCenterService.getCallCenterService(this.serviceRouteProvider.fetchCallCenterUrl(), this.postCallCenterDataGet.bind(this));
    }

  }


  initializeProfileData() {
    this.callControlService.getProfileData(this.serviceRouteProvider.fetchProfileUrl(), this.postProfileDataGet.bind(this));
    CallCenterComponent.callcenterServiceRetrievingError = '';
  }

  initializeBroadWorksAnywhere() {

    if ((this.serviceRouteProvider.fetchBroadWorksAnywhereUrl())) {
      this.isBWAnywhereVisible = this.xsiServices.fetchBroadWorksAnywhereVisible();
    }
    if (this.isBWAnywhereVisible) {

      CallControlComponent.isBWAnywhereFetched = false;
      this.broadWorksAnywhereRetrievingErr = '';
      this.broadWorksAnywhereService.getBroadWorksAnywhereService(this.serviceRouteProvider.fetchBroadWorksAnywhereUrl(),
      this.postBWAnywhereGet.bind(this));
    }

  }

  getIsBWAnywhereFetched() {
    return CallControlComponent.isBWAnywhereFetched;
  }

  postBWAnywhereGet(error) {

    if (error) {
      if (error.status === 0) {
        this.BWAnywhereFetchErr = this.customizedTextJson.error.networkerror;
      } else {
        this.BWAnywhereFetchErr = this.customizedTextJson.error.unabletofetch;
      }
    }

    CallControlComponent.isBWAnywhereFetched = true;
    this.checkBWAnywhereStatus();
  }

  checkBWAnywhereStatus() {

    if (this.broadWorksAnywhereService.fetchBWAnywhereLocations()) {
      CallControlComponent.isBWAnywhereActive = true;
      let existingLocations = this.broadWorksAnywhereService.fetchBWAnywhereLocations();
      let count = 0;
      if (existingLocations.constructor === Array) {
        existingLocations.forEach(element => {
          if (element.active.$ === 'true') {
            count++;
          }
        });
      } else if (existingLocations.constructor === Object) {
        if (existingLocations.active.$ === 'true') {
          count++;
        }
      }
      if (count > 0) {
        CallControlComponent.isAnyLocationEnabled = true;
      } else {
        CallControlComponent.isAnyLocationEnabled = false;
      }
    } else {
      CallControlComponent.isBWAnywhereActive = false;
    }

  }

  getIsBWAnywhereActive() {
    return CallControlComponent.isBWAnywhereActive;
  }

  getIsAnyLocationEnabled() {
    return CallControlComponent.isAnyLocationEnabled;
  }

  postBroadWorksMobilityGet(bwMobilityParsedJson) {

    this.isBWMobilityfetched = true;
    if (bwMobilityParsedJson) {
      this.isBroadWorksMobilityActive = this.broadWorksMobilityService.fetchBWMobilityStatus();

    } else {
      this.isBroadWorksMobilityActive = !(this.broadWorksMobilityService.fetchBWMobilityStatus());
      this.bwMobilityRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
    console.log('isBroadWorksMobilityActive: ', this.isBroadWorksMobilityActive)
  }



  postCallCenterDataGet(error) {

    CallCenterComponent.isCallCenterUpdated = true;
    if (error) {
      if (error.status === 0) {
        CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.networkerror;
      } else {
        CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
      }
    } else {
      CallCenterComponent.acdStateSelected = this.callCenterService.fetchCCAcdState();
    }
  }


  postProfileDataGet(profileParsedJSON) {
    if (profileParsedJSON) {
      console.log('Fetched profile ');
    } else {
      CallCenterComponent.callcenterServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
      console.log('Fetched profile FAIL');
    }
  }

  focusBroadWorksMobility() {
    if (this.isBWMobilityExpanded) {
      this.isBWMobilityExpanded = false;
    } else {
      this.isBWMobilityExpanded = true;
    }
  }

  focusCallCenter() {
    if (!CallCenterComponent.callcenterServiceRetrievingError) {
      if (this.isCallcenterExpanded) {
        this.isCallcenterExpanded = false;
      } else {
        this.isCallcenterExpanded = true;
      }
    }
  }

  focusBroadWorksAnywhere() {

    if (this.isBWAnywhereExpanded) {
      this.isBWAnywhereExpanded = false;
    } else {
      this.isBWAnywhereExpanded = true;
    }

  }

  getCCupdate() {

    return CallCenterComponent.isCallCenterUpdated;
  }

  getCCRetrievingError() {

    return CallCenterComponent.callcenterServiceRetrievingError;

  }

}
