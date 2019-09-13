/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class ServiceRouter {

    private doNotDisturbUrl: string ;
    private anonymousCallRejectionUrl: string ;
    private remoteOfficeUrl: string;
    private callWaitingUrl: string;
    private callForwardingAlwaysUrl: string;
    private callForwardingBusyUrl: string;
    private callForwardingNoAnswerUrl: string ;
    private blockCallerIdUrl: string ;
    private callForwardingNotReachableUrl: string;
    private automaticCallbackUrl: string ;
    private personalAssistantUrl: string;
    private broadWorksMobilityUrl: string;
    private simultaneousRingUrl: string;
    private voiceMailUrl: string;
    private voicemailGreetingUrl: string;
    private broadworksMobilityMobileIdentityUrl: string;
    private callcenterUrl: string;
    private broadWorksAnywhereUrl: string;
    private sequentialRingUrl: string

    constructor() {}

    setDoNotDisturbUrl(doNotDisturbUrl) {
        this.doNotDisturbUrl = doNotDisturbUrl;
    }

    setAnonymousCallRejectionUrl(anonymousCallRejectionUrl) {
        this.anonymousCallRejectionUrl = anonymousCallRejectionUrl;
    }

    setRemoteOfficeUrl(remoteOfficeUrl) {
        this.remoteOfficeUrl = remoteOfficeUrl;
    }

    setCallWaitingUrl(callWaitingUrl) {
        this.callWaitingUrl = callWaitingUrl;
    }

    setCallForwardingAlwaysUrl(callForwardingAlwaysUrl) {
        this.callForwardingAlwaysUrl = callForwardingAlwaysUrl;
    }

    setCallForwardingBusyUrl(callForwardingBusyUrl) {
        this.callForwardingBusyUrl = callForwardingBusyUrl;
    }

    setCallForwardingNoAnswerUrl(callForwardingNoAnswerUrl) {
        this.callForwardingNoAnswerUrl = callForwardingNoAnswerUrl;
    }

    setBlockCallerIdUrl(blockCallerIdUrl) {
        this.blockCallerIdUrl = blockCallerIdUrl;
    }

    setCallForwardingNotReachableUrl(callForwardingNotReachableUrl) {
        this.callForwardingNotReachableUrl = callForwardingNotReachableUrl;
    }

    setAutomaticCallbackUrl(automaticCallbackUrl) {
        this.automaticCallbackUrl = automaticCallbackUrl;
    }

    setPersonalAssistantUrl(personalAssistantUrl) {
        this.personalAssistantUrl = personalAssistantUrl;
    }

    setBroadWorksMobilityUrl(broadWorksMobilityUrl) {
        this.broadWorksMobilityUrl = broadWorksMobilityUrl;
    }

    setSequentialRingUrl(sequentialRingUrl) {
        this.sequentialRingUrl = sequentialRingUrl;
    }

    setSimultaneousRingUrl(simultaneousRingUrl) {
        this.simultaneousRingUrl = simultaneousRingUrl;
    }

    setVoicemailUrl(voiceMailUrl) {
        this.voiceMailUrl = voiceMailUrl;
    }

    setVoicemailGreetingUrl(voicemailGreetingUrl) {
        this.voicemailGreetingUrl = voicemailGreetingUrl;
    }
    setBroadworksMobilityMobileIdentityUrl(broadworksMobilityMobileIdentityUrl) {
        this.broadworksMobilityMobileIdentityUrl = broadworksMobilityMobileIdentityUrl;
    }

    setCallCenterUrl(callcenterUrl) {
        this.callcenterUrl = callcenterUrl;
    }

    setBroadWorksAnywhereUrl(broadWorksAnywhereUrl) {
        this.broadWorksAnywhereUrl = broadWorksAnywhereUrl;
    }

    getDoNotDisturbUrl() {
        return this.doNotDisturbUrl;
    }

    getAnonymousCallRejectionUrl() {
        return this.anonymousCallRejectionUrl;
    }

    getRemoteOfficeUrl() {
        return this.remoteOfficeUrl;
    }

    getCallWaitingUrl() {
        return this.callWaitingUrl;
    }

    getCallForwardingAlwaysUrl() {
        return this.callForwardingAlwaysUrl;
    }

    getCallForwardingBusyUrl() {
        return this.callForwardingBusyUrl;
    }

    getCallForwardingNoAnswerUrl() {
        return this.callForwardingNoAnswerUrl;
    }

    getCallForwardingNotReachableUrl() {
        return this.callForwardingNotReachableUrl;
    }

    getAutomaticCallbackUrl() {
        return this.automaticCallbackUrl;
    }

    getBlockCallerIdUrl() {
        return this.blockCallerIdUrl;
    }

    getPersonalAssistantUrl() {
        return this.personalAssistantUrl;
    }

    getBroadWorksMobilityUrl() {
        return this.broadWorksMobilityUrl;
    }

    getSequentialRingUrl() {
        return this.sequentialRingUrl;
    }

    getSimultaneousRingUrl() {
        return this.simultaneousRingUrl;
    }

    getVoicemailUrl() {
        return this.voiceMailUrl;
    }

    getVoicemailGreetingUrl() {
        return this.voicemailGreetingUrl;
    }

    getCallCenterUrl() {
        return this.callcenterUrl;
    }

    getBroadWorksAnywhereUrl() {
        return this.broadWorksAnywhereUrl;
    }

}
