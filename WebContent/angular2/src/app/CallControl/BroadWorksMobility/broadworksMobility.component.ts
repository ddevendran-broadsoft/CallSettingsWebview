/* Copyright © 2017 BroadSoft Inc. */

import { Component } from '@angular/core';
import { BroadWorksMobilityService } from 'app/CallControl/BroadWorksMobility/broadWorksMobility.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { CallControlService } from 'app/CallControl/callControlService.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';
import { DesktopSelectOption } from 'app/common/desktopSelectDropdown.component';
import { Util } from 'app/AppCommon/util';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';

@Component({
  selector: 'broadworksMobility',
  templateUrl: 'broadworksMobility.component.html',
  providers: [BroadWorksMobilityService]
})

export class BroadworksMobilityComponent {
  isBroadWorksMobilityActive: boolean;
  bwMobilityRetrievingError: string;
  isBWMobilityfetched: boolean;
  broadWorksMobilityVisible: any;
  ringMobDevSrvErr: string;
  ringFixedDevSrvErr: string;
  ringFixedDevMISrvErr: any;
  ringMobDevBMSrvErr: string;
  ringMobDevMISrvErr: any;
  selectGenSettingsErrMsg: any;
  broadWorksMobilityParsedJson: any;
  broadworksMobilityMobileIdentitySettingsParsedJson: any;
  customizedTextJson = window['customizedTexts'];
  isPrimaryNumberExpanded: boolean = false;
  isMobileNumberExpanded: boolean = false;
  generalSettings: string[];
  cOptions: string[];
  mobileDeviceNumbers = [];
  primaryNumber;
  mobileNumber;
  mobileNumberRetrievingError: string = "";
  primaryNumberRetrievingError: string = "";
  isMobileDeviceNumbersFetchErrOccurred: boolean = false;
  isDevicesToRingPutErrOccurred: boolean = false;
  allSelectedSettings = [];
  allSelectedMobileDeviceNumbers = [];
  allSelectedGeneralSettingsOptions = [];
  allSelectedSettingsMobileNumber = [];
  allSelectedMobileNumbersUnderMobileIdentity = [];
  isSharedCallAppearanceActive: boolean;
  isBroadWorksAnywhereActive: boolean;
  isExecutiveAssistantActive: boolean;
  isEnableAlertingChecked: boolean;
  isBroadWorksAnywhereActiveInsideMobileNumber: boolean;
  isExecutiveAssistantActiveInsideMobileNumber: boolean;
  isSharedCallAppearanceActiveInsideMobileNumber: boolean;
  isSelectedSettingsBWMobilityPutErrOccurred: boolean = false;
  isSelectedMobileDeviceNumbersPutErrOccurred: boolean = false;
  isSelectedSettingsMobileIdentityPutErrOccurred: boolean = false;
  isPutEnableAlertingErrOccurred: boolean = false;
  isSelectedGeneralSettingsOptionsPutErrOccurred: boolean = false;
  isDevicesToRingUnderMobileIdentityPutErrOccurred: boolean = false;
  enableAlertingErrMsg: string;
  isAlertAgentCallsChecked: boolean;
  isAlertClickToDialCallsChecked: boolean;
  isAlertGroupPagingCallsChecked: boolean;
  isUseMobilityCallingLineIDChecked: boolean;
  isUseDiversionInhibitorChecked: boolean;
  isBroadworksCallControlChecked: boolean;
  isAnswerConfirmationRequiredChecked: boolean;
  isRingFixedDevicesUnderBWMobilityChecked: boolean;
  isRingMobileDevicesUnderBWMobilityChecked: boolean;
  devicesToRing: string;
  isRingMobileDevicesUnderMobileIdentityChecked: boolean;
  isRingFixedDevicesMobileIdentityChecked: boolean;
  devicesToRingUnderMobileIdentity: string;
  private pnrfdSelectedOptionsTextContainerId = "pnrfdSelectedOptionsTextContainer";
  private isPNRFDOptionsFocused = false;
  private pnrfdDesktopMenuShow: boolean = false;
  private pnrfdDOList: DesktopSelectOption[] = new Array();
  private pnrmdSelectedOptionsTextContainerId = "pnrmdSelectedOptionsTextContainer";
  private isPNRMDOptionsFocused = false;
  private pnrmdDesktopMenuShow: boolean = false;
  private pnrmdDOList: DesktopSelectOption[] = new Array();
  private mngsSelectedOptionsTextContinerId = "mngsSelectedOptionsTextContiner";
  private isMNGSDOptionsFocused: boolean = false;
  private mngsDesktopMenuShow: boolean = false;
  private mngsDOList: DesktopSelectOption[] = new Array();
  private mnrfdSelectedOptionsTextContainerId = "mnrfdSelectedOptionsTextContainer";
  private isMNRFDOptionsFocused: boolean = false;
  private mnrfdDesktopMenuShow: boolean = false;
  private mnrfdDOList: DesktopSelectOption[] = new Array();
  private mnrmdSelectedOptionsTextContainerId = "mnrmdSelectedOptionsTextContainer";
  private isMNRMDOptionsFocused: boolean = false;
  private mnrmdDesktopMenuShow: boolean = false;
  private mnrmdDOList: DesktopSelectOption[] = new Array();
  private isDesktop: boolean;
  devicesToRingCheckboxValidation: string;
  devicesToRingCheckboxMIValidation: string;
  previousSelectedPrimaryFixed = [];
  previousSelectedPrimaryMobile = [];
  previousSelectedFixed = [];
  previousSelectedMobile = [];
  isGeneralAllsettingSelected: boolean = false;
  previousSelectedGenSetting = [];
  static isBWMobFetchingFirstTime = true;

  constructor(private util: Util, private callControlServiceInput: CallControlServiceInput, private callControlService: CallControlService,
    private broadWorksMobilityService: BroadWorksMobilityService, private serviceRouteProvider: ServiceRouteProvider,
    private xsiServices: XSIServices) {

    this.populateMNGSDOList();


    this.cOptions = [(this.customizedTextJson.broadworks_mobility.shared_call_appearance),
    (this.customizedTextJson.broadworks_mobility.broadworks_anywhere),
    (this.customizedTextJson.broadworks_mobility.executive_assistant)];

    this.isDesktop = util.isDesktopPlatform();
  }

