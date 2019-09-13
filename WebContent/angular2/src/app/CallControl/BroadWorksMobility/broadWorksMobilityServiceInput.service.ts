/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class BroadWorksMobilityServiceInput {

    private isBroadWorksMobilityActive: boolean;
    private bwMobilityParsedJson;
    private isSharedCallAppearanceActive: boolean;
    private isBroadWorksAnywhereActive: boolean;
    private isExecutiveAssistantActive: boolean;
    private allSelectedMobileDeviceNumbers = [];
    private allSelectedMobileNumbersUnderMobileIdentity = [];
    private broadworksMobilityMobileIdentitySettingsParsedJson;
    private isBroadWorksAnywhereActiveInsideMobileNumber: boolean;
    private isExecutiveAssistantActiveInsideMobileNumber: boolean;
    private isSharedCallAppearanceActiveInsideMobileNumber: boolean;
    private isAlertAgentCallsChecked: boolean;
    private isAlertClickToDialCallsChecked: boolean;
    private isAlertGroupPagingCallsChecked: boolean;
    private isAnswerConfirmationRequiredChecked: boolean;
    private isCallAnchoringChecked: boolean;
    private isBroadworksCallControlChecked: boolean;
    private isUseDiversionInhibitorChecked: boolean;
    private isUseMobilityCallingLineIDChecked: boolean;
    private isRingFixedDevicesUnderBWMobilityChecked: boolean;
    private isRingMobileDevicesUnderBWMobilityChecked: boolean;
    private isRingMobileDevicesUnderMobileIdentityChecked: boolean;
    private isRingFixedDevicesMobileIdentityChecked: boolean;
    private allSelectedSettingsMobileNumber = [];
    private allMobileDeviceNumbers = [];
    private allSelectedSettingsInBWMob = [];

    // DesktopSelectOptionsList start
    private pnrfdDOList = [];
    private pnrmdDOList = [];
    private mngsDOList = [];
    private mnrfdDOList = [];
    private mnrmdDOList = [];
    // DesktopSelectOptionsList end

    setIsBroadWorksMobilityActive(isBroadWorksMobilityActive) {
        this.isBroadWorksMobilityActive = isBroadWorksMobilityActive;
    }

    getIsBroadWorksMobilityActive() {
        return this.isBroadWorksMobilityActive;
    }

    setbwMobilityParsedJson(bwMobilityParsedJson) {
        this.bwMobilityParsedJson = bwMobilityParsedJson;
    }

    getbwMobilityParsedJson() {
        return this.bwMobilityParsedJson;
    }

    setBroadworksMobilityMobileIdentitySettingsParsedJson(broadworksMobilityMobileIdentitySettingsParsedJson) {
        this.broadworksMobilityMobileIdentitySettingsParsedJson = broadworksMobilityMobileIdentitySettingsParsedJson;
    }

    getBroadworksMobilityMobileIdentitySettingsParsedJson() {
        return this.broadworksMobilityMobileIdentitySettingsParsedJson;
    }

    setIsSharedCallAppearanceActive(isSharedCallAppearanceActive) {
        this.isSharedCallAppearanceActive = isSharedCallAppearanceActive;
    }

    getIsSharedCallAppearanceActive() {
        return this.isSharedCallAppearanceActive
    }

    setIsBroadWorksAnywhereActive(isBroadWorksAnywhereActive) {
        this.isBroadWorksAnywhereActive = isBroadWorksAnywhereActive;
    }

    getIsBroadWorksAnywhereActive() {
        return this.isBroadWorksAnywhereActive;
    }

    setIsExecutiveAssistantActive(isExecutiveAssistantActive) {
        this.isExecutiveAssistantActive = isExecutiveAssistantActive;
    }

    getIsExecutiveAssistantActive() {
        return this.isExecutiveAssistantActive;
    }

    setAllSelectedMobileDeviceNumbers(allSelectedMobileDeviceNumbers) {
        this.allSelectedMobileDeviceNumbers = allSelectedMobileDeviceNumbers;
    }

    getAllSelectedMobileDeviceNumbers() {
        return this.allSelectedMobileDeviceNumbers;
    }

    setIsBroadWorksAnywhereActiveInsideMobileNumber(isBroadWorksAnywhereSelected) {
        this.isBroadWorksAnywhereActiveInsideMobileNumber = isBroadWorksAnywhereSelected;
    }

    getIsBroadWorksAnywhereActiveInsideMobileNumber() {
        return this.isBroadWorksAnywhereActiveInsideMobileNumber;
    }

    setIsExecutiveAssistantActiveInsideMobileNumber(isExecutiveAssistantActive) {
        this.isExecutiveAssistantActiveInsideMobileNumber = isExecutiveAssistantActive;
    }

    getIsExecutiveAssistantActiveInsideMobileNumber() {
        return this.isExecutiveAssistantActiveInsideMobileNumber;
    }

    setIsSharedCallAppearanceActiveInsideMobileNumber(isSharedCallAppearanceSelected) {
        this.isSharedCallAppearanceActiveInsideMobileNumber = isSharedCallAppearanceSelected;
    }

    getIsSharedCallAppearanceActiveInsideMobileNumber() {
        return this.isSharedCallAppearanceActiveInsideMobileNumber;
    }

    setIsAlertAgentCallsChecked(isAlertAgentCallsChecked) {
        this.isAlertAgentCallsChecked = isAlertAgentCallsChecked
    }

    setIsAlertClickToDialCallsChecked(isAlertClickToDialCallsChecked) {
        this.isAlertClickToDialCallsChecked = isAlertClickToDialCallsChecked
    }

    getIsAlertAgentCallsChecked() {
        return this.isAlertAgentCallsChecked;
    }

    getIsAlertClickToDialCallsChecked() {
        return this.isAlertClickToDialCallsChecked;
    }

    setIsAlertGroupPagingCallsChecked(isAlertGroupPagingCallsChecked) {
        this.isAlertGroupPagingCallsChecked = isAlertGroupPagingCallsChecked
    }

    getIsAlertGroupPagingCallsChecked() {
        return this.isAlertGroupPagingCallsChecked
    }

    setIsAnswerConfirmationRequiredChecked(isAnswerConfirmationRequiredChecked) {
        this.isAnswerConfirmationRequiredChecked = isAnswerConfirmationRequiredChecked
    }

    getIsAnswerConfirmationRequiredChecked() {
        return this.isAnswerConfirmationRequiredChecked;
    }

    setIsCallAnchoringChecked(isCallAnchoringChecked) {
        this.isCallAnchoringChecked = isCallAnchoringChecked
    }

    getIsCallAnchoringChecked() {
        return this.isCallAnchoringChecked;
    }

    setIsBroadworksCallControlChecked(isBroadworksCallControlChecked) {
        this.isBroadworksCallControlChecked = isBroadworksCallControlChecked;
    }

    getIsBroadworksCallControlChecked() {
        return this.isBroadworksCallControlChecked;
    }

    setIsUseDiversionInhibitorChecked(isUseDiversionInhibitorChecked) {
        this.isUseDiversionInhibitorChecked = isUseDiversionInhibitorChecked;
    }

    getIsUseDiversionInhibitorChecked() {
        return this.isUseDiversionInhibitorChecked;
    }

    setIsUseMobilityCallingLineIDChecked(isUseMobilityCallingLineIDChecked) {
        this.isUseMobilityCallingLineIDChecked = isUseMobilityCallingLineIDChecked;
    }

    getIsUseMobilityCallingLineIDChecked() {
        return this.isUseMobilityCallingLineIDChecked;
    }

    setAllSelectedMobileNumbersUnderMobileIdentity(allSelectedMobileNumbersUnderMobileIdentity) {
        this.allSelectedMobileNumbersUnderMobileIdentity = allSelectedMobileNumbersUnderMobileIdentity;
    }

    getAllSelectedMobileNumbersUnderMobileIdentity() {
        return this.allSelectedMobileNumbersUnderMobileIdentity;
    }

    setDevicesToRing(isRingFixedDevicesUnderBWMobilityChecked, isRingMobileDevicesUnderBWMobilityChecked) {
        this.isRingFixedDevicesUnderBWMobilityChecked = isRingFixedDevicesUnderBWMobilityChecked;
        this.isRingMobileDevicesUnderBWMobilityChecked = isRingMobileDevicesUnderBWMobilityChecked;
    }

    getIsRingFixedDevicesUnderBWMobilityChecked() {
        return this.isRingFixedDevicesUnderBWMobilityChecked;
    }

    getIsRingMobileDevicesUnderBWMobilityChecked() {
        return this.isRingMobileDevicesUnderBWMobilityChecked;
    }

    setDevicesToRingUnderMobileIdentity(isRingFixedDevicesMobileIdentityChecked, isRingMobileDevicesUnderMobileIdentityChecked) {
        this.isRingFixedDevicesMobileIdentityChecked = isRingFixedDevicesMobileIdentityChecked;
        this.isRingMobileDevicesUnderMobileIdentityChecked = isRingMobileDevicesUnderMobileIdentityChecked;
    }

    getIsRingFixedDevicesMobileIdentityChecked() {
        return this.isRingFixedDevicesMobileIdentityChecked;
    }

    getIsRingMobileDevicesUnderMobileIdentityChecked() {
        return this.isRingMobileDevicesUnderMobileIdentityChecked;
    }

    setAllSelectedSettingsMobileNumber(allSelectedSettingsMobileNumber) {
        this.allSelectedSettingsMobileNumber = allSelectedSettingsMobileNumber;
    }

    getAllSelectedSettingsMobileNumber() {
        return this.allSelectedSettingsMobileNumber;
    }

    setAllMobileDeviceNumbers(mobileDeviceNumbers) {
        this.allMobileDeviceNumbers = mobileDeviceNumbers;
    }

    getAllMobileDeviceNumbers() {
        return this.allMobileDeviceNumbers;
    }

    setAllSelectedSettingsInBWMob(allSelectedSettings) {
        this.allSelectedSettingsInBWMob = allSelectedSettings;
    }

    getAllSelectedSettingsInBWMob() {
        return this.allSelectedSettingsInBWMob;
    }

    // ------------
    setPNRFDDOList(list) {
        this.pnrfdDOList = list;
    }
    getPNRFDDOList() {
        return this.pnrfdDOList;
    }

    setPNRMDDOList(list) {
        this.pnrmdDOList = list;
    }
    getPNRMDDOList() {
        return this.pnrmdDOList;
    }

    setMNGSDOList(list) {
        this.mngsDOList = list;
    }
    getMNGSDOList() {
        return this.mngsDOList;
    }

    setMNRFDDOList(list) {
        this.mnrfdDOList = list;
    }
    getMNRFDDOList() {
        return this.mnrfdDOList;
    }
    setMNRMDDOList(list) {
        this.mnrmdDOList = list;
    }
    getMNRMDDOList() {
        return this.mnrmdDOList;
    }

}
