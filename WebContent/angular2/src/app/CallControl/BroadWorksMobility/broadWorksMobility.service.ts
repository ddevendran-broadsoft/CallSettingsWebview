/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { BroadWorksMobilityServiceInput } from 'app/CallControl/BroadWorksMobility/broadWorksMobilityServiceInput.service';

@Injectable()

export class BroadWorksMobilityService {

    customizedTextJson = window['customizedTexts'];

    constructor(private httpServices: HttpServices, private broadWorksMobilityServiceInput: BroadWorksMobilityServiceInput) { }

    getBWMobilityStatus(broadWorksMobilityUrl, postBroadWorksMobilityGet) {

        this.httpServices.httpGetRequest(broadWorksMobilityUrl)
            .subscribe((res) => {
                let bwMobilityParsedJson = res.json();
                this.broadWorksMobilityServiceInput.setbwMobilityParsedJson(bwMobilityParsedJson);
                this.broadWorksMobilityServiceInput.setIsBroadWorksMobilityActive((bwMobilityParsedJson.BroadWorksMobility.active.$ === 'true'));
                postBroadWorksMobilityGet(bwMobilityParsedJson);
            },
            (err) => {
                postBroadWorksMobilityGet(null);
            });

    }

    getBroadworksMobilityMobileIdentitySettings(broadworksMobilityMobileIdentityUrl, postBroadworksMobilityMobileIdentitySettingsGet) {

        broadworksMobilityMobileIdentityUrl = broadworksMobilityMobileIdentityUrl + '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;
        this.httpServices.httpGetRequest(broadworksMobilityMobileIdentityUrl)
            .subscribe((res) => {
                let broadworksMobilityMobileIdentitySettingsParsedJson = res.json();
                this.broadWorksMobilityServiceInput.setBroadworksMobilityMobileIdentitySettingsParsedJson(broadworksMobilityMobileIdentitySettingsParsedJson);
                postBroadworksMobilityMobileIdentitySettingsGet(broadworksMobilityMobileIdentitySettingsParsedJson);
            },
            (err) => {
                console.log('Error: ', err);
                postBroadworksMobilityMobileIdentitySettingsGet(null);
            })


    }

