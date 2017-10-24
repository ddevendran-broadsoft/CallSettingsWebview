/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';
import { AutomaticCallbackService } from 'app/OutgoingCalls/automaticCallBackService.service';
import { BlockCallerIdService } from 'app/OutgoingCalls/blockCallerIdService.service';
import { AppComponent } from 'app/AppCommon/app.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';

import { Util } from 'app/AppCommon/util';

@Component({
  selector: 'outgoing',
  templateUrl: 'outgoing.component.html',
  providers: [AppComponent, AutomaticCallbackService, BlockCallerIdService]
})

export class OutgoingComponent implements OnInit {

  private baseUrl: string = window['callSettingsHeroInput'].xsp + '/com.broadsoft.xsi-actions/v2.0/user/'
                           + window['callSettingsHeroInput'].userId + '/services/';
  private automaticCallbackUrl: string;
  private blockCallerIdUrl: string;
  private masterServicesList = [];
  isBcidServiceRetrievingError = '';
  isBcidServiceFetched = false;
  isAcServiceRetrievingError = '';
  isAcServiceFetched = false;
  bcidVisible = false;
  automaticCallbackVisible = false;
  customizedTextJson = window['customizedTexts'];
  isBlockMyCalleridChecked = false;
  isAutomaticCallbackChecked = false;
  isBcidServiceUpdateError: string;
  isAcServiceUpdateError: string;

  constructor(private xsiServices: XSIServices, private serviceRouteProvider: ServiceRouteProvider,
              private appComponent: AppComponent, private blockCallerIdService: BlockCallerIdService,
              private automaticCallbackService: AutomaticCallbackService, private util: Util) { }



  ngOnInit() {

    this.isBcidServiceUpdateError = '';
    this.isAcServiceUpdateError = '';

    if (this.serviceRouteProvider.fetchAutomaticCallbackUrl()) {
      this.automaticCallbackVisible = this.xsiServices.fetchAutomaticCallbackVisible();
    }
    if (this.serviceRouteProvider.fetchBlockCallerIdUrl()) {
        this.bcidVisible = this.xsiServices.fetchBcidVisible();
    }

    /*Fetch active status of all services under outgoing calls from the server*/
    if (this.automaticCallbackVisible) {
      this.isAcServiceRetrievingError = ''
      this.automaticCallbackService.getAutomaticCallbackService(this.serviceRouteProvider.fetchAutomaticCallbackUrl(),
                                                  this.postACBGet.bind(this));
    }

    if (this.bcidVisible) {
      this.isBcidServiceRetrievingError = '';
      this.blockCallerIdService.getBlockCallerIdService(this.serviceRouteProvider.fetchBlockCallerIdUrl(), this.postBCIDGet.bind(this));
    }


  }

  postACBGet(acbParsedJson) {

    this.isAcServiceFetched = true;
    if (acbParsedJson) {
      this.isAutomaticCallbackChecked = (acbParsedJson['AutomaticCallback']['active']['$'] === 'true')
      console.log('isACBChecked: ', this.isAutomaticCallbackChecked)
    } else {
      console.log('Some Error in ACB')
      this.isAcServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  postACBPut(res) {

    this.isAcServiceFetched = true;

    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isAutomaticCallbackChecked = !this.isAutomaticCallbackChecked;

      if (res) {
        if (res.status === 0) {
          this.isAcServiceUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.isAcServiceUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  postBCIDGet(bcidParsedJson) {

    this.isBcidServiceFetched = true;
    if (!bcidParsedJson) {
      this.isBcidServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    } else {
      this.isBlockMyCalleridChecked = (bcidParsedJson['CallingLineIDDeliveryBlocking']['active']['$'] === 'true')
      console.log('isBlockMyCalleridChecked: ', this.isBlockMyCalleridChecked)
    }

  }

  postBCIDPut(res) {

    this.isBcidServiceFetched = true;

    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isBlockMyCalleridChecked = !this.isBlockMyCalleridChecked;
      if (res) {
        if (res.status === 0) {
          this.isBcidServiceUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.isBcidServiceUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }
  
  automaticCallbackActive() {

    this.isAcServiceFetched = false;
    this.isAcServiceUpdateError = '';
    if (this.isAutomaticCallbackChecked) {
      console.log('isAutomaticCallbackChecked = ', this.isAutomaticCallbackChecked);
      this.isAutomaticCallbackChecked = false;
    } else {
      console.log('isAutomaticCallbackChecked = ', this.isAutomaticCallbackChecked);
      this.isAutomaticCallbackChecked = true;
    }

    this.automaticCallbackService.putAutomaticCallbackService(this.serviceRouteProvider.fetchAutomaticCallbackUrl(),
                                        this.isAutomaticCallbackChecked, this.postACBPut.bind(this));

  }

  blockCallerIdActive() {

    this.isBcidServiceFetched = false;
    this.isBcidServiceUpdateError = '';
    if (this.isBlockMyCalleridChecked) {
      console.log('isBlockMyCalleridChecked = ', this.isBlockMyCalleridChecked);
      this.isBlockMyCalleridChecked = false;
    } else {
      console.log('isBlockMyCalleridChecked = ', this.isBlockMyCalleridChecked);
      this.isBlockMyCalleridChecked = true;
    }

    this.blockCallerIdService.putBlockCallerIdService(this.serviceRouteProvider.fetchBlockCallerIdUrl(),
                                              this.isBlockMyCalleridChecked, this.postBCIDPut.bind(this));

  }

}
