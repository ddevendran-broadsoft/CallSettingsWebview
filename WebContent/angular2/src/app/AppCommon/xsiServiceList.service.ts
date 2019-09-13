/* Copyright © 2017 BroadSoft Inc. */

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIMasterServicesList } from 'app/AppCommon/xsiMasterServicesList.service';
import { MasterServiceListVisible } from 'app/AppCommon/masterServicesListVisible.service';
@Injectable()

/* This class prepares the master list of the services that is to be displayed in the app*/
export class XSIServices {
    broadWorksAnywhereVisible: any;

    private res: Response;
    private headers: Headers = new Headers();
    private xsiServicesList: string;
    private masterServicesList = [];
    private hiddenServicesList = [];

    acrVisible = false;
    cfVisible = false;
    cfaVisible = false;
    cfbVisible = false;
    cfnaVisible = false;
    cfnrVisible = false;
    bcidVisible = false;
    dndVisible = false;
    roVisible = false;
    cwVisible = false;
    simultaneousRingVisible = false;
    sequentialRingVisible = false;
    automaticCallbackVisible = false;
    voicemailVisible = false;
    bwMobilityVisible = false;
    personalAssistantVisible = false;
    callCenterQueueVisible = false;

    constructor (private masterServicesListVisible: MasterServiceListVisible, private xsiMasterServicesList: XSIMasterServicesList,
      private serviceRouteProvider: ServiceRouteProvider, private httpservices: HttpServices) { }