    putSelectedSettingsInsideBWMobility(broadWorksMobilityUrl, allSelectedSettings, postSelectedSettingsInsideBWMobilityPut) {

        let isExecutiveAssistantSelected: boolean;
        let isBroadWorksAnywhereSelected: boolean;
        let isSharedCallAppearanceSelected: boolean;
        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksMobility xmlns="http://schema.broadsoft.com/xsi">' +
            '<active>true</active>' +
            '<allowCallAnchoringControl>true</allowCallAnchoringControl>' +
            '<preventCallsToOwnMobiles>false</preventCallsToOwnMobiles>' +
            '<profileIdentity><profileAlertingPolicy>';


        if (allSelectedSettings.includes(this.customizedTextJson.broadworks_mobility.shared_call_appearance)) {
            isSharedCallAppearanceSelected = true;
        } else {
            isSharedCallAppearanceSelected = false;
        }

        if (allSelectedSettings.includes(this.customizedTextJson.broadworks_mobility.broadworks_anywhere)) {
            isBroadWorksAnywhereSelected = true;
        } else {
            isBroadWorksAnywhereSelected = false;
        }

        if (allSelectedSettings.includes(this.customizedTextJson.broadworks_mobility.executive_assistant)) {
            isExecutiveAssistantSelected = true;
        } else {
            isExecutiveAssistantSelected = false;
        }



    body += '<includeSharedCallAppearance>' + isSharedCallAppearanceSelected + '</includeSharedCallAppearance>' +
    '<includeBroadWorksAnywhere>' + isBroadWorksAnywhereSelected + '</includeBroadWorksAnywhere>' +
    '<includeExecutiveAssistant>' + isExecutiveAssistantSelected + '</includeExecutiveAssistant>' +
    '</profileAlertingPolicy></profileIdentity></BroadWorksMobility>';

        this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
    .subscribe((res) => {

        this.broadWorksMobilityServiceInput.setIsBroadWorksAnywhereActive(isBroadWorksAnywhereSelected);
        this.broadWorksMobilityServiceInput.setIsExecutiveAssistantActive(isExecutiveAssistantSelected);
        this.broadWorksMobilityServiceInput.setIsSharedCallAppearanceActive(isSharedCallAppearanceSelected);
        this.broadWorksMobilityServiceInput.setAllSelectedSettingsInBWMob(allSelectedSettings);
        postSelectedSettingsInsideBWMobilityPut(false, null);
        //  boolean 'false' in the method parameter indicates there is no error occurred in the response
    },
    (err) => {

        postSelectedSettingsInsideBWMobilityPut(true, err);
        //  boolean 'true' in the method parameter indicates there is some error occurred

        console.log('Some Error occurred while setting value to bw mobility.')

    });
    }

putSelectedSettingsInsideMobileNumber(broadWorksMobilityUrl, allSelectedSettingsMobileNumber, postSelectedSettingsInsideMobileNumberPut) {

    broadWorksMobilityUrl += '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;
    let isExecutiveAssistantSelected: boolean;
    let isBroadWorksAnywhereSelected: boolean;
    let isSharedCallAppearanceSelected: boolean;
    let body = '<?xml version="1.0" encoding="ISO-8859-1"?> <BroadWorksMobilityMobileIdentity xmlns="http://schema.broadsoft.com/xsi">' +
        '<mobileAlertingPolicy>';

        if (allSelectedSettingsMobileNumber.includes(this.customizedTextJson.broadworks_mobility.shared_call_appearance)) {
            isSharedCallAppearanceSelected = true;
        } else {
            isSharedCallAppearanceSelected = false;

        }

        if (allSelectedSettingsMobileNumber.includes(this.customizedTextJson.broadworks_mobility.broadworks_anywhere)) {
            isBroadWorksAnywhereSelected = true;
        } else {
            isBroadWorksAnywhereSelected = false;

        }

        if (allSelectedSettingsMobileNumber.includes(this.customizedTextJson.broadworks_mobility.executive_assistant)) {
            isExecutiveAssistantSelected = true;
        } else {
            isExecutiveAssistantSelected = false;
        }
    body += '<includeSharedCallAppearance>' + isSharedCallAppearanceSelected + '</includeSharedCallAppearance>' +
        '<includeBroadWorksAnywhere>' + isBroadWorksAnywhereSelected + '</includeBroadWorksAnywhere>' +
        '<includeExecutiveAssistant>' + isExecutiveAssistantSelected + '</includeExecutiveAssistant>' +
        '</mobileAlertingPolicy></BroadWorksMobilityMobileIdentity>';

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {

            this.broadWorksMobilityServiceInput.setIsBroadWorksAnywhereActiveInsideMobileNumber(isBroadWorksAnywhereSelected);
            this.broadWorksMobilityServiceInput.setIsExecutiveAssistantActiveInsideMobileNumber(isExecutiveAssistantSelected);
            this.broadWorksMobilityServiceInput.setIsSharedCallAppearanceActiveInsideMobileNumber(isSharedCallAppearanceSelected);
            this.broadWorksMobilityServiceInput.setAllSelectedSettingsMobileNumber(allSelectedSettingsMobileNumber);
            postSelectedSettingsInsideMobileNumberPut(false, null);
            //  boolean 'false' in the method parameter indicates there is no error occurred in the response

        },
        (err) => {

            postSelectedSettingsInsideMobileNumberPut(true, err);
            //  boolean 'true' in the method parameter indicates there is some error occurred

            console.log('Some Error occurred while setting value to bw mobility.')

        });




}

putSelectedMobileDeviceNumbers(broadWorksMobilityUrl, allSelectedMobileDeviceNumbers, postSelectedMobileDeviceNumbersPut) {

    let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
        '<BroadWorksMobility xmlns="http://schema.broadsoft.com/xsi">' +
        '<active>true</active>' +
        '<allowCallAnchoringControl>true</allowCallAnchoringControl>' +
        '<preventCallsToOwnMobiles>false</preventCallsToOwnMobiles>' +
        '<profileIdentity><profileAlertingPolicy>';

    if (allSelectedMobileDeviceNumbers.length === 0) {

        body += '<mobileNumbersAlertList xs:nil="true" xmlns:xs="http:// www.w3.org/2001/XMLSchema-instance"/></profileAlertingPolicy></profileIdentity></BroadWorksMobility>';

    } else {

        body += '<mobileNumbersAlertList>';

        allSelectedMobileDeviceNumbers.forEach(element => {

            body += '<mobileNumber>' + element + '</mobileNumber>';

        });
        body += '</mobileNumbersAlertList></profileAlertingPolicy></profileIdentity></BroadWorksMobility>';
    }

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            this.broadWorksMobilityServiceInput.setAllSelectedMobileDeviceNumbers(allSelectedMobileDeviceNumbers);
            postSelectedMobileDeviceNumbersPut(allSelectedMobileDeviceNumbers, null);
            //  boolean 'false'' indicates that no error occurred in the response
        },
        (err) => {
            postSelectedMobileDeviceNumbersPut(null, err);
        })

}

