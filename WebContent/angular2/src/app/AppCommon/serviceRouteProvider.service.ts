/* Copyright © 2017 BroadSoft Inc. */

import { ServiceRouter } from 'app/AppCommon/serviceRouter.service';
import { Injectable } from '@angular/core';

@Injectable()

/*This class initializes all the service URLs that is to be accessed by the app to fetch and update services' data*/
export class ServiceRouteProvider {

    baseUrl: string = window['xsiActionsBaseURL'] + "/v2.0/user/" + window['callSettingsHeroInput'].userId + "/services/";
    profileUrl: string = window['xsiActionsBaseURL'] + "/v2.0/user/" + window['callSettingsHeroInput'].userId + "/profile/";
    doNotDisturbUrl: string ;
    anonymousCallRejectionUrl: string ;
    remoteOfficeUrl: string ;
    callWaitingUrl: string ;
    callForwardingAlwaysUrl: string ;
    callForwardingBusyUrl: string ;
    callForwardingNoAnswerUrl: string ;
    blockCallerIdUrl: string ;
    callForwardingNotReachableUrl: string ;
    automaticCallbackUrl: string;
    personalAssistantUrl: string;
    broadWorksMobilityUrl: string;
    simultaneousRingUrl: string;
    voiceMailUrl: string;
    voicemailGreetingUrl: string;

    masterServicesList = [];

    constructor(private serviceRouter: ServiceRouter) { }

    initializeServiceRoutes(masterServicesList) {
        
        this.masterServicesList = masterServicesList;
        this.masterServicesList.forEach(service => {

            switch(service.name) {

                case "Do Not Disturb" : this.doNotDisturbUrl = this.baseUrl + "donotdisturb?";
                                        this.serviceRouter.setDoNotDisturbUrl(this.doNotDisturbUrl);
                                        break;

                case "Automatic Callback" : this.automaticCallbackUrl = this.baseUrl + "automaticcallback?";
                                        this.serviceRouter.setAutomaticCallbackUrl(this.automaticCallbackUrl);
                                        break;

                case "Remote Office" : this.remoteOfficeUrl = this.baseUrl + "remoteoffice?";
                                        this.serviceRouter.setRemoteOfficeUrl(this.remoteOfficeUrl);
                                        break;

                case "Call Waiting" : this.callWaitingUrl = this.baseUrl + "callwaiting?";
                                        this.serviceRouter.setCallWaitingUrl(this.callWaitingUrl);
                                        break;

                case "Anonymous Call Rejection" : this.anonymousCallRejectionUrl = this.baseUrl + "anonymouscallrejection?";
                                                  this.serviceRouter.setAnonymousCallRejectionUrl(this.anonymousCallRejectionUrl);
                                                  break;

                case "Call Forwarding Always" : this.callForwardingAlwaysUrl = this.baseUrl + "callforwardingalways?";
                                                this.serviceRouter.setCallForwardingAlwaysUrl(this.callForwardingAlwaysUrl);
                                                break;

                case "Call Forwarding Busy" : this.callForwardingBusyUrl = this.baseUrl + "callforwardingbusy?";
                                              this.serviceRouter.setCallForwardingBusyUrl(this.callForwardingBusyUrl);
                                              break;

                case "Call Forwarding No Answer" : this.callForwardingNoAnswerUrl = this.baseUrl + "callforwardingnoanswer?";
                                                   this.serviceRouter.setCallForwardingNoAnswerUrl(this.callForwardingNoAnswerUrl);
                                                   break;

                case "Calling Line ID Delivery Blocking" : this.blockCallerIdUrl = this.baseUrl + "callinglineiddeliveryblocking?";
                                                           this.serviceRouter.setBlockCallerIdUrl(this.blockCallerIdUrl);
                                                           break;

                case "Call Forwarding Not Reachable" : this.callForwardingNotReachableUrl = this.baseUrl + "callforwardingnotreachable?";
                                                       this.serviceRouter.setCallForwardingNotReachableUrl(this.callForwardingNotReachableUrl);
                                                       break;

                case "Personal Assistant" : this.personalAssistantUrl = this.baseUrl + "personalassistant?";
                                            this.serviceRouter.setPersonalAssistantUrl(this.personalAssistantUrl);
                                            break;

                case "BroadWorks Mobility" : this.broadWorksMobilityUrl = this.baseUrl + "broadworksmobility";
                                             this.serviceRouter.setBroadWorksMobilityUrl(this.broadWorksMobilityUrl);
                                             break;

                case "Simultaneous Ring Personal" : this.simultaneousRingUrl = this.baseUrl + "simultaneousringpersonal?";
                                                    this.serviceRouter.setSimultaneousRingUrl(this.simultaneousRingUrl);
                                                    break;            

                case "Voice Messaging User": this.voiceMailUrl = this.baseUrl + "voicemessaging?";
                    this.voicemailGreetingUrl = this.baseUrl + "voicemessaging/greetings?";
                    this.serviceRouter.setVoicemailUrl(this.voiceMailUrl);
                    this.serviceRouter.setVoicemailGreetingUrl(this.voicemailGreetingUrl);
                    break;
            }

        });

    }

    fetchBroadWorksMobilityUrl() {
        return this.serviceRouter.getBroadWorksMobilityUrl();
    }

    fetchServicesListUrl() {
        return this.baseUrl;
    }

    fetchProfileUrl() {
        return this.profileUrl;
    }

    fetchDoNotDisturbUrl() {
        return this.serviceRouter.getDoNotDisturbUrl();
    }

    fetchRemoteOfficeUrl() {
        return this.serviceRouter.getRemoteOfficeUrl();
    }

    fetchCallWaitingUrl() {
        return this.serviceRouter.getCallWaitingUrl();
    }

    fetchAnonymousCallRejectionUrl() {
        return this.serviceRouter.getAnonymousCallRejectionUrl();
    }

    fetchCallForwardingAlwaysUrl() {
        return this.serviceRouter.getCallForwardingAlwaysUrl();
    }

    fetchCallForwardingBusyUrl() {
        return this.serviceRouter.getCallForwardingBusyUrl();
    }

    fetchCallForwardingNoAnswerUrl() {
        return this.serviceRouter.getCallForwardingNoAnswerUrl();
    }

    fetchCallForwardingNotReachableUrl() {
        return this.serviceRouter.getCallForwardingNotReachableUrl();
    }

    fetchBlockCallerIdUrl() {
        return this.serviceRouter.getBlockCallerIdUrl();
    }

    fetchAutomaticCallbackUrl() {
        return this.serviceRouter.getAutomaticCallbackUrl();
    }
    fetchSimultaneousRingUrl() {
        return this.serviceRouter.getSimultaneousRingUrl();
    }
    fetchVoicemailUrl() {
        return this.serviceRouter.getVoicemailUrl();
    }
    fetchVoicemailGreetingUrl() {
        return this.serviceRouter.getVoicemailGreetingUrl();
    }
}