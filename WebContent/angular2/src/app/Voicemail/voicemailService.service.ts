/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject, Component } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';

@Injectable()

export class VoicemailService {

    private res: Response;
    private voicemailBody;
    private headers: Headers = new Headers();   
    customizedTextJson = window['customizedTexts'];

    constructor(private http: Http, private httpServices: HttpServices, private voicemailServiceInput: VoicemailServiceInput) { }

    getVoicemailService(voicemailUrl, postVoicemailGet) {

        this.httpServices.httpGetRequest(voicemailUrl)
            .subscribe((res) => {
                var voicemailParsedJson = res.json();

                this.voicemailServiceInput.setActive(voicemailParsedJson["VoiceMessaging"]["active"]["$"] == "true");

                this.voicemailServiceInput.setAlwaysRedirectToVoiceMail(voicemailParsedJson["VoiceMessaging"]["alwaysRedirectToVoiceMail"]["$"] == "true");
                this.voicemailServiceInput.setBusyRedirectToVoiceMail(voicemailParsedJson["VoiceMessaging"]["busyRedirectToVoiceMail"]["$"] == "true");
                this.voicemailServiceInput.setNoAnswerRedirectToVoiceMail(voicemailParsedJson["VoiceMessaging"]["noAnswerRedirectToVoiceMail"]["$"] == "true");

                this.voicemailServiceInput.setProcessing(voicemailParsedJson["VoiceMessaging"]["processing"]["$"]);
                this.voicemailServiceInput.setUnifiedMessagingChecked(voicemailParsedJson["VoiceMessaging"]["processing"]["$"] == "Unified Voice and Email Messaging");
                this.voicemailServiceInput.setUsePhoneMessageWaitingIndicator(voicemailParsedJson["VoiceMessaging"]["usePhoneMessageWaitingIndicator"]["$"] == "true");
                this.voicemailServiceInput.setVoiceMessageDeliveryEmailAddress(voicemailParsedJson["VoiceMessaging"]["voiceMessageDeliveryEmailAddress"]["$"]);

                this.voicemailServiceInput.setSendVoiceMessageNotifyEmail(voicemailParsedJson["VoiceMessaging"]["sendVoiceMessageNotifyEmail"]["$"] == "true");
                this.voicemailServiceInput.setNotifyEmailAddress(voicemailParsedJson["VoiceMessaging"]["voiceMessageNotifyEmailAddress"]["$"]);

                this.voicemailServiceInput.setSendCarbonCopyVoiceMessage(voicemailParsedJson["VoiceMessaging"]["sendCarbonCopyVoiceMessage"]["$"] == "true");
                this.voicemailServiceInput.setVoiceMessageCarbonCopyEmailAddress(voicemailParsedJson["VoiceMessaging"]["voiceMessageCarbonCopyEmailAddress"]["$"]);

                this.voicemailServiceInput.setTransferOnZeroToPhoneNumber(voicemailParsedJson["VoiceMessaging"]["transferOnZeroToPhoneNumber"]["$"] == "true");
                this.voicemailServiceInput.setTransferPhoneNumber(voicemailParsedJson["VoiceMessaging"]["transferPhoneNumber"]["$"]);

                postVoicemailGet(voicemailParsedJson);

            }, (err) => {
                var voicemailParsedJson = null;
                postVoicemailGet(voicemailParsedJson);
            });
    }

    constructInitialBody() {
        this.voicemailBody = '<?xml version="1.0" encoding="UTF-8"?><VoiceMessaging  xmlns="http://schema.broadsoft.com/xsi">';

    }

    constructFinalBody() {

        this.voicemailBody = this.voicemailBody + '</VoiceMessaging>';
    }