putSelectedMobileNumbersUnderMobileIdentity(broadWorksMobilityUrl, allSelectedMobileNumbersUnderMobileIdentity, postSelectedMobileNumbersUnderMobileIdentityPut) {

    broadWorksMobilityUrl += '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;

    let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
        '<BroadWorksMobilityMobileIdentity xmlns="http:// schema.broadsoft.com/xsi">' +
        '<mobileAlertingPolicy>';

    if (allSelectedMobileNumbersUnderMobileIdentity.length === 0) {
        body += '<mobileNumbersAlertList xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/></mobileAlertingPolicy></BroadWorksMobilityMobileIdentity>'
    } else {

        body += '<mobileNumbersAlertList>';
        allSelectedMobileNumbersUnderMobileIdentity.forEach(element => {
            body += '<mobileNumber>' + element + '</mobileNumber>';
        });

        body += '</mobileNumbersAlertList></mobileAlertingPolicy></BroadWorksMobilityMobileIdentity>';
    }

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            this.broadWorksMobilityServiceInput.setAllSelectedMobileNumbersUnderMobileIdentity(allSelectedMobileNumbersUnderMobileIdentity);
            postSelectedMobileNumbersUnderMobileIdentityPut(allSelectedMobileNumbersUnderMobileIdentity, null);
        },
        (err) => {
            postSelectedMobileNumbersUnderMobileIdentityPut(null, err);
        });


}

putEnableAlerting(broadWorksMobilityUrl, isEnableAlertingChecked, postEnableAlertingPut) {

    broadWorksMobilityUrl += '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;
    let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
        '<BroadWorksMobilityMobileIdentity xmlns="http://schema.broadsoft.com/xsi">' +
        '<mobileNumber>' + window['callSettingsHeroInput'].deviceMobileNo + '</mobileNumber><description>Mobile 2</description>' +
        '<enableAlerting>' + isEnableAlertingChecked + '</enableAlerting><primary>false</primary></BroadWorksMobilityMobileIdentity>';

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            postEnableAlertingPut(isEnableAlertingChecked, null);
        },
        (err) => {
            console.log('Some Error occurred while updating Enable Alerting');
            postEnableAlertingPut(!isEnableAlertingChecked, err);
        });
}

