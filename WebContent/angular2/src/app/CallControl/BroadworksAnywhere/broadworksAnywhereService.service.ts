import { Injectable } from '@angular/core';
import { BroadworksAnywhereServiceInput } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereServiceInput.service';
import { HttpServices } from 'app/AppCommon/httpservices.service';
import { BroadWorksAnywhereLocationsInput } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereLocationsInput.service';
import { Util } from 'app/AppCommon/util';

@Injectable()

export class BroadworksAnywhereService {

    constructor(private httpServices: HttpServices, private broadworksAnywhereServiceInput: BroadworksAnywhereServiceInput,
        private broadWorksAnywhereLocationsInput: BroadWorksAnywhereLocationsInput, private util: Util) { }

    getBroadWorksAnywhereService(bwAnywhereURL, postBWAnywhereGet) {

        this.httpServices.httpGetRequest(bwAnywhereURL)
            .subscribe((res) => {
                let bwAnywhereParsedJson = res.json();
                this.broadworksAnywhereServiceInput.setIsAlertAllLocEnable
                    (bwAnywhereParsedJson.BroadWorksAnywhere.alertAllLocationsForClickToDialCalls.$ === 'true');
                if (bwAnywhereParsedJson.BroadWorksAnywhere.locations) {
                    this.broadworksAnywhereServiceInput.setBWAnywhereLocations(bwAnywhereParsedJson.BroadWorksAnywhere.locations.location);
                }

                postBWAnywhereGet(null);

            },
            (err) => {
                postBWAnywhereGet(err);
            });
    }

    getBWCriteria(bwCriteriaLocationUrl, postBWCriteriaGet) {

        this.httpServices.httpGetRequest(bwCriteriaLocationUrl)
            .subscribe((res) => {
                let bwCriteriaParsedJson = res.json();
                if (bwCriteriaParsedJson.BroadWorksAnywhereLocation.description) {
                    this.broadWorksAnywhereLocationsInput.setDescription(bwCriteriaParsedJson.BroadWorksAnywhereLocation.description.$);

                } else {
                    this.broadWorksAnywhereLocationsInput.setDescription(''); // Mandatory otherwise older description will be fetched.
                }
                this.broadWorksAnywhereLocationsInput.setRingNumber(bwCriteriaParsedJson.BroadWorksAnywhereLocation.phoneNumber.$);
                this.broadWorksAnywhereLocationsInput.setIsRingNumberEnabled
                    (bwCriteriaParsedJson.BroadWorksAnywhereLocation.active.$ === 'true');
                this.broadWorksAnywhereLocationsInput.setIsCallControlChecked
                    (bwCriteriaParsedJson.BroadWorksAnywhereLocation.broadworksCallControl.$ === 'true');
                this.broadWorksAnywhereLocationsInput.setIsDoNotForwardChecked
                    (bwCriteriaParsedJson.BroadWorksAnywhereLocation.useDiversionInhibitor.$ === 'true');
                this.broadWorksAnywhereLocationsInput.setIsAnswerConfirmationChecked
                    (bwCriteriaParsedJson.BroadWorksAnywhereLocation.answerConfirmationRequired.$ === 'true');
                postBWCriteriaGet(null, bwCriteriaLocationUrl);
            },
            (err) => {
                postBWCriteriaGet(err, bwCriteriaLocationUrl);
            })
    }

    putIsRingNumberActive(location, isRingNumberActive, postIsRingNumberActivePut) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
            '<active>' + isRingNumberActive + '</active></BroadWorksAnywhereLocation>';

