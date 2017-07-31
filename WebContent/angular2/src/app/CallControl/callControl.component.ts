/* Copyright © 2017 BroadSoft Inc. */

import { Component } from '@angular/core';
import { BroadWorksMobilityService} from 'app/CallControl/BroadWorksMobility/broadWorksMobilityService.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import {BroadworksMobilityComponent} from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'callControl',
  templateUrl: 'callControl.component.html',
  providers: [BroadWorksMobilityService]
})


export class CallControlComponent {
  bwMobilityRetrievingError: string = "";

  customizedTextJson = window['customizedTexts'];
  isQueueChecked: boolean;
  isBroadWorksMobilityActive: boolean = false;
  isBWMobilityfetched: boolean = false;
  status: string[];
  broadWorksMobilityVisible: boolean = false;
  isBWMobilityExpanded: boolean;

  constructor(private xsiServices: XSIServices, private broadWorksMobilityService: BroadWorksMobilityService, private serviceRouteProvider: ServiceRouteProvider) {

    this.status = ["Available", "Wrapping up", "Unavailable", "Signed out 1 Hour"];
  }

  ngOnInit() {
    BroadworksMobilityComponent.isBWMobFetchingFirstTime = true;
    this.initializeBWMobility();
  }

  initializeBWMobility() {

    if(this.serviceRouteProvider.fetchBroadWorksMobilityUrl()) {
      this.broadWorksMobilityVisible = this.xsiServices.fetchBWMobilityVisible();
    }
    if(this.broadWorksMobilityVisible) {
      this.isBWMobilityfetched = false;
      this.bwMobilityRetrievingError = "";
      this.broadWorksMobilityService.getBWMobilityStatus(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.postBroadWorksMobilityGet.bind(this));
    }
  }

  postBroadWorksMobilityGet(bwMobilityParsedJson) {

    this.isBWMobilityfetched = true;
    if(bwMobilityParsedJson) {
      this.isBroadWorksMobilityActive = this.broadWorksMobilityService.fetchBWMobilityStatus();
      
    } else { 
        this.isBroadWorksMobilityActive = !(this.broadWorksMobilityService.fetchBWMobilityStatus());
        this.bwMobilityRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
    console.log("isBroadWorksMobilityActive: ", this.isBroadWorksMobilityActive)
  }

  focusBroadWorksMobility() {
    if(this.isBWMobilityExpanded) {
      this.isBWMobilityExpanded = false;
    } else {
      this.isBWMobilityExpanded = true;
    }
  }
}