putSelectedGeneralSettingsOptions(broadWorksMobilityUrl, allSelectedGeneralSettingsOptions, postSelectedGeneralSettingsOptionsPut) {
    broadWorksMobilityUrl += '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;
    let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
        '<BroadWorksMobilityMobileIdentity xmlns="http://schema.broadsoft.com/xsi">';


    let isAlertAgentCallsChecked: boolean;
    let isAlertClickToDialCallsChecked: boolean;
    let isAlertGroupPagingCallsChecked: boolean;
    let isUseMobilityCallingLineIDChecked: boolean;
    let isUseDiversionInhibitorChecked: boolean;
    let isAnswerConfirmationRequiredChecked: boolean;
    let isBroadworksCallControlChecked: boolean;
    let isCallAnchoringChecked: boolean;

    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.alert_agent_calls)) {
        isAlertAgentCallsChecked = true;
    } else {
        isAlertAgentCallsChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.alert_click_to_dial_calls)) {
        isAlertClickToDialCallsChecked = true;
    } else {
        isAlertClickToDialCallsChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.alert_group_paging_calls)) {
        isAlertGroupPagingCallsChecked = true;
    } else {
        isAlertGroupPagingCallsChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.use_mobility_calling_line_id)) {
        isUseMobilityCallingLineIDChecked = true;
    } else {
        isUseMobilityCallingLineIDChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.enable_diversion_inhibitor)) {
        isUseDiversionInhibitorChecked = true;
    } else {
        isUseDiversionInhibitorChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.answer_confirmation)) {
        isAnswerConfirmationRequiredChecked = true;
    } else {
        isAnswerConfirmationRequiredChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.call_control_services)) {
        isBroadworksCallControlChecked = true;
    } else {
        isBroadworksCallControlChecked = false;
    }
    if (allSelectedGeneralSettingsOptions.includes(this.customizedTextJson.broadworks_mobility.call_anchoring)) {
        isCallAnchoringChecked = true;
    } else {
        isCallAnchoringChecked = false;
    }

    body += '<alertAgentCalls>' + isAlertAgentCallsChecked + '</alertAgentCalls><alertClickToDialCalls>' + isAlertClickToDialCallsChecked + '</alertClickToDialCalls><alertGroupPagingCalls>' + isAlertGroupPagingCallsChecked + '</alertGroupPagingCalls>' +
        '<useMobilityCallingLineID>' + isUseMobilityCallingLineIDChecked + '</useMobilityCallingLineID><useDiversionInhibitor>' + isUseDiversionInhibitorChecked + '</useDiversionInhibitor>' +
        '<answerConfirmationRequired>' + isAnswerConfirmationRequiredChecked + '</answerConfirmationRequired><broadworksCallControl>' + isBroadworksCallControlChecked + '</broadworksCallControl><mobileCallAnchoringPolicy><enableCallAnchoring>' + isCallAnchoringChecked + '</enableCallAnchoring></mobileCallAnchoringPolicy>' +
        '</BroadWorksMobilityMobileIdentity>';

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            this.broadWorksMobilityServiceInput.setIsAlertAgentCallsChecked(isAlertAgentCallsChecked);
            this.broadWorksMobilityServiceInput.setIsAlertClickToDialCallsChecked(isAlertClickToDialCallsChecked);
            this.broadWorksMobilityServiceInput.setIsAlertGroupPagingCallsChecked(isAlertGroupPagingCallsChecked);
            this.broadWorksMobilityServiceInput.setIsUseMobilityCallingLineIDChecked(isUseMobilityCallingLineIDChecked);
            this.broadWorksMobilityServiceInput.setIsUseDiversionInhibitorChecked(isUseDiversionInhibitorChecked);
            this.broadWorksMobilityServiceInput.setIsAnswerConfirmationRequiredChecked(isAnswerConfirmationRequiredChecked);
            this.broadWorksMobilityServiceInput.setIsBroadworksCallControlChecked(isBroadworksCallControlChecked);
            this.broadWorksMobilityServiceInput.setIsCallAnchoringChecked(isCallAnchoringChecked);
            postSelectedGeneralSettingsOptionsPut(null);
        }, (err) => {
            postSelectedGeneralSettingsOptionsPut(err);
        });

}

putDevicesToRing(broadWorksMobilityUrl, isRingFixedDevicesUnderBWMobilityChecked, isRingMobileDevicesUnderBWMobilityChecked, postDevicesToRingPut) {

    let body = '<?xml version="1.0" encoding="ISO-8859-1"?> <BroadWorksMobility xmlns="http:// schema.broadsoft.com/xsi">' +
        '<active>true</active><allowCallAnchoringControl>true</allowCallAnchoringControl>' +
        '<preventCallsToOwnMobiles>false</preventCallsToOwnMobiles><profileIdentity><profileAlertingPolicy>';
    let devicesToRing: string;
    if (isRingMobileDevicesUnderBWMobilityChecked && isRingFixedDevicesUnderBWMobilityChecked) {
        devicesToRing = 'Both';
    } else if (isRingMobileDevicesUnderBWMobilityChecked === false && isRingFixedDevicesUnderBWMobilityChecked === true) {
        devicesToRing = 'Fixed';
    } else if (isRingMobileDevicesUnderBWMobilityChecked === true && isRingFixedDevicesUnderBWMobilityChecked === false) {
        devicesToRing = 'Mobile';
    }

    body += '<devicesToRing>' + devicesToRing + '</devicesToRing></profileAlertingPolicy></profileIdentity></BroadWorksMobility>';

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            this.broadWorksMobilityServiceInput.setDevicesToRing(isRingFixedDevicesUnderBWMobilityChecked, isRingMobileDevicesUnderBWMobilityChecked);
            postDevicesToRingPut(devicesToRing, false, null);
        }, (err) => {
            postDevicesToRingPut(devicesToRing, true, err);
        })

}