    getXSIService(xsiUrl, postXSIGet) {
        this.httpservices.httpGetRequest(xsiUrl)
            .subscribe((res) => {
                this.xsiServicesList = JSON.stringify(res.json());
                console.log('XSI Services List: ', this.xsiServicesList);
                const userServicesList = JSON.parse(this.xsiServicesList);

                const heroAppServicesList = window['callSettingsHeroInput'];
                if (userServicesList['Services']['service']) {
                    if (userServicesList['Services']['service'].constructor === Array) {
                        userServicesList['Services']['service'].forEach(element1 => {
                        this.masterServicesList.push({
                            'name': element1.name.$,
                            'visible': true,
                        });

                    });
                    } else if (userServicesList['Services']['service'].constructor === Object) {
                        this.masterServicesList.push({

                            'name': userServicesList.Services.service.name.$,
                            'visible': true,
                        });
                    }

                }

                let isCallCenterVisible = false;
                if (heroAppServicesList.services) {

                    this.masterServicesList.forEach(element => {

                        heroAppServicesList.services.forEach(heroElement => {

                            if (element.name === heroElement.name && heroElement.visible === false) {

                                element.visible = false;
                            }

                            if (element.name === heroElement.name) {

                                console.log('Checking on : ' + element.name + ' , with boolean set to : ' + element.visible);
                                switch (element.name) {
                                    case 'Do Not Disturb':
                                        this.dndVisible = element.visible;
                                        this.masterServicesListVisible.setDndVisible(element.visible);
                                        break;

                                    case 'Call Forwarding Always':
                                        this.cfaVisible = element.visible;
                                        this.masterServicesListVisible.setCfaVisible(element.visible);
                                        break;

                                    case 'Call Forwarding Busy':
                                        this.cfbVisible = element.visible;
                                        this.masterServicesListVisible.setCfbVisible(element.visible);
                                        break;

                                    case 'Call Forwarding No Answer':
                                        this.cfnaVisible = element.visible;
                                        this.masterServicesListVisible.setCfnaVisible(element.visible);
                                        break;

                                    case 'Call Forwarding Not Reachable':
                                        this.cfnrVisible = element.visible;
                                        this.masterServicesListVisible.setCfnrVisible(element.visible);
                                        break;

                                    case 'Automatic Callback':
                                        this.automaticCallbackVisible = element.visible;
                                        this.masterServicesListVisible.setAutomaticCallbackVisible(element.visible);
                                        break;

                                    case 'Anonymous Call Rejection':
                                        this.acrVisible = element.visible;
                                        this.masterServicesListVisible.setAcrVisible(element.visible);
                                        break;

                                    case 'Calling Line ID Delivery Blocking':
                                        this.bcidVisible = element.visible;
                                        this.masterServicesListVisible.setBcidVisible(element.visible);
                                        break;

                                    case 'Remote Office':
                                        this.roVisible = element.visible;
                                        this.masterServicesListVisible.setRoVisible(element.visible);
                                        break;

                                    case 'Call Waiting':
                                        this.cwVisible = element.visible;
                                        this.masterServicesListVisible.setCwVisible(element.visible);
                                        break;

                                    case 'Sequential Ring':
                                        this.sequentialRingVisible = element.visible;
                                        this.masterServicesListVisible.setSequentialRingVisible(element.visible);
                                        break;

                                    case 'Simultaneous Ring Personal':
                                        this.simultaneousRingVisible = element.visible;
                                        this.masterServicesListVisible.setSimultaneousRingVisible(element.visible);
                                        break;

                                    case 'Voice Messaging User':
                                        this.voicemailVisible = element.visible;
                                        this.masterServicesListVisible.setVoicemailVisible(element.visible);
                                        break;

                                    case 'BroadWorks Mobility':
                                        this.bwMobilityVisible = element.visible;
                                        this.masterServicesListVisible.setBWMobilityVisible(element.visible);
                                        break;

                                    case 'Personal Assistant' :
                                            this.personalAssistantVisible = element.visible;
                                            this.masterServicesListVisible.setPAVisible(element.visible);
                                        break;

                                    case 'Call Center - Standard' :
                                            this.callCenterQueueVisible = element.visible;
                                            if (this.callCenterQueueVisible) {
                                                isCallCenterVisible = true;
                                            }
                                            this.masterServicesListVisible.setcallCenterVisible(element.visible);
                                            break;

                                    case 'Call Center - Basic' :
                                            this.callCenterQueueVisible = element.visible;
                                            if (this.callCenterQueueVisible) {
                                                isCallCenterVisible = true;
                                            }
                                            this.masterServicesListVisible.setcallCenterVisible(element.visible);
                                            break;
                                    case 'Call Center - Premium' :
                                            this.callCenterQueueVisible = element.visible;
                                            if (this.callCenterQueueVisible) {
                                                isCallCenterVisible = true;
                                            }
                                            this.masterServicesListVisible.setcallCenterVisible(element.visible);
                                            break;

                                    case 'BroadWorks Anywhere' :
                                            this.broadWorksAnywhereVisible = element.visible;
                                            this.masterServicesListVisible.setBroadWorksAnywhereVisible(element.visible);
                                            break;

                                    default:
                                        console.log('No Need to serve this service: ', element.name);
                                        break;
                                }
                            }

                        });

                    });
                }

                if (isCallCenterVisible) {
                    this.masterServicesListVisible.setcallCenterVisible(true);
                }

                this.masterServicesList.forEach(element => {
                    console.log('>>>>>>>>>>>>>>>>>>>Name: ', element.name)
                });



                this.xsiMasterServicesList.setXSIMasterServicesList(this.masterServicesList);
                this.serviceRouteProvider.initializeServiceRoutes(this.masterServicesList);
                postXSIGet(this.masterServicesList);



            }, (err) => {
                console.log('Some Error occurred while fetching the list of services');
                postXSIGet(null);
            });
    }

    fetchDndVisible() {
        return this.masterServicesListVisible.getDndVisible();
    }
    setDndVisible(isDndVisible) {
        this.masterServicesListVisible.setDndVisible(isDndVisible);
    }

    fetchRoVisible() {
        return this.masterServicesListVisible.getRoVisible();
    }
    setRoVisible(isRoVisible) {
        this.masterServicesListVisible.setRoVisible(isRoVisible);
    }

    fetchCfVisible() {
        return (this.fetchCfaVisible() || this.fetchCfbVisible() || this.fetchCfnaVisible() || this.fetchCfnrVisible());
    }

    fetchCfaVisible() {
        return this.masterServicesListVisible.getCfaVisible();
    }
    setCfaVisible(isCfaVisible) {
        this.masterServicesListVisible.setCfaVisible(isCfaVisible);
    }

    fetchCfbVisible() {
        return this.masterServicesListVisible.getCfbVisible();
    }
    setCfbVisible(isCfbVisible) {
        this.masterServicesListVisible.setCfbVisible(isCfbVisible);
    }

    fetchCfnaVisible() {
        return this.masterServicesListVisible.getCfnaVisible();
    }
    setCfnaVisible(isCfnaVisible) {
        this.masterServicesListVisible.setCfnaVisible(isCfnaVisible);
    }

