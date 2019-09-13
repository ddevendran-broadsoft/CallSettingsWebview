/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit } from '@angular/core';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { Util } from 'app/AppCommon/util';
import { BroadworksAnywhereService } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereService.service';
import { BroadWorksAnywhereLocationsInput } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereLocationsInput.service';
import { CallControlComponent } from 'app/CallControl/callControl.component';

@Component({
  selector: 'app-broadworks-anywhere',
  templateUrl: 'broadworksAnywhere.component.html'
})

export class BroadworksAnywhereComponent implements OnInit {
  isResReceived = true;

  private updDescInvoked = false;
  private isExistingNoGettingUpd: boolean;
  private APPEND_LOCATION = '/location';
  private isLocationsFetched: boolean;
  private xsiBaseUrl = window['xsiActionsBaseURL'];

  isNewNumFieldFocused: boolean;
  bwAnywhereLocationsFetchErr: any;
  alertAllLocationsUpdErr: string;
  callControlUpdErr: string;
  answerConfUpdateErr: string;
  doNotForwardUpdateErr: any;
  ringNumberUpdateErr: any;
  locationfetchErr: any;
  phoneNumberValidationErr: string;
  isRingNumberExpanded = false;
  customizedTextJson = window['customizedTexts'];
  isAlertAllLocationsChecked = false;
  bwAnywhereLocations: any;
  bwAnywhereLocationsUI = [];

  constructor(private broadworksAnywhereService: BroadworksAnywhereService,
    private broadWorksAnywhereLocationsInput: BroadWorksAnywhereLocationsInput,
    private serviceRouteProvider: ServiceRouteProvider, private util: Util) { }

  ngOnInit() {

    this.initializeAlertAllLocations();
    this.initializeLocations();
  }

  initializeAlertAllLocations() {

    this.isAlertAllLocationsChecked = this.broadworksAnywhereService.fetchIsAlertAllLocEnable();
  }

  initializeLocations() {

    CallControlComponent.isBWAnywhereFetched = false;
    this.broadworksAnywhereService.getBroadWorksAnywhereService(this.serviceRouteProvider.fetchBroadWorksAnywhereUrl(),
      this.postBWAnywhereGet.bind(this));

  }

  postBWAnywhereGet(error) {

    CallControlComponent.isBWAnywhereFetched = true;
    if (error) {
      if (error.status === 0) {
        this.bwAnywhereLocationsFetchErr = this.customizedTextJson.error.networkerror;
      } else {
        this.bwAnywhereLocationsFetchErr = this.customizedTextJson.error.unabletofetch;
      }
    }

    this.bwAnywhereLocations = this.broadworksAnywhereService.fetchBWAnywhereLocations();
    if (this.bwAnywhereLocations) {
      if (this.bwAnywhereLocations.constructor === Array) {

        this.bwAnywhereLocations.forEach(element => {
          let bwCriteriaUrl = this.xsiBaseUrl + element.locationUri.$;

          this.broadworksAnywhereService.getBWCriteria(bwCriteriaUrl, this.postBWCriteriaGet.bind(this));
        });
      } else if (this.bwAnywhereLocations.constructor === Object) {

        let bwCriteriaLocationUrl = this.xsiBaseUrl + this.bwAnywhereLocations.locationUri.$;
        this.locationfetchErr = '';
        this.broadworksAnywhereService.getBWCriteria(bwCriteriaLocationUrl, this.postBWCriteriaGet.bind(this));
      }
    }

  }

  postBWCriteriaGet(error, bwCriteriaLocationUrl) {

    if (error) {
      if (error.status === 0) {
        this.locationfetchErr = this.customizedTextJson.error.networkerror;
      } else {
        this.locationfetchErr = this.customizedTextJson.error.unabletofetch;
      }
    }
    this.bwAnywhereLocationsUI.push({
      'phoneNumber': this.broadworksAnywhereService.fetchRingNumber(),
      'isActive': this.broadworksAnywhereService.fetchIsRingNumberEnabled(),
      'description': this.broadworksAnywhereService.fetchDescription(),
      'doNotForward': this.broadworksAnywhereService.fetchIsDoNotForwardChecked(),
      'answerConfirmation': this.broadworksAnywhereService.fetchIsAnswerConfirmationChecked(),
      'callControl': this.broadworksAnywhereService.fetchIsCallControlChecked(),
      'locationUrl': bwCriteriaLocationUrl,
      'dnfError': '',
      'acError': '',
      'ccError': '',
      'descError': '',
      'isActiveError': '',
      'ringNumberDelErr': '',
      'ringNoToggleErr': '',
      'phoneNumUpdErr': '',
      'numberInpFieldFocused': false,
      'descInpFieldFocused': false,
      'isResReceived': true
    });
  }