putDevicesToRingUnderMobileIdentity(broadWorksMobilityUrl, isRingFixedDevicesMobileIdentityChecked, isRingMobileDevicesUnderMobileIdentityChecked, postDevicesToRingUnderMobileIdentityPut) {

    broadWorksMobilityUrl += '/mobileidentity/' + window['callSettingsHeroInput'].deviceMobileNo;
    let deviceToRingUnderMobileIdentity: string;
    let body = '<?xml version="1.0" encoding="ISO-8859-1"?> <BroadWorksMobilityMobileIdentity xmlns="http://schema.broadsoft.com/xsi"><mobileAlertingPolicy>';
    if (isRingFixedDevicesMobileIdentityChecked && isRingMobileDevicesUnderMobileIdentityChecked) {
        deviceToRingUnderMobileIdentity = 'Both';
    } else if (!isRingFixedDevicesMobileIdentityChecked && isRingMobileDevicesUnderMobileIdentityChecked) {
        deviceToRingUnderMobileIdentity = 'Mobile';
    } else if (isRingFixedDevicesMobileIdentityChecked && !isRingMobileDevicesUnderMobileIdentityChecked) {
        deviceToRingUnderMobileIdentity = 'Fixed';
    }
    body += '<devicesToRing>' + deviceToRingUnderMobileIdentity + '</devicesToRing></mobileAlertingPolicy></BroadWorksMobilityMobileIdentity>';

    this.httpServices.httpPutRequest(broadWorksMobilityUrl, body)
        .subscribe((res) => {
            this.broadWorksMobilityServiceInput.setDevicesToRingUnderMobileIdentity(isRingFixedDevicesMobileIdentityChecked, isRingMobileDevicesUnderMobileIdentityChecked);
            postDevicesToRingUnderMobileIdentityPut(deviceToRingUnderMobileIdentity, false);
        },
        (err) => {
            postDevicesToRingUnderMobileIdentityPut(deviceToRingUnderMobileIdentity, true, err);
        })
}

setIsSharedCallAppearanceActive(isSharedCallAppearanceActive) {
    this.broadWorksMobilityServiceInput.setIsSharedCallAppearanceActive(isSharedCallAppearanceActive);
}

setIsBroadWorksAnywhereActive(isBroadWorksAnywhereActive) {
    this.broadWorksMobilityServiceInput.setIsBroadWorksAnywhereActive(isBroadWorksAnywhereActive);
}

setIsExecutiveAssistantActive(isExecutiveAssistantActive) {
    this.broadWorksMobilityServiceInput.setIsExecutiveAssistantActive(isExecutiveAssistantActive);
}

setAllSelectedMobileDeviceNumbers(allSelectedMobileDeviceNumbers) {
    this.broadWorksMobilityServiceInput.setAllSelectedMobileDeviceNumbers(allSelectedMobileDeviceNumbers);
}

setIsSharedCallAppearanceActiveInsideMobileNumber(isSharedCallAppearanceActiveInsideMobileNumber) {
    this.broadWorksMobilityServiceInput.setIsSharedCallAppearanceActiveInsideMobileNumber(isSharedCallAppearanceActiveInsideMobileNumber);
}

setIsBroadWorksAnywhereActiveInsideMobileNumber(isBroadWorksAnywhereActiveInsideMobileNumber) {
    this.broadWorksMobilityServiceInput.setIsBroadWorksAnywhereActiveInsideMobileNumber(isBroadWorksAnywhereActiveInsideMobileNumber);
}

setIsExecutiveAssistantActiveInsideMobileNumber(isExecutiveAssistantActiveInsideMobileNumber) {
    this.broadWorksMobilityServiceInput.setIsExecutiveAssistantActiveInsideMobileNumber(isExecutiveAssistantActiveInsideMobileNumber);
}

setIsAlertAgentCallsChecked(isAlertAgentCallsChecked) {
    this.broadWorksMobilityServiceInput.setIsAlertAgentCallsChecked(isAlertAgentCallsChecked);
}