        this.httpServices.httpPutRequest(location.locationUrl, body)
            .subscribe((res) => {
                this.broadWorksAnywhereLocationsInput.setIsRingNumberEnabled(isRingNumberActive);
                postIsRingNumberActivePut(null, location);
            },
            (err) => {
                postIsRingNumberActivePut(err, location);
            })
    }

    putDoNotForwardChecked(location, isDoNotForwardChecked, postDoNotForwardChecked) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
            '<useDiversionInhibitor>' + isDoNotForwardChecked + '</useDiversionInhibitor>' +
            '</BroadWorksAnywhereLocation>';

        this.httpServices.httpPutRequest(location.locationUrl, body)
            .subscribe((res) => {
                this.broadWorksAnywhereLocationsInput.setIsDoNotForwardChecked(isDoNotForwardChecked);
                postDoNotForwardChecked(null, location);
            },
            (err) => {
                this.broadWorksAnywhereLocationsInput.setIsDoNotForwardChecked(!isDoNotForwardChecked);
                postDoNotForwardChecked(err, location);
            })


    }

    putAnswerConfirmation(location, isAnswerConfChecked, postAnswerConfirmationPut) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
            '<answerConfirmationRequired>' + isAnswerConfChecked + '</answerConfirmationRequired>' +
            '</BroadWorksAnywhereLocation>';

        this.httpServices.httpPutRequest(location.locationUrl, body)
            .subscribe((res) => {
                this.broadWorksAnywhereLocationsInput.setIsAnswerConfirmationChecked(isAnswerConfChecked);
                postAnswerConfirmationPut(null, location);
            }, (err) => {
                this.broadWorksAnywhereLocationsInput.setIsAnswerConfirmationChecked(!isAnswerConfChecked);
                postAnswerConfirmationPut(err, location);
            })
    }

    putCallControl(location, isCallControlChecked, postIsCallControlCheckedPut) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
            '<broadworksCallControl>' + isCallControlChecked + '</broadworksCallControl>' +
            '</BroadWorksAnywhereLocation>';
        console.log('Location:===========>', location.locationUrl)
        this.httpServices.httpPutRequest(location.locationUrl, body)
            .subscribe((res) => {
                this.broadWorksAnywhereLocationsInput.setIsCallControlChecked(isCallControlChecked)
                postIsCallControlCheckedPut(null, location);
            }, (err) => {
                this.broadWorksAnywhereLocationsInput.setIsCallControlChecked(!isCallControlChecked)
                postIsCallControlCheckedPut(err, location);
            })
    }

    putAlertAllLocations(broadworksAnywhereUrl, isAlertAllLocationsChecked, postAlertAllLocationsPut) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhere xmlns="http://schema.broadsoft.com/xsi">' +
            '<alertAllLocationsForClickToDialCalls>' + isAlertAllLocationsChecked + '</alertAllLocationsForClickToDialCalls>' +
            '</BroadWorksAnywhere>';

        this.httpServices.httpPutRequest(broadworksAnywhereUrl, body)
            .subscribe((res) => {
                this.broadworksAnywhereServiceInput.setIsAlertAllLocEnable(isAlertAllLocationsChecked);
                postAlertAllLocationsPut(null)
            },
            (err) => {
                this.broadworksAnywhereServiceInput.setIsAlertAllLocEnable(!isAlertAllLocationsChecked);
                postAlertAllLocationsPut(err);
            })
    }

    frameNewNumberBody(userInpRingNumber, location, isExistingNoGettingUpd) {

        let body;
        if (!isExistingNoGettingUpd) {
            body = '<?xml version="1.0" encoding="UTF-8"?><BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
                '<phoneNumber>' + userInpRingNumber + '</phoneNumber>' +
                '<active>true</active>' +
                '</BroadWorksAnywhereLocation>';
        } else {
            if (location.description) {
                body = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
                    '<phoneNumber>' + userInpRingNumber + '</phoneNumber>' +
                    '<description>' + location.description + '</description><active>' + location.isActive + '</active>' +
                    '<broadworksCallControl>' + location.callControl + '</broadworksCallControl>' +
                    '<useDiversionInhibitor>' + location.doNotForward + '</useDiversionInhibitor>' +
                    '<answerConfirmationRequired>' + location.answerConfirmation + '</answerConfirmationRequired>' +
                    '</BroadWorksAnywhereLocation>';
            } else {
                body = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
                    '<phoneNumber>' + userInpRingNumber + '</phoneNumber>' +
                    '<active>' + location.isActive + '</active>' +
                    '<broadworksCallControl>' + location.callControl + '</broadworksCallControl>' +
                    '<useDiversionInhibitor>' + location.doNotForward + '</useDiversionInhibitor>' +
                    '<answerConfirmationRequired>' + location.answerConfirmation + '</answerConfirmationRequired>' +
                    '</BroadWorksAnywhereLocation>';
            }

        }
        return body;
    }

    postNewRingNumber(bwAnywhereLocationUrl, userInpRingNumber, isExistingNoGettingUpd, location, postNewRingNumberPost) {

        let body = this.frameNewNumberBody(userInpRingNumber, location, isExistingNoGettingUpd);
        let locationUrl, UpdNumberIndx = -1;
        this.httpServices.httpPostRequest(bwAnywhereLocationUrl, body)
            .subscribe((res) => {
                let existingLocations = this.broadworksAnywhereServiceInput.getBWAnywhereLocations();
                    locationUrl = this.util.getBWAnywhereLocationUrl(userInpRingNumber);
                if (existingLocations) {
                    this.updateExistingLocs(existingLocations, locationUrl, userInpRingNumber);
                } else {
                    let newLocation = [];
                    newLocation.push({
                        'phoneNumber': { '$': userInpRingNumber },
                        'isActive': { '$': 'true' },
                        'description': { '$': '' },
                        'locationUri': { '$': locationUrl }
                    });
                    this.broadworksAnywhereServiceInput.setBWAnywhereLocations(newLocation);
                }
                this.broadWorksAnywhereLocationsInput.setLocationUrl(locationUrl)
                this.broadWorksAnywhereLocationsInput.setRingNumber(userInpRingNumber);
                this.setBWAnywhereLocInputs(isExistingNoGettingUpd, location)
                postNewRingNumberPost(null, isExistingNoGettingUpd, location);
            },
            (err) => {
                postNewRingNumberPost(err, isExistingNoGettingUpd, location);
            });
    }

    updateExistingLocs(existingLocations, locationUrl, userInpRingNumber) {

        let UpdNumberIndx = -1;
        if (existingLocations.constructor === Array) {
            existingLocations.push({
                'phoneNumber': { '$': userInpRingNumber },
                'isActive': { '$': 'true' },
                'description': { '$': '' },
                'locationUri': { '$': locationUrl },
            });
            UpdNumberIndx = existingLocations.length - 1;
            this.broadworksAnywhereServiceInput.setUpdNumberIndx(UpdNumberIndx);
            this.broadworksAnywhereServiceInput.setBWAnywhereLocations(existingLocations);
        } else if (existingLocations.constructor === Object) {
            let newLocation = [];
            newLocation.push(
                existingLocations,
                {
                    'phoneNumber': { '$': userInpRingNumber },
                    'isActive': { '$': 'true' },
                    'description': { '$': '' },
                    'locationUri': { '$': locationUrl }
                });
            UpdNumberIndx = newLocation.length - 1;
            this.broadworksAnywhereServiceInput.setUpdNumberIndx(UpdNumberIndx);
            this.broadworksAnywhereServiceInput.setBWAnywhereLocations(newLocation);
        }
    }

    setBWAnywhereLocInputs(isExistingNoGettingUpd, location) {
        if (isExistingNoGettingUpd) {
            this.broadWorksAnywhereLocationsInput.setDescription(location.description);
            this.broadWorksAnywhereLocationsInput.setIsAnswerConfirmationChecked(location.answerConfirmation);
            this.broadWorksAnywhereLocationsInput.setIsCallControlChecked(location.callControl);
            this.broadWorksAnywhereLocationsInput.setIsDoNotForwardChecked(location.doNotForward);
            this.broadWorksAnywhereLocationsInput.setIsRingNumberEnabled(location.isActive);
        } else {
            this.broadWorksAnywhereLocationsInput.setDescription('');
            this.broadWorksAnywhereLocationsInput.setIsAnswerConfirmationChecked(false);
            this.broadWorksAnywhereLocationsInput.setIsCallControlChecked(false);
            this.broadWorksAnywhereLocationsInput.setIsDoNotForwardChecked(false);
            this.broadWorksAnywhereLocationsInput.setIsRingNumberEnabled(true);
        }
    }

    deleteLocation(location, existingRingNumber, isExistingNoGettingUpd, postDeleteLocation) {

        let body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
            '<BroadWorksAnywhereLocation xmlns="http://schema.broadsoft.com/xsi">' +
            '<phoneNumber>' + existingRingNumber + '</phoneNumber>' +
            '<active>false</active></BroadWorksAnywhereLocation>';

        this.httpServices.httpDeleteRequest(location.locationUrl, body)
            .subscribe((res) => {
                let existingLocations = this.broadworksAnywhereServiceInput.getBWAnywhereLocations();
                if (existingLocations) {
                    if (existingLocations.constructor === Array) {
                        existingLocations.forEach(element => {
                            if (element.phoneNumber.$ === existingRingNumber) {
                                let index = existingLocations.indexOf(element);
                                existingLocations.splice(index, 1);
                                this.broadWorksAnywhereLocationsInput.setIsRingNumberEnabled(false);
                                this.broadworksAnywhereServiceInput.setBWAnywhereLocations(existingLocations);
                            }
                        });
                    } else if (existingLocations.constructor === Object) {
                        existingLocations = null;
                        this.broadworksAnywhereServiceInput.setBWAnywhereLocations(existingLocations);
                    }
                }
                postDeleteLocation(null, location, isExistingNoGettingUpd);
            },
            (err) => {
                this.broadWorksAnywhereLocationsInput.setRingNumber(existingRingNumber);
                postDeleteLocation(err, location, isExistingNoGettingUpd);
            });
    }

    putDescription(broadworksAnywhereUrl, location, usrInpDesc, postDescriptionPut) {

        let body;
        if (usrInpDesc) {
            body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
                '<BroadWorksAnywhere xmlns="http://schema.broadsoft.com/xsi">' +
                '<locations><location><locationUri>' + location.locationUrl + '</locationUri>' +
                '<phoneNumber>' + location.phoneNumber + '</phoneNumber><active>' + location.isActive + '</active>' +
                '<description>' + usrInpDesc + '</description><criteriaActivations></criteriaActivations></location></locations>' +
                '</BroadWorksAnywhere>';
        } else {
            body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
                '<BroadWorksAnywhere xmlns="http://schema.broadsoft.com/xsi">' +
                '<locations><location><locationUri>' + location.locationUrl + '</locationUri>' +
                '<phoneNumber>' + location.phoneNumber + '</phoneNumber><active>' + location.isActive + '</active>' +
                '<criteriaActivations></criteriaActivations></location></locations>' +
                '</BroadWorksAnywhere>';
        }
        this.httpServices.httpPutRequest(broadworksAnywhereUrl, body)
            .subscribe((res) => {
                let existingLocations = this.fetchBWAnywhereLocations();
                console.log('Exisitng loc for desc - ', existingLocations);
                if (existingLocations.constructor === Array) {
                    existingLocations.forEach(element => {
                        if (location.phoneNumber === element.phoneNumber.$) {
                            element.description.$ = usrInpDesc;
                            this.broadWorksAnywhereLocationsInput.setDescription(usrInpDesc);
                        }
                    });
                } else if (existingLocations.constructor === Object) {
                    existingLocations.description.$ = usrInpDesc;
                    this.broadWorksAnywhereLocationsInput.setDescription(usrInpDesc);
                }
                postDescriptionPut(null, location);

            },
            (err) => {
                postDescriptionPut(err, location);
            })

    }

    fetchUpdNumberIndx() {
        return this.broadworksAnywhereServiceInput.getUpdNumberindx();
    }

    fetchBWAnywhereLocations() {
        return this.broadworksAnywhereServiceInput.getBWAnywhereLocations();
    }

    fetchIsAlertAllLocEnable() {
        return this.broadworksAnywhereServiceInput.getIsAlertAllLocEnable();
    }

    fetchRingNumber() {
        return this.broadWorksAnywhereLocationsInput.getRingNumber();
    }

    fetchIsRingNumberEnabled() {
        return this.broadWorksAnywhereLocationsInput.getIsRingNumberEnabled();
    }

    fetchIsCallControlChecked() {
        return this.broadWorksAnywhereLocationsInput.getIsCallControlChecked();
    }

    fetchIsDoNotForwardChecked() {
        return this.broadWorksAnywhereLocationsInput.getIsDoNotForwardChecked();
    }

    fetchIsAnswerConfirmationChecked() {
        return this.broadWorksAnywhereLocationsInput.getIsAnswerConfirmationChecked();
    }

    fetchDescription() {
        return this.broadWorksAnywhereLocationsInput.getDescription();
    }

    fetchLocationUrl() {
        return this.broadWorksAnywhereLocationsInput.getLocationUrl();
    }

}
