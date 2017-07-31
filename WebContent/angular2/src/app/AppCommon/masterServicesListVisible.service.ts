/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';

@Injectable()

export class MasterServiceListVisible {

    private acrVisible: boolean = true;
    private cfaVisible: boolean = true;
    private cfbVisible: boolean = true;
    private cfnaVisible: boolean = true;
    private cfnrVisible: boolean = true;
    private bcidVisible: boolean = true; 
    private dndVisible: boolean = true;
    private roVisible: boolean = true;
    private cwVisible: boolean = true;
    private simultaneousRingVisible: boolean = true;
    private automaticCallbackVisible: boolean = true; 
    private voicemailVisible: boolean = true;
    private bwMobilityVisible: boolean = true;

    constructor(){}

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

}