setIsAlertClickToDialCallsChecked(isAlertClickToDialCallsChecked) {
    this.broadWorksMobilityServiceInput.setIsAlertClickToDialCallsChecked(isAlertClickToDialCallsChecked);
}

setIsAlertGroupPagingCallsChecked(isAlertGroupPagingCallsChecked) {
    this.broadWorksMobilityServiceInput.setIsAlertGroupPagingCallsChecked(isAlertGroupPagingCallsChecked);
}

setIsAnswerConfirmationRequiredChecked(isAnswerConfirmationRequiredChecked) {
    this.broadWorksMobilityServiceInput.setIsAnswerConfirmationRequiredChecked(isAnswerConfirmationRequiredChecked);
}

setIsCallAnchoringChecked(isCallAnchoringChecked) {
    this.broadWorksMobilityServiceInput.setIsCallAnchoringChecked(isCallAnchoringChecked);
}

setIsBroadworksCallControlChecked(isBroadworksCallControlChecked) {
    this.broadWorksMobilityServiceInput.setIsBroadworksCallControlChecked(isBroadworksCallControlChecked);
}

setIsUseDiversionInhibitorChecked(isUseDiversionInhibitorChecked) {
    this.broadWorksMobilityServiceInput.setIsUseDiversionInhibitorChecked(isUseDiversionInhibitorChecked);
}

setIsUseMobilityCallingLineIDChecked(isUseMobilityCallingLineIDChecked) {
    this.broadWorksMobilityServiceInput.setIsUseMobilityCallingLineIDChecked(isUseMobilityCallingLineIDChecked);
}

setAllSelectedMobileDeviceNumbersUnderMobileIdentity(allSelectedMobileNumbersUnderMobileIdentity) {
    this.broadWorksMobilityServiceInput.setAllSelectedMobileNumbersUnderMobileIdentity(allSelectedMobileNumbersUnderMobileIdentity);
}

setDevicesToRing(isRingFixedDevicesUnderBWMobilityChecked, isRingMobileDevicesUnderBWMobilityChecked) {
    this.broadWorksMobilityServiceInput.setDevicesToRing(isRingFixedDevicesUnderBWMobilityChecked, isRingMobileDevicesUnderBWMobilityChecked);
}

setDevicesToRingUnderMobileIdentity(isRingFixedDevicesMobileIdentityChecked, isRingMobileDevicesUnderMobileIdentityChecked) {
    this.broadWorksMobilityServiceInput.setDevicesToRingUnderMobileIdentity(isRingFixedDevicesMobileIdentityChecked, isRingMobileDevicesUnderMobileIdentityChecked);
}

setAllSelectedSettingsMobileNumber(allSelectedSettingsMobileNumber) {
    this.broadWorksMobilityServiceInput.setAllSelectedSettingsMobileNumber(allSelectedSettingsMobileNumber);
}

setAllMobileDeviceNumbers(mobileDeviceNumbers) {
    this.broadWorksMobilityServiceInput.setAllMobileDeviceNumbers(mobileDeviceNumbers);
}

setAllSelectedSettingsInBWMob(allSelectedSettings) {
    this.broadWorksMobilityServiceInput.setAllSelectedSettingsInBWMob(allSelectedSettings)
}

//  DesktopOptions start
setPNRFDDOList(list) {
    return this.broadWorksMobilityServiceInput.setPNRFDDOList(list);
}
setPNRMDDOList(list) {
    return this.broadWorksMobilityServiceInput.setPNRMDDOList(list);
}
setMNGSDOList(list) {
    return this.broadWorksMobilityServiceInput.setMNGSDOList(list);
}
setMNRFDDOList(list) {
    return this.broadWorksMobilityServiceInput.setMNRFDDOList(list);
}
setMNRMDDOList(list) {
    return this.broadWorksMobilityServiceInput.setMNRMDDOList(list);
}

fetchPNRFDDOList() {
    return this.broadWorksMobilityServiceInput.getPNRFDDOList();
}
fetchPNRMDDOList() {
    return this.broadWorksMobilityServiceInput.getPNRMDDOList();
}
fetchMNGSDOList() {
    return this.broadWorksMobilityServiceInput.getMNGSDOList();
}
fetchMNRFDDOList() {
    return this.broadWorksMobilityServiceInput.getMNRFDDOList();
}
fetchMNRMDDOList() {
    return this.broadWorksMobilityServiceInput.getMNRMDDOList();
}
//  DesktopOptions end