  ringNumbersExpand() {
    if (this.isRingNumberExpanded) {
      this.isRingNumberExpanded = false;
    } else {
      this.isRingNumberExpanded = true;
    }
  }

  isRingNumberActive(location) {

    this.clearErrorMsgs(location);
    if (location.isActive) {
      location.isActive = false;
    } else {
      location.isActive = true;
    }
    location.isResReceived = false;
    this.broadworksAnywhereService.putIsRingNumberActive(location, location.isActive, this.postIsRingNumberActivePut.bind(this));
  }

  postIsRingNumberActivePut(error, location) {

    location.isResReceived = true;

    if (error) {
      if (error.status === 0) {
        location.ringNoToggleErr = this.customizedTextJson.error.networkerror;
      } else {
        location.ringNoToggleErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    location.isActive = this.broadworksAnywhereService.fetchIsRingNumberEnabled();
    this.checkBWAnywhereStatus();

  }

  checkBWAnywhereStatus() {

    let count = 0;
    if (this.bwAnywhereLocationsUI.length > 0) {
      CallControlComponent.isBWAnywhereActive = true;
      this.bwAnywhereLocationsUI.forEach((element) => {
        if (element.isActive) {
          count++;
        }
      });
      if (count > 0) {
        CallControlComponent.isAnyLocationEnabled = true;
      } else {
        CallControlComponent.isAnyLocationEnabled = false;
      }
    } else {
      CallControlComponent.isBWAnywhereActive = false;
    }
  }

  clearErrorMsgs(location) {

    this.alertAllLocationsUpdErr = '';
    location.dnfError = '';
    location.acError = '';
    location.ccError = '';
    location.descError = '';
    location.ringNumberDelErr = '';
    location.ringNoToggleErr = '';
    location.phoneNumUpdErr = '';
  }

  doNotForwardChecked(location) {

    this.clearErrorMsgs(location);
    if (location.doNotForward) {
      location.doNotForward = false;
    } else {
      location.doNotForward = true;
    }
    this.doNotForwardUpdateErr = '';
    location.isResReceived = false;
    this.broadworksAnywhereService.putDoNotForwardChecked(location, location.doNotForward, this.postDoNotForwardChecked.bind(this));
  }

  postDoNotForwardChecked(error, location) {

    location.isResReceived = true;

    if (error) {
      if (error.status === 0) {
        location.dnfError = this.customizedTextJson.error.networkerror;
      } else {
        location.dnfError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    location.doNotForward = this.broadworksAnywhereService.fetchIsDoNotForwardChecked();
  }

  isAnswerConfChecked(location) {

    this.clearErrorMsgs(location);
    if (location.answerConfirmation) {
      location.answerConfirmation = false;
    } else {
      location.answerConfirmation = true;
    }
    this.answerConfUpdateErr = '';
    location.isResReceived = false;
    this.broadworksAnywhereService.putAnswerConfirmation(location, location.answerConfirmation, this.postAnswerConfirmationPut.bind(this));
  }

  postAnswerConfirmationPut(error, location) {

    location.isResReceived = true;
    if (error) {
      if (error.status === 0) {
        location.acError = this.customizedTextJson.error.networkerror;
      } else {
        location.acError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    location.answerConfirmation = this.broadworksAnywhereService.fetchIsAnswerConfirmationChecked();
  }

  isCallControlChecked(location) {

    this.clearErrorMsgs(location);
    if (location.callControl) {
      location.callControl = false;
    } else {
      location.callControl = true;
    }
    this.callControlUpdErr = '';
    location.isResReceived = false;
    this.broadworksAnywhereService.putCallControl(location, location.callControl, this.postIsCallControlCheckedPut.bind(this));
  }

  postIsCallControlCheckedPut(error, location) {

    location.isResReceived = true;

    if (error) {
      if (error.status === 0) {
        location.ccError = this.customizedTextJson.error.networkerror;
      } else {
        location.ccError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    location.callControl = this.broadworksAnywhereService.fetchIsCallControlChecked();
  }

  updateAlertAllLocations() {

    if (this.isAlertAllLocationsChecked) {
      this.isAlertAllLocationsChecked = false;
    } else {
      this.isAlertAllLocationsChecked = true;
    }
    this.clearErrorMsgs(location);
    this.isResReceived = false;
    this.broadworksAnywhereService.putAlertAllLocations(this.serviceRouteProvider.fetchBroadWorksAnywhereUrl(),
      this.isAlertAllLocationsChecked, this.postAlertAllLocationsPut.bind(this));
  }

  postAlertAllLocationsPut(error) {

    this.isResReceived = true;

    if (error) {
      if (error.status === 0) {
        this.alertAllLocationsUpdErr = this.customizedTextJson.error.networkerror;
      } else {
        this.alertAllLocationsUpdErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }
    this.isAlertAllLocationsChecked = this.broadworksAnywhereService.fetchIsAlertAllLocEnable();
  }

  addNewRingNumber(event) {

    let userInpRingNumber = event.srcElement.value;
    this.isNewNumFieldFocused = false;
    this.phoneNumberValidationErr = '';
    if (!userInpRingNumber) {
      this.phoneNumberValidationErr = this.customizedTextJson.broadworks_anywhere.phone_number_required;
    } else
      if (!(this.util.isE164valid(userInpRingNumber))) {
        this.phoneNumberValidationErr = this.customizedTextJson.error.invalid_number;
      } else {
        this.isExistingNoGettingUpd = false;
        let bwAnywhereLocationUrl = this.serviceRouteProvider.fetchBroadWorksAnywhereUrl() + this.APPEND_LOCATION;
        this.broadworksAnywhereService.postNewRingNumber(bwAnywhereLocationUrl, userInpRingNumber, this.isExistingNoGettingUpd,
          location, this.postNewRingNumberPost.bind(this));
      }

  }

  postNewRingNumberPost(error, isExistingNoGettingUpd, location) {

    if (error) {
      this.handleErrorInUI(error, location, isExistingNoGettingUpd);
    } else {
      if (isExistingNoGettingUpd) {
        this.updateExistingNumber(location, isExistingNoGettingUpd);
      } else {
        this.bwAnywhereLocationsUI.push({
          'phoneNumber': this.broadworksAnywhereService.fetchRingNumber(),
          'isActive': this.broadworksAnywhereService.fetchIsRingNumberEnabled(),
          'description': this.broadworksAnywhereService.fetchDescription(),
          'doNotForward': this.broadworksAnywhereService.fetchIsDoNotForwardChecked(),
          'answerConfirmation': this.broadworksAnywhereService.fetchIsAnswerConfirmationChecked(),
          'callControl': this.broadworksAnywhereService.fetchIsCallControlChecked(),
          'locationUrl': this.broadworksAnywhereService.fetchLocationUrl(),
          'dnfError': '',
          'acError': '',
          'ccError': '',
          'descError': '',
          'isActiveError': '',
          'ringNumberDelErr': '',
          'ringNoToggleErr': '',
          'phoneNumUpdErr': '',
          'numberInpFieldFocused': false,
          'descInpFieldFocused': false,
          'isResReceived': true
        });
      }
      this.checkBWAnywhereStatus();
      (<HTMLInputElement>document.getElementById('newNumber')).value = '';
    }

  }

  handleErrorInUI(error, location, isExistingNoGettingUpd) {

    location.isResReceived = true;
    if (error.status === 0) {
      if (!isExistingNoGettingUpd) {
        this.phoneNumberValidationErr = this.customizedTextJson.error.networkerror;
      } else {
        location.phoneNumUpdErr = this.customizedTextJson.error.networkerror;
      }
    } else {
      if (JSON.parse(error._body).ErrorInfo.errorCode.$ === '8251') {
        if (!isExistingNoGettingUpd) {
          this.phoneNumberValidationErr = this.customizedTextJson.broadworks_anywhere.phone_number_exists;
        } else {
          location.phoneNumUpdErr = this.customizedTextJson.broadworks_anywhere.phone_number_exists;
        }
      } else {
        if (!isExistingNoGettingUpd) {
          this.phoneNumberValidationErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
        } else {
          location.phoneNumUpdErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
        }
      }
    }
  }

  updateExistingNumber(location, isExistingNoGettingUpd) {

    this.broadworksAnywhereService.deleteLocation(location, location.phoneNumber, isExistingNoGettingUpd,
      this.postDeleteLocation.bind(this));
  }

  updateRingNumber(event, location) {

    this.clearErrorMsgs(location);
    location.numberInpFieldFocused = false;
    let userInp = event.srcElement.value;
    let existingRingNumber = this.util.getRingNumberFromLocationUrl(location.locationUrl).trim();
    if (!userInp) {
      this.isExistingNoGettingUpd = false;
      this.broadworksAnywhereService.deleteLocation(location, existingRingNumber, this.isExistingNoGettingUpd,
        this.postDeleteLocation.bind(this));
    } else if (userInp.trim() !== existingRingNumber) {
      if (!(this.util.isE164valid(userInp))) {
        location.phoneNumUpdErr = this.customizedTextJson.error.invalid_number;

      } else {
        this.isExistingNoGettingUpd = true;
        location.phoneNumber = existingRingNumber;
        let bwAnywhereLocationUrl = this.serviceRouteProvider.fetchBroadWorksAnywhereUrl() + this.APPEND_LOCATION;
        location.isResReceived = false;
        this.broadworksAnywhereService.postNewRingNumber(bwAnywhereLocationUrl, userInp, this.isExistingNoGettingUpd,
          location, this.postNewRingNumberPost.bind(this));
      }
    }
  }

  postDeleteLocation(error, location, isExistingNoGettingUpd) {

    location.isResReceived = true;

    if (error) {
      if (error.status === 0) {
        location.ringNumberDelErr = this.customizedTextJson.error.networkerror;
      } else {
        location.ringNumberDelErr = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
      location.broadworksAnywhereService.fetchRingNumber();
    } else {
      if (isExistingNoGettingUpd) {
        let updNumberIndx = this.broadworksAnywhereService.fetchUpdNumberIndx();
        let existingLocations = this.broadworksAnywhereService.fetchBWAnywhereLocations();
        let updatedphoneNumber = existingLocations[updNumberIndx - 1].phoneNumber.$;
        console.log('updatedphoneNumber: ', updatedphoneNumber);
        this.bwAnywhereLocationsUI.forEach(element => {
          if (location.locationUrl === element.locationUrl) {
            let oldPhNumindex = this.bwAnywhereLocationsUI.indexOf(element);
            this.bwAnywhereLocationsUI.splice(oldPhNumindex, 1, {
              'phoneNumber': this.broadworksAnywhereService.fetchRingNumber(),
              'isActive': location.isActive,
              'description': location.description,
              'doNotForward': location.doNotForward,
              'answerConfirmation': location.answerConfirmation,
              'callControl': location.callControl,
              'locationUrl': this.broadworksAnywhereService.fetchLocationUrl(),
              'dnfError': '',
              'acError': '',
              'ccError': '',
              'descError': '',
              'isActiveError': '',
              'ringNumberDelErr': '',
              'ringNoToggleErr': '',
              'phoneNumUpdErr': '',
              'numberInpFieldFocused': false,
              'descInpFieldFocused': false,
              'isResReceived': true
            });
          }
        });
        console.log('After update: ', this.bwAnywhereLocationsUI);

      } else {
        this.bwAnywhereLocationsUI.forEach(element => {
          if (location.locationUrl === element.locationUrl) {
            let index = this.bwAnywhereLocationsUI.indexOf(element);
            this.bwAnywhereLocationsUI.splice(index, 1);
          }
        });
      }
    }
    this.checkBWAnywhereStatus();
  }

  updateDescription(event, location) {

    location.descInpFieldFocused = false;
    if (!this.updDescInvoked) {
      console.log('Event: ', event);
      let usrInpDesc = event.srcElement.value;


      this.clearErrorMsgs(location);

      this.updDescInvoked = true;


      location.isResReceived = false;
      this.broadworksAnywhereService.putDescription(this.serviceRouteProvider.fetchBroadWorksAnywhereUrl(),
        location, usrInpDesc, this.postDescriptionPut.bind(this));
    }


  }

  changeDescription() {
    this.updDescInvoked = false;
  }

  postDescriptionPut(error, location) {

    location.isResReceived = true;
    if (error) {
      if (error.status === 0) {
        location.descError = this.customizedTextJson.error.networkerror;
      } else {
        location.descError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, error.status);
      }
    }

    this.bwAnywhereLocationsUI.forEach((element) => {

      if (element.phoneNumber === location.phoneNumber) {
        element.description = this.broadworksAnywhereService.fetchDescription();
      }
    });

  }

  focusNumberInput(event, location) {

    if (event.key !== 'Enter' && event.key !== 'Tab') {
      if (location) {
        this.clearErrorMsgs(location);
        location.numberInpFieldFocused = true;
      }
    }
  }

  focusNewNumberInp(event) {

    if (event.key !== 'Enter' && event.key !== 'Tab') {
      this.phoneNumberValidationErr = '';
      if (event.srcElement.value === '' && event.srcElement.value.includes(!'+')) {
        this.phoneNumberValidationErr = this.customizedTextJson.broadworks_anywhere.phone_number_required;
      }
      this.isNewNumFieldFocused = true;
    }
  }

  focusDescField(event, location) {

    if (event.key !== 'Enter' && event.key !== 'Tab') {
      this.clearErrorMsgs(location);
      location.descInpFieldFocused = true;
    }

  }

  private onPasteEvent(event) {
    this.util.validatePhoneNumberOnCopyPaste(event);
  }
}