  /*Populates the drop down option names for Mobile Number General Settings */
  private populateMNGSDOList() {

    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.alert_agent_calls, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.alert_click_to_dial_calls, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.alert_group_paging_calls, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.answer_confirmation, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.call_control_services, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor, false));
    this.mngsDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id, false));
  }



  ngOnInit() {

    /*Fetch data from the initial JSON fetched at the time of first server response for BroadWorks Mobility*/
    if (BroadworksMobilityComponent.isBWMobFetchingFirstTime) {

      this.broadWorksMobilityParsedJson = this.broadWorksMobilityService.fetchBWMobilityParsedJson();

      this.initializeAllMobileDeviceNumbers();

      this.fetchActiveSettingsInsideBroadworksMobility();

      this.fetchActiveMobileDeviceNumbers();

      this.fetchDevicesToRing();

      BroadworksMobilityComponent.isBWMobFetchingFirstTime = false;

    } else {
      this.initializeBWMobility();
    }
    this.initializePrimaryNumber();
    this.initializeMobileIdentity();

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

  postBroadWorksMobilityGet(bwMobilityParsedJson) {

    this.isBWMobilityfetched = true;
    if (bwMobilityParsedJson) {
      this.isBroadWorksMobilityActive = this.broadWorksMobilityService.fetchBWMobilityStatus();
      this.broadWorksMobilityParsedJson = this.broadWorksMobilityService.fetchBWMobilityParsedJson();
      this.initializeAllMobileDeviceNumbers();
      this.fetchActiveSettingsInsideBroadworksMobility();
      this.fetchActiveMobileDeviceNumbers();
      this.fetchDevicesToRing();

    } else {
      this.isBroadWorksMobilityActive = !(this.broadWorksMobilityService.fetchBWMobilityStatus());
      this.bwMobilityRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
    console.log('isBroadWorksMobilityActive: ', this.isBroadWorksMobilityActive);
  }

  initializePrimaryNumber() {

    this.primaryNumberRetrievingError = "";
    this.primaryNumber = this.callControlService.fetchPrimaryNumber();
  }

  initializeAllMobileDeviceNumbers() {

    if (this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.constructor == Array) {
      this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.forEach(element => {
        this.mobileDeviceNumbers.push(element.mobileNumber.$);
        this.pnrmdDOList.push(new DesktopSelectOption(element.mobileNumber.$, false));
        this.mnrmdDOList.push(new DesktopSelectOption(element.mobileNumber.$, false));
      });
    } else if (this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.constructor == Object) {
      this.mobileDeviceNumbers.push(this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.mobileNumber.$);
      this.pnrmdDOList.push(new DesktopSelectOption(this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.mobileNumber.$, false));
      this.mnrmdDOList.push(new DesktopSelectOption(this.broadWorksMobilityParsedJson.BroadWorksMobility.mobileIdentity.mobileNumber.$, false));
    }



    this.broadWorksMobilityService.setAllMobileDeviceNumbers(this.mobileDeviceNumbers);
    this.broadWorksMobilityService.setMNRMDDOList(this.mnrmdDOList);
  }

  initializeMobileIdentity() {
    if (window['callSettingsHeroInput'].deviceMobileNo) {
      this.mobileNumber = window['callSettingsHeroInput'].deviceMobileNo;
      this.mobileNumberRetrievingError = "";
      this.broadWorksMobilityService.getBroadworksMobilityMobileIdentitySettings(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.postBroadworksMobilityMobileIdentitySettingsGet.bind(this))

    } else {
      console.log("Mobile number is not present.");
    }

  }

  private updatePNRFDDOList() {
    this.pnrfdDOList = [];
    this.pnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.shared_call_appearance, this.isSharedCallAppearanceActive));
    this.pnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.broadworks_anywhere, this.isBroadWorksAnywhereActive));
    this.pnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.executive_assistant, this.isExecutiveAssistantActive));

    this.broadWorksMobilityService.setPNRFDDOList(this.pnrfdDOList);
  }

  /*Callback method to be invoked after the server has responded for BroadWorks Mobility service HTTP GET request*/
  postBroadworksMobilityMobileIdentitySettingsGet(broadworksMobilityMobileIdentitySettingsParsedJson) {
    if (broadworksMobilityMobileIdentitySettingsParsedJson) {
      this.broadworksMobilityMobileIdentitySettingsParsedJson = broadworksMobilityMobileIdentitySettingsParsedJson;
      this.isEnableAlertingChecked = (broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.enableAlerting.$ == "true");
      this.fetchActiveSettingsMobileIdentity();
      this.fetchActiveGeneralSettingsInsideMobileIdentity();
      this.fetchActiveMobileDeviceNumbersUnderMobileIdentity();
      this.fetchDevicesToRingUnderMobileIdentity();
    } else {
      console.log("Some Error occurred while fetching broadworksMobilityMobileIdentitySettings");
      this.mobileNumberRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  enableAlertingActive() {

    this.enableAlertingErrMsg = "";
    this.isPutEnableAlertingErrOccurred = false;
    this.enableAlertingErrMsg = "";
    if (!this.isEnableAlertingChecked) {
      this.isEnableAlertingChecked = true;
    } else {
      this.isEnableAlertingChecked = false;
    }
    this.broadWorksMobilityService.putEnableAlerting(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.isEnableAlertingChecked, this.postEnableAlertingPut.bind(this));
  }

  /*Callback method to be invoked after the server has responded for BroadWorks Mobility service HTTP PUT request*/
  postEnableAlertingPut(isEnableAlertingChecked, error) {

    if (error) {

      if (error.status == 0) {
        this.enableAlertingErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.enableAlertingErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }

    } else {
      console.log("Enable Alerting updated successfully");
    }
    this.isEnableAlertingChecked = isEnableAlertingChecked;
    console.log("Enable Alerting set to ", isEnableAlertingChecked);
  }

  fetchActiveSettingsMobileIdentity() {

    if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy) {

      this.isSharedCallAppearanceActiveInsideMobileNumber = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.includeSharedCallAppearance.$ == "true");
      this.broadWorksMobilityService.setIsSharedCallAppearanceActiveInsideMobileNumber(this.isSharedCallAppearanceActiveInsideMobileNumber);
      console.log("isSharedCallAppearanceActiveInsideMobileNumber: ", this.isSharedCallAppearanceActiveInsideMobileNumber);
      if (this.isSharedCallAppearanceActiveInsideMobileNumber) {
        this.allSelectedSettingsMobileNumber.push(this.customizedTextJson.broadworks_mobility.shared_call_appearance);
      }

      this.isBroadWorksAnywhereActiveInsideMobileNumber = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.includeBroadWorksAnywhere.$ == "true");
      this.broadWorksMobilityService.setIsBroadWorksAnywhereActiveInsideMobileNumber(this.isBroadWorksAnywhereActiveInsideMobileNumber);
      console.log("isBroadWorksAnywhereActiveInsideMobileNumber: ", this.isBroadWorksAnywhereActiveInsideMobileNumber);
      if (this.isBroadWorksAnywhereActiveInsideMobileNumber) {
        this.allSelectedSettingsMobileNumber.push(this.customizedTextJson.broadworks_mobility.broadworks_anywhere);
      }

      this.isExecutiveAssistantActiveInsideMobileNumber = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.includeExecutiveAssistant.$ == "true");
      this.broadWorksMobilityService.setIsExecutiveAssistantActiveInsideMobileNumber(this.isExecutiveAssistantActiveInsideMobileNumber);
      console.log("isExecutiveAssistantActiveInsideMobileNumber: ", this.isExecutiveAssistantActiveInsideMobileNumber);
      if (this.isExecutiveAssistantActiveInsideMobileNumber) {
        this.allSelectedSettingsMobileNumber.push(this.customizedTextJson.broadworks_mobility.executive_assistant);
      }
      this.broadWorksMobilityService.setAllSelectedSettingsMobileNumber(this.allSelectedSettingsMobileNumber);

      this.populateMNRFDDOList();
      this.broadWorksMobilityService.setMNRFDDOList(this.mnrfdDOList);
    } else {
      console.log("Cannot fetch Settings");
    }
    if (this.isDesktop) {
      if (this.allSelectedSettingsMobileNumber.length === 0) {
        this.selectedSettingsMobileNumber = this.customizedTextJson.none;
      } else {
        this.selectedSettingsMobileNumber = this.allSelectedSettingsMobileNumber.join();
      }
    }

  }

  /*Populates the drop down option names for Mobile Number Ring Fixed Devices*/
  private populateMNRFDDOList() {
    this.mnrfdDOList = [];
    let flag = this.isSharedCallAppearanceActiveInsideMobileNumber || this.isBroadWorksAnywhereActiveInsideMobileNumber || this.isExecutiveAssistantActiveInsideMobileNumber;
    this.mnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.shared_call_appearance, this.isSharedCallAppearanceActiveInsideMobileNumber));
    this.mnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.broadworks_anywhere, this.isBroadWorksAnywhereActiveInsideMobileNumber));
    this.mnrfdDOList.push(new DesktopSelectOption(this.customizedTextJson.broadworks_mobility.executive_assistant, this.isExecutiveAssistantActiveInsideMobileNumber));
  }

  fetchActiveGeneralSettingsInsideMobileIdentity() {

    if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity) {

      this.isAlertAgentCallsChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.alertAgentCalls.$ == "true");
      this.broadWorksMobilityService.setIsAlertAgentCallsChecked(this.isAlertAgentCallsChecked);
      if (this.isAlertAgentCallsChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_agent_calls);
      }

      this.isAlertClickToDialCallsChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.alertClickToDialCalls.$ == "true");
      this.broadWorksMobilityService.setIsAlertClickToDialCallsChecked(this.isAlertClickToDialCallsChecked);
      if (this.isAlertClickToDialCallsChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_click_to_dial_calls);
      }

      this.isAlertGroupPagingCallsChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.alertGroupPagingCalls.$ == "true");
      this.broadWorksMobilityService.setIsAlertGroupPagingCallsChecked(this.isAlertGroupPagingCallsChecked);
      if (this.isAlertGroupPagingCallsChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_group_paging_calls);
      }

      this.isAnswerConfirmationRequiredChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.answerConfirmationRequired.$ == "true");
      this.broadWorksMobilityService.setIsAnswerConfirmationRequiredChecked(this.isAnswerConfirmationRequiredChecked);
      if (this.isAnswerConfirmationRequiredChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.answer_confirmation);
      }

      this.isBroadworksCallControlChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.broadworksCallControl.$ == "true");
      this.broadWorksMobilityService.setIsBroadworksCallControlChecked(this.isBroadworksCallControlChecked);
      if (this.isBroadworksCallControlChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.call_control_services);
      }

      this.isUseDiversionInhibitorChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.useDiversionInhibitor.$ == "true");
      this.broadWorksMobilityService.setIsUseDiversionInhibitorChecked(this.isUseDiversionInhibitorChecked);
      if (this.isUseDiversionInhibitorChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor);
      }

      this.isUseMobilityCallingLineIDChecked = (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.useMobilityCallingLineID.$ == "true");
      this.broadWorksMobilityService.setIsUseMobilityCallingLineIDChecked(this.isUseMobilityCallingLineIDChecked);
      if (this.isUseMobilityCallingLineIDChecked) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id);
      }

    } else {
      console.error("Some Error occurred while fetching the general settings");
    }

    if (this.isDesktop) {
      if (this.allSelectedGeneralSettingsOptions.length === 0) {
        this.geninputValue = this.customizedTextJson.none;

      } else {
        this.geninputValue = this.allSelectedGeneralSettingsOptions.join();
      }
    }
    this.updateMNGSDOList();
  }

  private updateMNGSDOList() {

    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.alert_agent_calls, this.isAlertAgentCallsChecked);
    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.alert_group_paging_calls, this.isAlertGroupPagingCallsChecked);
    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.answer_confirmation, this.isAnswerConfirmationRequiredChecked);
    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.call_control_services, this.isBroadworksCallControlChecked);
    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor, this.isUseDiversionInhibitorChecked);
    this.util.updateDesktopOption(this.mngsDOList, this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id, this.isUseMobilityCallingLineIDChecked);

  }



  fetchActiveSettingsInsideBroadworksMobility() {

    if (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity) {
      this.isSharedCallAppearanceActive = (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.includeSharedCallAppearance.$ == "true");
      this.broadWorksMobilityService.setIsSharedCallAppearanceActive(this.isSharedCallAppearanceActive);
      console.log("isSharedCallAppearanceActive: ", this.isSharedCallAppearanceActive);
      if (this.isSharedCallAppearanceActive) {
        this.allSelectedSettings.push(this.customizedTextJson.broadworks_mobility.shared_call_appearance);
      }

      this.isBroadWorksAnywhereActive = (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.includeBroadWorksAnywhere.$ == "true");
      console.log("isBroadWorksAnywhereActive: ", this.isBroadWorksAnywhereActive);
      this.broadWorksMobilityService.setIsBroadWorksAnywhereActive(this.isBroadWorksAnywhereActive);
      if (this.isBroadWorksAnywhereActive) {
        this.allSelectedSettings.push(this.customizedTextJson.broadworks_mobility.broadworks_anywhere);
      }

      this.isExecutiveAssistantActive = (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.includeExecutiveAssistant.$ == "true");
      console.log("isExecutiveAssistantActive: ", this.isExecutiveAssistantActive);
      this.broadWorksMobilityService.setIsExecutiveAssistantActive(this.isExecutiveAssistantActive);
      if (this.isExecutiveAssistantActive) {
        this.allSelectedSettings.push(this.customizedTextJson.broadworks_mobility.executive_assistant);
      }
      this.broadWorksMobilityService.setAllSelectedSettingsInBWMob(this.allSelectedSettings);
      if (this.isDesktop) {
        if (this.allSelectedSettings.length === 0) {
          this.selectedSettings = this.customizedTextJson.none;
        } else {
          this.selectedSettings = this.allSelectedSettings.join();
        }
      }

      this.updatePNRFDDOList();
      this.broadWorksMobilityService.setPNRFDDOList(this.pnrfdDOList);

    } else {
      console.log("Cannot fetch Settings");
    }
  }

  fetchActiveMobileDeviceNumbers() {

    if (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.mobileNumbersAlertList) {

      if (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.mobileNumbersAlertList.mobileNumber.constructor == Array) {

        this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.mobileNumbersAlertList.mobileNumber.forEach(element => {

          this.allSelectedMobileDeviceNumbers.push(element.$);

        });

      }
      else if (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.mobileNumbersAlertList.mobileNumber.constructor == Object) {
        this.allSelectedMobileDeviceNumbers.push(this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.mobileNumbersAlertList.mobileNumber.$);
      }

      this.broadWorksMobilityService.setAllSelectedMobileDeviceNumbers(this.allSelectedMobileDeviceNumbers);

      this.updatePNRMDDOList();
      this.broadWorksMobilityService.setPNRMDDOList(this.pnrmdDOList);

    } else {

      console.log("Cannot fetch Settings");

    }

    this.broadWorksMobilityService.setAllSelectedMobileDeviceNumbers(this.allSelectedMobileDeviceNumbers);
    this.broadWorksMobilityService.setPNRMDDOList(this.pnrmdDOList);

    if (this.isDesktop) {
      if (this.allSelectedMobileDeviceNumbers.length === 0) {
        this.mobileDeviceOptinputValue = this.customizedTextJson.none;
      } else {
        this.mobileDeviceOptinputValue = this.allSelectedMobileDeviceNumbers.join();
      }
    }

  }

  private updatePNRMDDOList() {
    this.util.updateNoneDesktopOptionList(this.pnrmdDOList, this.allSelectedMobileDeviceNumbers);
  }

  fetchDevicesToRing() {

    if (this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.devicesToRing) {
      this.devicesToRing = this.broadWorksMobilityParsedJson.BroadWorksMobility.profileIdentity.profileAlertingPolicy.devicesToRing.$;
      if (this.devicesToRing == "Both") {
        this.isRingFixedDevicesUnderBWMobilityChecked = true;
        this.isRingMobileDevicesUnderBWMobilityChecked = true;
      }
      else if (this.devicesToRing == "Mobile") {
        this.isRingMobileDevicesUnderBWMobilityChecked = true;
        this.isRingFixedDevicesUnderBWMobilityChecked = false;
      }
      else if (this.devicesToRing == "Fixed") {
        this.isRingFixedDevicesUnderBWMobilityChecked = true;
        this.isRingMobileDevicesUnderBWMobilityChecked = false;
      }

      this.broadWorksMobilityService.setDevicesToRing(this.isRingFixedDevicesUnderBWMobilityChecked, this.isRingMobileDevicesUnderBWMobilityChecked);
    }
  }

  fetchDevicesToRingUnderMobileIdentity() {

    if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy) {
      if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.devicesToRing.$ == "Both") {

        this.isRingFixedDevicesMobileIdentityChecked = true;
        this.isRingMobileDevicesUnderMobileIdentityChecked = true;
      }
      else if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.devicesToRing.$ == "Fixed") {
        this.isRingFixedDevicesMobileIdentityChecked = true;
        this.isRingMobileDevicesUnderMobileIdentityChecked = false;
      }
      else if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.devicesToRing.$ == "Mobile") {
        this.isRingFixedDevicesMobileIdentityChecked = false;
        this.isRingMobileDevicesUnderMobileIdentityChecked = true;
      }
      this.broadWorksMobilityService.setDevicesToRingUnderMobileIdentity(this.isRingFixedDevicesMobileIdentityChecked, this.isRingMobileDevicesUnderMobileIdentityChecked);
    }
  }

  ringMobileDevicesUnderBWMobilityActive() {
    this.isDevicesToRingPutErrOccurred = false;
    this.devicesToRingCheckboxValidation = "";
    this.ringMobDevSrvErr = "";
    this.ringMobDevSrvErr = "";
    if (!this.isRingMobileDevicesUnderBWMobilityChecked) {
      this.isRingMobileDevicesUnderBWMobilityChecked = true;
    } else {
      this.isRingMobileDevicesUnderBWMobilityChecked = false;
    }
    this.broadWorksMobilityService.putDevicesToRing(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.isRingFixedDevicesUnderBWMobilityChecked, this.isRingMobileDevicesUnderBWMobilityChecked, this.postDevicesToRingPut.bind(this));
  }

  ringFixedDevicesUnderBWMobilityActive() {

    this.devicesToRingCheckboxValidation = "";
    this.isDevicesToRingPutErrOccurred = false;
    this.ringMobDevSrvErr = "";
    if (!this.isRingFixedDevicesUnderBWMobilityChecked) {
      this.isRingFixedDevicesUnderBWMobilityChecked = true;
    } else {
      this.isRingFixedDevicesUnderBWMobilityChecked = false;
    }
    this.broadWorksMobilityService.putDevicesToRing(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.isRingFixedDevicesUnderBWMobilityChecked, this.isRingMobileDevicesUnderBWMobilityChecked, this.postDevicesToRingPut.bind(this));
  }

  ringFixedDevicesUnderMobileIdentityActive() {

    this.devicesToRingCheckboxMIValidation = "";
    this.isDevicesToRingUnderMobileIdentityPutErrOccurred = false;
    this.ringMobDevMISrvErr = "";
    if (!this.isRingFixedDevicesMobileIdentityChecked) {
      this.isRingFixedDevicesMobileIdentityChecked = true;
    } else {
      this.isRingFixedDevicesMobileIdentityChecked = false;
    }
    this.broadWorksMobilityService.putDevicesToRingUnderMobileIdentity(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.isRingFixedDevicesMobileIdentityChecked, this.isRingMobileDevicesUnderMobileIdentityChecked, this.postDevicesToRingUnderMobileIdentityPut.bind(this));

  }

  ringMobileDevicesUnderMobileIdentityActive() {

    this.ringMobDevMISrvErr = "";

    this.isDevicesToRingUnderMobileIdentityPutErrOccurred = false;
    this.devicesToRingCheckboxMIValidation = "";
    if (!this.isRingMobileDevicesUnderMobileIdentityChecked) {
      this.isRingMobileDevicesUnderMobileIdentityChecked = true;
    } else {
      this.isRingMobileDevicesUnderMobileIdentityChecked = false;
    }
    this.broadWorksMobilityService.putDevicesToRingUnderMobileIdentity(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.isRingFixedDevicesMobileIdentityChecked, this.isRingMobileDevicesUnderMobileIdentityChecked, this.postDevicesToRingUnderMobileIdentityPut.bind(this));

  }

  postDevicesToRingUnderMobileIdentityPut(deviceToRingUnderMobileIdentity, isDevicesToRingUnderMobileIdentityPutErrOccurred, err) {
    if (isDevicesToRingUnderMobileIdentityPutErrOccurred) {
      this.isDevicesToRingUnderMobileIdentityPutErrOccurred = isDevicesToRingUnderMobileIdentityPutErrOccurred;
      if (err.status == 400) {
        this.devicesToRingCheckboxMIValidation = this.customizedTextJson.broadworks_mobility.rng_mobile_dev_validation_msg;
      } else if (err.status == 409) {
        this.devicesToRingCheckboxMIValidation = this.customizedTextJson.broadworks_mobility.devices_to_ring_checkbox_validation;
      } else if (err.status == 0) {
        this.devicesToRingCheckboxMIValidation = this.customizedTextJson.error.networkerror;
      } else {
        this.devicesToRingCheckboxMIValidation = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    console.log("DevicesToRingUnderMobileIdentity set to ", deviceToRingUnderMobileIdentity);
    this.isRingFixedDevicesMobileIdentityChecked = this.broadWorksMobilityService.fetchIsRingFixedDevicesUnderMobileIdentityChecked();
    this.isRingMobileDevicesUnderMobileIdentityChecked = this.broadWorksMobilityService.fetchIsRingMobileDevicesUnderMobileIdentityChecked();
  }

  postDevicesToRingPut(devicesToRing, isDevicesToRingPutErrOccurred, err) {

    if (isDevicesToRingPutErrOccurred) {
      this.isDevicesToRingPutErrOccurred = isDevicesToRingPutErrOccurred;
      if (err.status == 400) {
        this.devicesToRingCheckboxValidation = this.customizedTextJson.broadworks_mobility.rng_mobile_dev_validation_msg;
      } else if (err.status == 409) {
        this.devicesToRingCheckboxValidation = this.customizedTextJson.broadworks_mobility.devices_to_ring_checkbox_validation;
      } else if (err.status == 0) {
        this.devicesToRingCheckboxValidation = this.customizedTextJson.error.networkerror;
      } else {
        this.devicesToRingCheckboxValidation = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    console.log("DevicesToRing set to: ", devicesToRing);
    this.isRingFixedDevicesUnderBWMobilityChecked = this.broadWorksMobilityService.fetchIsRingFixedDevicesUnderBWMobilityChecked();
    this.isRingMobileDevicesUnderBWMobilityChecked = this.broadWorksMobilityService.fetchIsRingMobileDevicesUnderBWMobilityChecked();

  }

  fetchActiveMobileDeviceNumbersUnderMobileIdentity() {
    if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.mobileNumbersAlertList) {
      if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.mobileNumbersAlertList.mobileNumber.constructor == Array) {

        console.log("broadworksMobilityMobileIdentitySettingsParsedJson: ", this.broadworksMobilityMobileIdentitySettingsParsedJson);

        this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.mobileNumbersAlertList.mobileNumber.forEach(element => {

          this.allSelectedMobileNumbersUnderMobileIdentity.push(element.$);

        });

      }
      else if (this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.mobileNumbersAlertList.mobileNumber.constructor == Object) {

        this.allSelectedMobileNumbersUnderMobileIdentity.push(this.broadworksMobilityMobileIdentitySettingsParsedJson.BroadWorksMobilityMobileIdentity.mobileAlertingPolicy.mobileNumbersAlertList.mobileNumber.$);

      }
    }
    else {

      console.log("Cannot fetch Settings");

    }

    this.broadWorksMobilityService.setAllSelectedMobileDeviceNumbersUnderMobileIdentity(this.allSelectedMobileNumbersUnderMobileIdentity);
    this.updateMNRMDDOList();
    this.broadWorksMobilityService.setMNRMDDOList(this.mnrmdDOList);

    if (this.isDesktop) {
      if (this.allSelectedMobileNumbersUnderMobileIdentity.length === 0) {
        this.mobileDeviceOptinputValueUnderMobileIdentity = this.customizedTextJson.none;
      } else {
        this.mobileDeviceOptinputValueUnderMobileIdentity = this.allSelectedMobileNumbersUnderMobileIdentity.join();
      }
    }

  }

  private updateMNRMDDOList() {
    this.util.updateNoneDesktopOptionList(this.mnrmdDOList, this.allSelectedMobileNumbersUnderMobileIdentity);
  }

  postPrimaryNumberGet(profileParsedJSON) {
    if (profileParsedJSON) {
      this.primaryNumber = this.callControlService.fetchPrimaryNumber();
      console.log("Fetched profile number: ", this.primaryNumber);
    } else {
      this.primaryNumberRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }

  primaryNumberExpand() {
    if (this.isPrimaryNumberExpanded)
      this.isPrimaryNumberExpanded = false;
    else {
      this.isPrimaryNumberExpanded = true;

    }


  }

  mobileNumberExpand() {
    if (this.isMobileNumberExpanded) {
      this.isMobileNumberExpanded = false;
    } else {
      this.isMobileNumberExpanded = true;
    }

  }

  /* ============================ */

  mobileDeviceOptinputValue: string = "";

  onMNRMDDOptionsBlur() {
    this.isMNRMDOptionsFocused = false;
  }

  onMNRMDDOptionsHide(flag: boolean) {
    this.mnrmdDesktopMenuShow = flag;
    this.onMNRMDDOptionsBlur();
  }

  onMNRMDDOptionsChange(settings) {
    this.allSelectedMobileNumbersUnderMobileIdentity = settings;
    this.UpdateRingMobileOptionsUnderMobileIdentity(this.allSelectedMobileNumbersUnderMobileIdentity);
  }

  private onUpdateRingMobileOptionsUnderMobileIdentity(event) {

    this.allSelectedMobileNumbersUnderMobileIdentity = [];
    let ringMobileSlectedOptions = event.currentTarget.selectedOptions;
    let ringMobOpt;
    if (ringMobileSlectedOptions.length > 0) {

      for (var i = 0, iLen = ringMobileSlectedOptions.length; i < iLen; i++) {
        ringMobOpt = ringMobileSlectedOptions[i];
        if (ringMobOpt.selected) {
          this.allSelectedMobileNumbersUnderMobileIdentity.push(ringMobOpt.value || ringMobOpt.text);
        }
      }
    }

    this.UpdateRingMobileOptionsUnderMobileIdentity(this.allSelectedMobileNumbersUnderMobileIdentity);
  }

  mobileDeviceOptinputValueUnderMobileIdentity: string;

  private UpdateRingMobileOptionsUnderMobileIdentity(allSelectedMobileNumbersUnderMobileIdentity) {

    if (this.isDesktop) {
      if (this.allSelectedMobileNumbersUnderMobileIdentity.length === 0) {
        this.mobileDeviceOptinputValueUnderMobileIdentity = this.customizedTextJson.none;
      } else {
        this.mobileDeviceOptinputValueUnderMobileIdentity = allSelectedMobileNumbersUnderMobileIdentity.join();
      }
    }
    this.sendAllSelectedMobileNumbersUnderMobileIdentity();
    this.previousSelectedMobile = this.allSelectedMobileNumbersUnderMobileIdentity;
  }

  private onPNRMDOptionsBlur() {
    this.isPNRMDOptionsFocused = false;
  }
  onPNRMDOptionsHide(flag: boolean) {
    this.pnrmdDesktopMenuShow = flag;
    this.onPNRMDOptionsBlur();
  }
  onPNRMDOptionsChange(settings) {
    this.allSelectedMobileDeviceNumbers = settings;
    this.updateRingMobileOptions(this.allSelectedMobileDeviceNumbers);
  }

  private onUpdateRingMobileOptions(event) {

    this.allSelectedMobileDeviceNumbers = [];
    let ringMobileSlectedOptions = event.currentTarget.selectedOptions;
    let ringMobOpt;
    if (ringMobileSlectedOptions.length > 0) {

      for (var i = 0, iLen = ringMobileSlectedOptions.length; i < iLen; i++) {
        ringMobOpt = ringMobileSlectedOptions[i];
        if (ringMobOpt.selected) {
          this.allSelectedMobileDeviceNumbers.push(ringMobOpt.value || ringMobOpt.text);
        }
      }
    }

    this.updateRingMobileOptions(this.allSelectedMobileDeviceNumbers);
  }

  private updateRingMobileOptions(allSelectedMobileDeviceNumbers) {

    if (this.isDesktop) {
      if (this.allSelectedMobileDeviceNumbers.length === 0) {
        this.mobileDeviceOptinputValue = this.customizedTextJson.none;
      } else {
        this.mobileDeviceOptinputValue = allSelectedMobileDeviceNumbers.join();
      }
    }
    this.sendAllSelectedMobileDeviceNumbers();

    this.previousSelectedPrimaryMobile = this.allSelectedMobileDeviceNumbers;
  }

  private showRingMobileOptionsDropdown() {

    this.isPNRMDOptionsFocused = true;
    if (this.isDesktop) {
      this.pnrmdDesktopMenuShow = true;
    }

  }

  private showRingMobileDropdownForMobileIdentity() {

    this.isMNRMDOptionsFocused = true;
    if (this.isDesktop) {
      this.mnrmdDesktopMenuShow = true;
    }
  }

  private sendAllSelectedMobileNumbersUnderMobileIdentity() {

    this.ringMobDevMISrvErr = "";
    this.devicesToRingCheckboxMIValidation = "";
    this.broadWorksMobilityService.putSelectedMobileNumbersUnderMobileIdentity(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedMobileNumbersUnderMobileIdentity, this.postSelectedMobileNumbersUnderMobileIdentityPut.bind(this))
  }

  private showCurrentOptionsDropdownUnderMobileIdentity() {

    this.isMNRFDOptionsFocused = true;
    if (this.isDesktop) {
      this.mnrfdDesktopMenuShow = true;
    }

  }

  private sendAllSelectedSettingsInsideMobileNumber() {

    this.isSelectedSettingsMobileIdentityPutErrOccurred = false;
    this.ringFixedDevMISrvErr = "";
    this.devicesToRingCheckboxMIValidation = "";
    this.broadWorksMobilityService.putSelectedSettingsInsideMobileNumber(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedSettingsMobileNumber, this.postSelectedSettingsInsideMobileNumberPut.bind(this));

  }

  postSelectedMobileNumbersUnderMobileIdentityPut(allSelectedMobileNumbersUnderMobileIdentity, err) {

    if (allSelectedMobileNumbersUnderMobileIdentity) {
      console.log("Mobile numbers successfully updated under Mobile Identity");
      this.allSelectedMobileNumbersUnderMobileIdentity = allSelectedMobileNumbersUnderMobileIdentity;
    } else {
      if (err.status == 0) {
        this.ringMobDevMISrvErr = this.customizedTextJson.error.networkerror;
      } else if (err.status == 400) {
        this.ringMobDevMISrvErr = this.customizedTextJson.broadworks_mobility.rng_mobile_dev_validation_msg;
      } else {
        this.ringMobDevMISrvErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
      console.log("Some Error Occurred");
    }
  }
  private sendAllSelectedMobileDeviceNumbers() {
    this.isSelectedMobileDeviceNumbersPutErrOccurred = false;
    this.ringMobDevSrvErr = "";
    this.devicesToRingCheckboxValidation = "";
    this.broadWorksMobilityService.putSelectedMobileDeviceNumbers(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedMobileDeviceNumbers, this.postSelectedMobileDeviceNumbersPut.bind(this));
    this.broadWorksMobilityService.putSelectedMobileDeviceNumbers(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedMobileDeviceNumbers, this.postSelectedMobileDeviceNumbersPut.bind(this));



  }

  postSelectedMobileDeviceNumbersPut(allSelectedMobileDeviceNumbers, err) {
    if (allSelectedMobileDeviceNumbers) {
      console.log("Broadworks Mobility mobile device numbers updated.");
    } else {
      this.isSelectedMobileDeviceNumbersPutErrOccurred = true;
      if (err.status == 0) {
        this.ringMobDevSrvErr = this.customizedTextJson.error.networkerror;
      } else if (err.status == 400) {
        this.ringMobDevSrvErr = this.customizedTextJson.broadworks_mobility.rng_mobile_dev_validation_msg;
      } else {
        this.ringMobDevSrvErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
    }
    this.allSelectedMobileDeviceNumbers = allSelectedMobileDeviceNumbers;
  }

  /* ============================ */

  private onMNGSDOptionsBlur() {
    this.isMNGSDOptionsFocused = false;
  }
  onMNGSDOptionsHide(flag: boolean) {
    this.mngsDesktopMenuShow = false;
    this.onMNGSDOptionsBlur();
  }
  onMNGSDOptionsChange(settings) {
    this.allSelectedGeneralSettingsOptions = settings;
    this.updateGeneralSettingOptions(this.allSelectedGeneralSettingsOptions);
  }

  private onUpdateGeneralSettingOptions(event) {
    let result = [], slectedOptions = event.currentTarget.selectedOptions;
    if (slectedOptions.length > 0) {
      let genOpt;
      for (var i = 0, iLen = slectedOptions.length; i < iLen; i++) {
        genOpt = slectedOptions[i];
        if (genOpt.selected) {
          result.push(genOpt.value || genOpt.text);
        }
      }
    }
    this.updateGeneralSettingOptions(result);
  }

  geninputValue: String;
  private updateGeneralSettingOptions(result) {
    this.allSelectedGeneralSettingsOptions = [];
    setTimeout(() => {
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.alert_agent_calls) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_agent_calls);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.alert_click_to_dial_calls) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_click_to_dial_calls);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.alert_group_paging_calls) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.alert_group_paging_calls);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.answer_confirmation) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.answer_confirmation);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.call_control_services) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.call_control_services);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor);
      }
      if (result.indexOf(this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id) > -1) {
        this.allSelectedGeneralSettingsOptions.push(this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id);
      }

      if (this.isDesktop) {
        if (result.length === 0) {
          this.geninputValue = this.customizedTextJson.none;
        } else {
          this.geninputValue = result.join();
        }
      }

      this.sendSelectedGeneralSettingsOptions();


      this.previousSelectedGenSetting = this.allSelectedGeneralSettingsOptions;
    }, 9);
  }

  private showGeneralSettingsDropdown() {

    this.isMNGSDOptionsFocused = true;
    if (this.isDesktop) {
      this.mngsDesktopMenuShow = true;
    }

    let mngsSelectDropdown = document.getElementById("mngsSelectDropdown");
    if (mngsSelectDropdown) {
      mngsSelectDropdown.focus();
    }
  }

  private sendSelectedGeneralSettingsOptions() {

    this.selectGenSettingsErrMsg = "";

    this.broadWorksMobilityService.putSelectedGeneralSettingsOptions(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedGeneralSettingsOptions, this.postSelectedGeneralSettingsOptionsPut.bind(this));


  }

  postSelectedGeneralSettingsOptionsPut(error) {

    if (error) {
      if (error.status == 0) {
        this.selectGenSettingsErrMsg = this.customizedTextJson.error.networkerror;
      } else {
        this.selectGenSettingsErrMsg = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }

    }
    this.isAlertAgentCallsChecked = this.broadWorksMobilityService.fetchIsAlertAgentCallsChecked();
    this.isAlertClickToDialCallsChecked = this.broadWorksMobilityService.fetchIsAlertClickToDialCallsChecked();
    this.isAlertGroupPagingCallsChecked = this.broadWorksMobilityService.fetchIsAlertGroupPagingCallsChecked();
    this.isUseMobilityCallingLineIDChecked = this.broadWorksMobilityService.fetchIsUseMobilityCallingLineIDChecked();
    this.isUseDiversionInhibitorChecked = this.broadWorksMobilityService.fetchIsUseDiversionInhibitorChecked();
    this.isAnswerConfirmationRequiredChecked = this.broadWorksMobilityService.fetchIsAnswerConfirmationRequiredChecked();
    this.isBroadworksCallControlChecked = this.broadWorksMobilityService.fetchIsBroadworksCallControlChecked();

  }

  /* ============================ */

  private onPNRFDOptionsBlur() {
    this.isPNRFDOptionsFocused = false
  }
  onPNRFDOptionsHide(flag: boolean) {
    this.pnrfdDesktopMenuShow = flag;
    this.onPNRFDOptionsBlur();
  }
  onPNRFDOptionsChange(settings) {
    this.allSelectedSettings = settings;
    this.updateCurrentOptions(settings);
  }
  private onSelectSettingsInsidePrimaryNumber(event) {

    this.allSelectedSettings = [];

    let slectedOptions = event.currentTarget.selectedOptions;
    let opt;
    if (slectedOptions.length > 0) {
      for (var i = 0, iLen = slectedOptions.length; i < iLen; i++) {
        opt = slectedOptions[i];
        if (opt.selected) {
          this.allSelectedSettings.push(opt.value || opt.text);
        }
      }
    }

    this.updateCurrentOptions(this.allSelectedSettings);
  }


  onMNRFDOptionsBlur() {
    this.isMNRFDOptionsFocused = false;
  }
  onMNRFDOptionsHide(flag: boolean) {
    this.mnrfdDesktopMenuShow = flag;
    this.onMNRFDOptionsBlur();
  }
  onMNRFDOptionsChange(settings) {
    this.allSelectedSettingsMobileNumber = settings;
    this.updateCurrentOptionsInsideMobileNumber(this.allSelectedSettingsMobileNumber);
  }

  onUpdateOptionsInsideMobileNumber(event) {

    this.allSelectedSettingsMobileNumber = [];
    let slectedOptions = event.currentTarget.selectedOptions;
    let opt;
    if (slectedOptions.length > 0) {

      for (var i = 0, iLen = slectedOptions.length; i < iLen; i++) {
        opt = slectedOptions[i];
        if (opt.selected) {
          this.allSelectedSettingsMobileNumber.push(opt.value || opt.text);
        }
      }
    }

    this.updateCurrentOptionsInsideMobileNumber(this.allSelectedSettingsMobileNumber);

  }

  selectedSettingsMobileNumber: String;

  private updateCurrentOptionsInsideMobileNumber(allSelectedSettingsMobileNumber) {

    if (this.isDesktop) {
      if (this.allSelectedSettingsMobileNumber.length === 0) {
        this.selectedSettingsMobileNumber = this.customizedTextJson.none;
      } else {
        this.selectedSettingsMobileNumber = allSelectedSettingsMobileNumber.join();
      }
    }
    this.sendAllSelectedSettingsInsideMobileNumber();
    this.previousSelectedMobile = this.allSelectedSettingsMobileNumber;

  }


  selectedSettings: String;

  private updateCurrentOptions(allSelectedSettings) {

    if (this.isDesktop) {
      if (this.allSelectedSettings.length === 0) {
        this.selectedSettings = this.customizedTextJson.none;
      } else {
        this.selectedSettings = allSelectedSettings.join();
      }
    }
    this.sendAllSelectedSettings();
    this.previousSelectedPrimaryFixed = this.allSelectedSettings;
  }


  private showCurrentOptionsDropdown() {

    this.isPNRFDOptionsFocused = true;
    if (this.isDesktop) {
      this.pnrfdDesktopMenuShow = true;
    }

    let pnrfdSelectDropdown = document.getElementById("pnrfdSelectDropdown");
    if (pnrfdSelectDropdown) {
      pnrfdSelectDropdown.focus();
    }

  }

  postSelectedSettingsInsideMobileNumberPut(isSelectedSettingsMobileIdentityPutErrOccurred, err) {

    if (isSelectedSettingsMobileIdentityPutErrOccurred) {
      if (err.status == 0) {
        this.ringFixedDevMISrvErr = this.customizedTextJson.error.networkerror;
      } else {
        this.ringFixedDevMISrvErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }
      this.isSelectedSettingsMobileIdentityPutErrOccurred = isSelectedSettingsMobileIdentityPutErrOccurred;
      console.log("Some Error occurred while setting the broadworks mobility. ERRCODE: ", err.status);

    } else {
      console.log("Broadworks mobility settings successfully updated.");
    }
    this.isBroadWorksAnywhereActiveInsideMobileNumber = this.broadWorksMobilityService.fetchIsBroadWorksAnywhereActiveInsideMobileNumber();
    this.isExecutiveAssistantActiveInsideMobileNumber = this.broadWorksMobilityService.fetchIsExecutiveAssistantActiveInsideMobileNumber();
    this.isSharedCallAppearanceActiveInsideMobileNumber = this.broadWorksMobilityService.fetchIsSharedCallAppearanceActiveInsideMobileNumber();
    this.allSelectedSettingsMobileNumber = this.broadWorksMobilityService.fetchAllSelectedSettingsMobileNumber();
    this.mnrfdDOList = this.broadWorksMobilityService.fetchMNRFDDOList();

  }

  private sendAllSelectedSettings() {

    this.isSelectedSettingsBWMobilityPutErrOccurred = false;
    this.ringFixedDevSrvErr = "";
    this.devicesToRingCheckboxValidation = "";
    this.broadWorksMobilityService.putSelectedSettingsInsideBWMobility(this.serviceRouteProvider.fetchBroadWorksMobilityUrl(), this.allSelectedSettings, this.postSelectedSettingsInsideBWMobilityPut.bind(this));
  }

  postSelectedSettingsInsideBWMobilityPut(isSelectedSettingsBWMobilityPutErrOccurred, err) {

    if (isSelectedSettingsBWMobilityPutErrOccurred) {
      this.isSelectedSettingsBWMobilityPutErrOccurred = isSelectedSettingsBWMobilityPutErrOccurred;
      if (err.status == 0) {
        this.ringFixedDevSrvErr = this.customizedTextJson.error.networkerror;
      } else {
        this.ringFixedDevSrvErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, err.status);
      }

      console.log("Some Error occurred while setting the broadworks mobility.ERRCODE: ", err.status);
    } else {
      console.log("Broadworks mobility settings successfully updated.");
    }
  }

  private onSendCallsUpdateOptions(event) {
    console.log("event source: %o", event);
  }

}