    putVoicemailService(voicemailUrl, isVoicemailChecked, postVoicemailPut) {

        this.constructInitialBody();
        this.voicemailBody = this.voicemailBody + '<active>' + isVoicemailChecked + '</active>';
        this.constructFinalBody();

        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setActive(isVoicemailChecked);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });


    }

    putMessageArrivesService(voicemailUrl,processingType,deliveryEmailAddress,isMessageWaitingIndicatorChecked, postVoicemailPut) {

        this.constructInitialBody();
        this.voicemailBody = this.voicemailBody + '<processing>' + processingType + '</processing>';

        if (deliveryEmailAddress) {
            this.voicemailBody = this.voicemailBody + '<voiceMessageDeliveryEmailAddress>' + deliveryEmailAddress + '</voiceMessageDeliveryEmailAddress>';
        }
        else {
            this.voicemailBody = this.voicemailBody + '<voiceMessageDeliveryEmailAddress xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        if (this.fetchUnifiedMessagingChecked()) {
            this.voicemailBody = this.voicemailBody + '<usePhoneMessageWaitingIndicator>' + isMessageWaitingIndicatorChecked + '</usePhoneMessageWaitingIndicator>';
        }

        this.constructFinalBody();
        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setProcessing(processingType);
                this.voicemailServiceInput.setVoiceMessageDeliveryEmailAddress(deliveryEmailAddress);
                this.voicemailServiceInput.setUsePhoneMessageWaitingIndicator(isMessageWaitingIndicatorChecked);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });

    }

    putSendCallsToVoicemailService(voicemailUrl, isSendCallAlwaysSelected,isSendCallBusySelected,  isSendCallNoAnswerSelected, postVoicemailPut) {

        this.constructInitialBody();

        this.voicemailBody = this.voicemailBody + '<alwaysRedirectToVoiceMail>' + isSendCallAlwaysSelected + '</alwaysRedirectToVoiceMail><busyRedirectToVoiceMail>' + isSendCallBusySelected + '</busyRedirectToVoiceMail><noAnswerRedirectToVoiceMail>' + isSendCallNoAnswerSelected + '</noAnswerRedirectToVoiceMail>';

        this.constructFinalBody();
        
        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setAlwaysRedirectToVoiceMail(isSendCallAlwaysSelected);
                this.voicemailServiceInput.setBusyRedirectToVoiceMail(isSendCallBusySelected);
                this.voicemailServiceInput.setNoAnswerRedirectToVoiceMail(isSendCallNoAnswerSelected);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });

    }

    putEmailNotificationService(voicemailUrl, isEmailNotificationChecked, notifyEmailAddress, postVoicemailPut) {
        this.constructInitialBody();

        if (notifyEmailAddress) {
            this.voicemailBody = this.voicemailBody + '<sendVoiceMessageNotifyEmail>' + isEmailNotificationChecked + '</sendVoiceMessageNotifyEmail><voiceMessageNotifyEmailAddress>' + notifyEmailAddress + '</voiceMessageNotifyEmailAddress>';
        }
        else {
            this.voicemailBody = this.voicemailBody + '<sendVoiceMessageNotifyEmail>' + isEmailNotificationChecked + '</sendVoiceMessageNotifyEmail><voiceMessageNotifyEmailAddress xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        this.constructFinalBody();
        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setSendVoiceMessageNotifyEmail(isEmailNotificationChecked);
                this.voicemailServiceInput.setNotifyEmailAddress(notifyEmailAddress);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });
    }


    putEmailCarbonCopyService(voicemailUrl, isEmailCarbonCopyChecked, carbonCopyEmailAddress, postVoicemailPut) {
        this.constructInitialBody();

        if (carbonCopyEmailAddress) {
            this.voicemailBody = this.voicemailBody + '<sendCarbonCopyVoiceMessage>' + isEmailCarbonCopyChecked + '</sendCarbonCopyVoiceMessage><voiceMessageCarbonCopyEmailAddress>' + carbonCopyEmailAddress + '</voiceMessageCarbonCopyEmailAddress>';
        }
        else {
            this.voicemailBody = this.voicemailBody + '<sendCarbonCopyVoiceMessage>' + isEmailCarbonCopyChecked + '</sendCarbonCopyVoiceMessage><voiceMessageCarbonCopyEmailAddress xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }


        this.constructFinalBody();
        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setSendCarbonCopyVoiceMessage(isEmailCarbonCopyChecked);
                this.voicemailServiceInput.setVoiceMessageCarbonCopyEmailAddress(carbonCopyEmailAddress);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });
    }


    putTransferToNumberService(voicemailUrl, isTransferChecked, transferPhoneNumber, postVoicemailPut) {

        this.constructInitialBody();

        if (transferPhoneNumber) {
            this.voicemailBody = this.voicemailBody + '<transferOnZeroToPhoneNumber>' + isTransferChecked + '</transferOnZeroToPhoneNumber><transferPhoneNumber>' + transferPhoneNumber + '</transferPhoneNumber>';
        }
        else {
            this.voicemailBody = this.voicemailBody + '<transferOnZeroToPhoneNumber>' + isTransferChecked + '</transferOnZeroToPhoneNumber><transferPhoneNumber xs:nil="true" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"/>';
        }

        this.constructFinalBody();
        this.httpServices.httpPutRequest(voicemailUrl, this.voicemailBody)
            .subscribe((res) => {
                this.voicemailServiceInput.setTransferOnZeroToPhoneNumber(isTransferChecked);
                this.voicemailServiceInput.setTransferPhoneNumber(transferPhoneNumber);
                postVoicemailPut(res);
            }, (err) => {
                postVoicemailPut(err);
            });
    }

    getRingsService(voicemailGreetingUrl, postVoicemailGreetingGet) {
        this.httpServices.httpGetRequest(voicemailGreetingUrl)
            .subscribe((res) => {
                var voicemailGreetingsParsedJson = res.json();

                this.voicemailServiceInput.setSendCallsNumberOfRings(voicemailGreetingsParsedJson["VoiceMessagingGreetings"]["noAnswerNumberOfRings"]["$"]);

                postVoicemailGreetingGet(voicemailGreetingsParsedJson);

            }, (err) => {
                var voicemailGreetingsParsedJson = null;
                postVoicemailGreetingGet(voicemailGreetingsParsedJson);
            });
    }

    putRingsService(voicemailGreetingUrl, voicemailRingSelected, postVoicemailGreetingPut) {

            if(voicemailRingSelected == this.customizedTextJson.voice_management.none){
               voicemailRingSelected = '0';
            }
        var body = '<?xml version="1.0" encoding="ISO-8859-1"?> <VoiceMessagingGreetings xmlns="http://schema.broadsoft.com/xsi" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';

            body = body + '<noAnswerNumberOfRings>' + voicemailRingSelected + '</noAnswerNumberOfRings>';

        body = body + '</VoiceMessagingGreetings>'
        this.httpServices.httpPutRequest(voicemailGreetingUrl, body)
            .subscribe((res) => {
                this.voicemailServiceInput.setSendCallsNumberOfRings(voicemailRingSelected);
                postVoicemailGreetingPut(res);
            }, (err) => {
                postVoicemailGreetingPut(err);
            });
    }

    fetchIsVoicemailServiceActive() {
        return (this.voicemailServiceInput.getIsActive());
    }

    fetchIsEmailNotificationChecked() {
        return (this.voicemailServiceInput.getIsSendVoiceMessageNotifyEmail());
    }


    fetchNotifyEmailAddress() {
        return (this.voicemailServiceInput.getNotifyEmailAddress());
    }

    fetchIsEmailCarbonCopyChecked() {
        return (this.voicemailServiceInput.getIsSendCarbonCopyVoiceMessage());
    }


    fetchCarbonCopyEmailAddress() {
        return (this.voicemailServiceInput.getVoiceMessageCarbonCopyEmailAddress());
    }

    fetchIsTransferToPhoneNumberChecked() {
        return (this.voicemailServiceInput.getIsTransferOnZeroToPhoneNumber());
    }

    fetchTransferNumber() {
        return (this.voicemailServiceInput.getTransferPhoneNumber());
    }

    fetchProcessing() {
        return (this.voicemailServiceInput.getProcessing());
    }

    fetchUnifiedMessagingChecked() {
        return (this.voicemailServiceInput.getUnifiedMessagingChecked());
    }
    fetchMessageWaitingIndicator() {
        return (this.voicemailServiceInput.getUsePhoneMessageWaitingIndicator());
    }

    fetchDeliveryMailAddress() {
        return (this.voicemailServiceInput.getVoiceMessageDeliveryEmailAddress());
    }

    fetchIsSendCallsAlwaysChecked() {
        return (this.voicemailServiceInput.getIsAlwaysRedirectToVoiceMail());
    }

    fetchIsSendCallsBusyChecked() {
        return (this.voicemailServiceInput.getIsBusyRedirectToVoiceMail());
    }

    fetchIsSendCallsNoAnswerChecked() {
        return (this.voicemailServiceInput.getIsNoAnswerRedirectToVoiceMail());
    }

    fetchSendCallsRings() {
        return (this.voicemailServiceInput.getSendCallsRings());
    }

}