fetchAllSelectedSettingsInBWMob() {
    return this.broadWorksMobilityServiceInput.getAllSelectedSettingsInBWMob();
}

fetchAllMobileDeviceNumbers() {
    return this.broadWorksMobilityServiceInput.getAllMobileDeviceNumbers();
}

fetchIsRingFixedDevicesUnderBWMobilityChecked() {
    return this.broadWorksMobilityServiceInput.getIsRingFixedDevicesUnderBWMobilityChecked();
}

fetchIsRingMobileDevicesUnderBWMobilityChecked() {
    return this.broadWorksMobilityServiceInput.getIsRingMobileDevicesUnderBWMobilityChecked();
}

fetchIsRingMobileDevicesUnderMobileIdentityChecked() {
    return this.broadWorksMobilityServiceInput.getIsRingMobileDevicesUnderMobileIdentityChecked();
}

fetchIsRingFixedDevicesUnderMobileIdentityChecked() {
    return this.broadWorksMobilityServiceInput.getIsRingFixedDevicesMobileIdentityChecked();
}

fetchAllSelectedMobileDeviceNumbers() {
    return this.broadWorksMobilityServiceInput.getAllSelectedMobileDeviceNumbers();
}

fetchIsSharedCallAppearanceActive() {
    return this.broadWorksMobilityServiceInput.getIsSharedCallAppearanceActive();
}

fetchIsBroadWorksAnywhereActive() {
    return this.broadWorksMobilityServiceInput.getIsBroadWorksAnywhereActive();
}

fetchIsExecutiveAssistantActive() {
    return this.broadWorksMobilityServiceInput.getIsExecutiveAssistantActive();
}

fetchBWMobilityStatus() {
    return this.broadWorksMobilityServiceInput.getIsBroadWorksMobilityActive();
}

fetchBWMobilityParsedJson() {
    return this.broadWorksMobilityServiceInput.getbwMobilityParsedJson();
}

fetchIsSharedCallAppearanceActiveInsideMobileNumber() {
    return this.broadWorksMobilityServiceInput.getIsSharedCallAppearanceActiveInsideMobileNumber();
}

fetchIsBroadWorksAnywhereActiveInsideMobileNumber() {
    return this.broadWorksMobilityServiceInput.getIsBroadWorksAnywhereActiveInsideMobileNumber();
}

fetchIsExecutiveAssistantActiveInsideMobileNumber() {
    return this.broadWorksMobilityServiceInput.getIsExecutiveAssistantActiveInsideMobileNumber();
}

fetchIsAlertAgentCallsChecked() {
    return this.broadWorksMobilityServiceInput.getIsAlertAgentCallsChecked();
}

fetchIsAlertClickToDialCallsChecked() {
    return this.broadWorksMobilityServiceInput.getIsAlertClickToDialCallsChecked();
}

fetchIsAlertGroupPagingCallsChecked() {
    return this.broadWorksMobilityServiceInput.getIsAlertGroupPagingCallsChecked();
}

fetchIsAnswerConfirmationRequiredChecked() {
    return this.broadWorksMobilityServiceInput.getIsAnswerConfirmationRequiredChecked();
}

fetchIsCallAnchoringChecked() {
    return this.broadWorksMobilityServiceInput.getIsCallAnchoringChecked();
}

fetchIsBroadworksCallControlChecked() {
    return this.broadWorksMobilityServiceInput.getIsBroadworksCallControlChecked();
}

fetchIsUseDiversionInhibitorChecked() {
    return this.broadWorksMobilityServiceInput.getIsUseDiversionInhibitorChecked();
}

fetchIsUseMobilityCallingLineIDChecked() {
    return this.broadWorksMobilityServiceInput.getIsUseDiversionInhibitorChecked();
}

fetchAllSelectedMobileNumbersUnderMobileIdentity() {
    return this.broadWorksMobilityServiceInput.getAllSelectedMobileNumbersUnderMobileIdentity();
}

fetchAllSelectedSettingsMobileNumber() {
    return this.broadWorksMobilityServiceInput.getAllSelectedSettingsMobileNumber();
}

}