    fetchCfnrVisible() {
        return this.masterServicesListVisible.getCfnrVisible();
    }
    setCfnrVisible(isCfnrVisible) {
        this.masterServicesListVisible.setCfnrVisible(isCfnrVisible);
    }

    fetchAcrVisible() {
        return this.masterServicesListVisible.getAcrVisible();
    }
    setAcrVisible(isAcrVisible) {
        this.masterServicesListVisible.setAcrVisible(isAcrVisible);
    }

    fetchSequentialRingVisible() {
        return this.masterServicesListVisible.getSequentialRingVisible();
    }

    setSequentialRingVisible(isSequentialRingVisible) {
        this.masterServicesListVisible.setSequentialRingVisible(isSequentialRingVisible);
    }

    fetchSimultaneousRingVisible() {
        return this.masterServicesListVisible.getSimultaneousRingVisible();
    }
    setSimultaneousRingVisible(isSimultaneousRingVisible) {
        this.masterServicesListVisible.setSimultaneousRingVisible(isSimultaneousRingVisible);
    }

    fetchAutomaticCallbackVisible() {
        return this.masterServicesListVisible.getAutomaticCallbackVisible();
    }
    setAutomaticCallbackVisible(isAutomaticCallbackVisible) {
        this.masterServicesListVisible.setAutomaticCallbackVisible(isAutomaticCallbackVisible);
    }

    fetchCwVisible() {
        return this.masterServicesListVisible.getCwVisible();
    }
    setCwVisible(isCwVisible) {
        this.masterServicesListVisible.setCwVisible(isCwVisible);
    }

    fetchBcidVisible() {
        return this.masterServicesListVisible.getBcidVisible();
    }
    setBcidVisible(isBcidVisible) {
        this.masterServicesListVisible.setBcidVisible(isBcidVisible);
    }

    fetchVoicemailVisible() {
        return this.masterServicesListVisible.getVoicemailVisible();
    }
    setVoicemailVisible(isVoicemailVisible) {
        this.masterServicesListVisible.setVoicemailVisible(isVoicemailVisible);
    }

    fetchBWMobilityVisible() {
        return this.masterServicesListVisible.getBWMobilityVisible();
    }
    setBWMobilityVisible(isBWMobilityVisible) {
        this.masterServicesListVisible.setBWMobilityVisible(isBWMobilityVisible);
    }

    fetchPAVisible() {
        return this.masterServicesListVisible.getPAVisible();
    }

    fetchCallcenterQueueVisible() {
        return this.masterServicesListVisible.getCallCenterVisible();
    }
    setCallcenterQueueVisible(isCallCenterVisible) {
        this.masterServicesListVisible.setcallCenterVisible(isCallCenterVisible);
    }

    fetchBroadWorksAnywhereVisible() {
        return this.masterServicesListVisible.getBroadWorksAnywhereVisible();
    }

    setBroadWorksAnywhereVisible(isBroadWorksAnywhereVisible) {
        this.masterServicesListVisible.setBroadWorksAnywhereVisible(isBroadWorksAnywhereVisible);
    }

    generateLoginTokenAndUse(postGeneratedLoginToken) {

        const loginTokenUrl = window['xsiActionsBaseURL'] + '/v2.0/user/' + window['callSettingsHeroInput'].userId + '/profile/LoginToken';

        console.log('generateLoginTokenAndUse invoked');

        this.httpservices.loginTokenPostRequest(loginTokenUrl).subscribe((res) => {

            const responseJSON = JSON.parse(res.text());
            const generatedToken = responseJSON.LoginToken.token.$;
            console.log('Development or QA mode Generated Login token : ' + generatedToken);
            window['callSettingsHeroInput'].authorization = window['callSettingsHeroInput'].authorization + generatedToken;
            postGeneratedLoginToken(null);

        }, (err) => {
            console.log('Some Error occurred generating the token');

        });

    }

    private handleError(error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            errMsg = JSON.parse(JSON.stringify(error));
        }
        console.log('err code: ' + errMsg['status'] + ' err Text:' + errMsg['statusText']);
        return Observable.throw(errMsg || 'Internal Server Error');

    }

    fetchMasterServicesList() {
        return this.xsiMasterServicesList.getXSIMasterServicesList();
    }


}
