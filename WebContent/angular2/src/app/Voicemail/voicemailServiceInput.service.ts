/* Copyright © 2017 BroadSoft Inc. */

import { Injectable, Inject } from '@angular/core';

@Injectable()
export class VoicemailServiceInput {
    private active: boolean;
    private alwaysRedirectToVoiceMail: boolean;
    private busyRedirectToVoiceMail: boolean;
    private noAnswerRedirectToVoiceMail: boolean;
    private sendCallsRings: string;

    private processing: string;
    private unifiedMessagingChecked: string;
    private usePhoneMessageWaitingIndicator: boolean;
    private voiceMessageDeliveryEmailAddress: string;

    private sendVoiceMessageNotifyEmail: boolean;
    private notifyEmailAddress: string;
    private transferOnZeroToPhoneNumber: boolean;
    private transferPhoneNumber: string = "";
    private sendCarbonCopyVoiceMessage: boolean;
    private voiceMessageCarbonCopyEmailAddress: string = "";

    constructor() { }

    setActive(active) {
        this.active = active;
    }
    setAlwaysRedirectToVoiceMail(alwaysRedirectToVoiceMail) {
        this.alwaysRedirectToVoiceMail = alwaysRedirectToVoiceMail;
    }
    setBusyRedirectToVoiceMail(flag: boolean) {
        this.busyRedirectToVoiceMail = flag;
    }
    setNoAnswerRedirectToVoiceMail(busyRedirectToVoiceMail) {
        this.noAnswerRedirectToVoiceMail = busyRedirectToVoiceMail;
    }
    setSendCallsNumberOfRings(sendCallsRings) {
        this.sendCallsRings = sendCallsRings;
    }

    setProcessing(processing) {
        this.processing = processing;
    }

    setUnifiedMessagingChecked(unifiedMessagingChecked) {
        this.unifiedMessagingChecked = unifiedMessagingChecked;
    }
    setUsePhoneMessageWaitingIndicator(usePhoneMessageWaitingIndicator) {
        this.usePhoneMessageWaitingIndicator = usePhoneMessageWaitingIndicator;
    }
    setVoiceMessageDeliveryEmailAddress(voiceMessageDeliveryEmailAddress) {
        this.voiceMessageDeliveryEmailAddress = voiceMessageDeliveryEmailAddress;
    }
    setSendVoiceMessageNotifyEmail(sendVoiceMessageNotifyEmail) {
        this.sendVoiceMessageNotifyEmail = sendVoiceMessageNotifyEmail;
    }
    setNotifyEmailAddress(notifyEmailAddress) {
        this.notifyEmailAddress = notifyEmailAddress;
    }
    setSendCarbonCopyVoiceMessage(sendCarbonCopyVoiceMessage) {
        this.sendCarbonCopyVoiceMessage = sendCarbonCopyVoiceMessage;
    }
    setVoiceMessageCarbonCopyEmailAddress(voiceMessageCarbonCopyEmailAddress) {
        this.voiceMessageCarbonCopyEmailAddress = voiceMessageCarbonCopyEmailAddress;
    }
    setTransferOnZeroToPhoneNumber(transferOnZeroToPhoneNumber) {
        this.transferOnZeroToPhoneNumber = transferOnZeroToPhoneNumber;
    }
    setTransferPhoneNumber(transferPhoneNumber) {
        this.transferPhoneNumber = transferPhoneNumber;
    }


    getIsActive() {
        return this.active;
    }
    getIsAlwaysRedirectToVoiceMail() {
        return this.alwaysRedirectToVoiceMail;
    }
    getIsBusyRedirectToVoiceMail() {
        return this.busyRedirectToVoiceMail;
    }
    getIsNoAnswerRedirectToVoiceMail() {
        return this.noAnswerRedirectToVoiceMail;
    }
    getSendCallsRings() {
        return this.sendCallsRings;
    }
    getProcessing() {
        return this.processing;
    }
    getUnifiedMessagingChecked() {
        return this.unifiedMessagingChecked;
    }
    getUsePhoneMessageWaitingIndicator() {
        return this.usePhoneMessageWaitingIndicator;
    }
    getVoiceMessageDeliveryEmailAddress() {
        return this.voiceMessageDeliveryEmailAddress;
    }
    getIsSendVoiceMessageNotifyEmail() {
        return this.sendVoiceMessageNotifyEmail;
    }
    getNotifyEmailAddress() {
        return this.notifyEmailAddress;
    }
    getIsSendCarbonCopyVoiceMessage() {
        return this.sendCarbonCopyVoiceMessage;
    }
    getVoiceMessageCarbonCopyEmailAddress() {
        return this.voiceMessageCarbonCopyEmailAddress;
    }
    getIsTransferOnZeroToPhoneNumber() {
        return this.transferOnZeroToPhoneNumber;
    }
    getTransferPhoneNumber() {
        return this.transferPhoneNumber;
    }

}