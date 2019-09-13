/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class MasterServiceListVisible {

    private broadWorksAnywhereVisible = true;

    private acrVisible = true;
    private cfaVisible = true;
    private cfbVisible = true;
    private cfnaVisible = true;
    private cfnrVisible = true;
    private bcidVisible = true;
    private dndVisible = true;
    private roVisible = true;
    private cwVisible = true;
    private simultaneousRingVisible = true;
    private sequentialRingVisible = true;
    private automaticCallbackVisible = true;
    private voicemailVisible = true;
    private bwMobilityVisible = true;
    private PAVisible = true;
    private callcenterVisible = true;

    constructor() { }

    setAcrVisible(acrVisible) {
        this.acrVisible = acrVisible;
    }

    getAcrVisible() {
        return this.acrVisible;
    }

    setCfaVisible(cfaVisible) {
        this.cfaVisible = cfaVisible;
    }

    getCfaVisible() {
        return this.cfaVisible;
    }

    setCfbVisible(cfbVisible) {
        this.cfbVisible = cfbVisible;
    }

    getCfbVisible() {
        return this.cfbVisible;
    }

    setCfnaVisible(cfnaVisible) {
        this.cfnaVisible = cfnaVisible;
    }

    getCfnaVisible() {
        return this.cfnaVisible;
    }

    setCfnrVisible(cfnrVisible) {
        this.cfnrVisible = cfnrVisible;
    }

    getCfnrVisible() {
        return this.cfnrVisible;
    }

    setBcidVisible(bcidVisible) {
        this.bcidVisible = bcidVisible;
    }

    getBcidVisible() {
        return this.bcidVisible;
    }

    setDndVisible(dndVisible) {
        this.dndVisible = dndVisible;
    }

    getDndVisible() {
        return this.dndVisible;
    }

    setRoVisible(roVisible) {

        this.roVisible = roVisible;
    }

    setCwVisible(cwVisible) {

        this.cwVisible = cwVisible;
    }

    getCwVisible() {
        return this.cwVisible;
    }

    getRoVisible() {
        return this.roVisible;
    }

    getSequentialRingVisible() {
        return this.sequentialRingVisible;
    }

    setSequentialRingVisible(sequentialRingVisible) {
        this.sequentialRingVisible = sequentialRingVisible;
    }

    setSimultaneousRingVisible(simultaneousRingVisible) {
        this.simultaneousRingVisible = simultaneousRingVisible;
    }

    getSimultaneousRingVisible() {
        return this.simultaneousRingVisible;
    }

    setAutomaticCallbackVisible(automaticCallbackVisible) {
        this.automaticCallbackVisible = automaticCallbackVisible;
    }

    getAutomaticCallbackVisible() {
        return this.automaticCallbackVisible;
    }

    setVoicemailVisible(voicemailVisible) {
        this.voicemailVisible = voicemailVisible;
    }

    getVoicemailVisible() {
        return this.voicemailVisible;
    }

    setBWMobilityVisible(bwMobilityVisible) {
        this.bwMobilityVisible = bwMobilityVisible;
    }

    getBWMobilityVisible() {
        return this.bwMobilityVisible;
    }

    setPAVisible(PAVisible) {
        this.PAVisible = PAVisible;
    }

    getPAVisible() {
        return this.PAVisible;
    }

    setcallCenterVisible(callcenterVisible) {
        this.callcenterVisible = callcenterVisible;
    }

    getCallCenterVisible() {
        return this.callcenterVisible;
    }

    setBroadWorksAnywhereVisible(broadWorksAnywhereVisible) {
        this.broadWorksAnywhereVisible = broadWorksAnywhereVisible;
    }

    getBroadWorksAnywhereVisible() {
        return this.broadWorksAnywhereVisible;
    }

}
