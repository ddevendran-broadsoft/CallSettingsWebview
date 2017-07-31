/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class ServiceRouter {

    doNotDisturbUrl: string ;
    anonymousCallRejectionUrl: string ;
    remoteOfficeUrl: string;
    callWaitingUrl: string;
    callForwardingAlwaysUrl: string;
    callForwardingBusyUrl: string;
    callForwardingNoAnswerUrl: string ;
    blockCallerIdUrl: string ;
    callForwardingNotReachableUrl: string;
    automaticCallbackUrl: string ;
    personalAssistantUrl: string;
    broadWorksMobilityUrl: string;
    simultaneousRingUrl: string;
    voiceMailUrl: string;
    voicemailGreetingUrl: string;
    broadworksMobilityMobileIdentityUrl: string;

    constructor(){}

    setDoNotDisturbUrl(doNotDisturbUrl){
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
    
    setSimultaneousRingUrl(simultaneousRingUrl) {
        this.simultaneousRingUrl= simultaneousRingUrl;
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

    getSimultaneousRingUrl(){
        return this.simultaneousRingUrl;
    }

    getVoicemailUrl() {
        return this.voiceMailUrl;
    }

    getVoicemailGreetingUrl() {
        return this.voicemailGreetingUrl;
    }

}