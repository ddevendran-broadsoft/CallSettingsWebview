/* Copyright © 2017 BroadSoft Inc. */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Util } from 'app/AppCommon/util';

import { AppComponent } from 'app/AppCommon/app.component';
import { ServiceRouteProvider } from 'app/AppCommon/serviceRouteProvider.service';
import { XSIServices } from 'app/AppCommon/xsiServiceList.service';
import { VoicemailService } from 'app/Voicemail/voicemailService.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';
import { DesktopSelectOption } from 'app/common/desktopSelectDropdown.component';


@Component({
  selector: 'voicemail',
  templateUrl: 'voicemail.component.html',
  providers: [XSIServices, ServiceRouteProvider, AppComponent]
})

export class voicemailComponent implements AfterViewInit {

  customizedTextJson = window['customizedTexts'];

  baseUrl: string = window['callSettingsHeroInput'].xsp + "/com.broadsoft.xsi-actions/v2.0/user/" + window['callSettingsHeroInput'].userId + "/services/";

  voicemailVisible: boolean = false;
  isVoicemailServiceChecked: boolean;
  vmServiceRetrievingError: string = "";
  isVMServiceUpdateInprgress: boolean = false;
  vmServiceUpdateError: string = "";

  issendCallstoVoicemailChecked: boolean = false;
  isSendCallAlwaysSelected: boolean = false;
  isSendCallBusySelected: boolean = false;
  isSendCallNoAnswerSelected: boolean = false;
  isSendCallAllSettingsSelected: boolean = false;
  sendCallsUpdateError:string;

  isEmailNotificationChecked: boolean = false;
  isTransferChecked: boolean = false;
  isEmailCarbonCopyChecked: boolean = false;
  notifyEmailAddress: string;
  carbonCopyEmailAddress: string;
  transferPhoneNumber: string;
  emailNotificationError: string;
  emailNotificationUpdateError: string;
  emailCarbonCopyError: string;
  emailCarbonCopyUpdateError: string;
  transferNumberError: string;
  transferNumberUpdateError: string;
  isTransferNumberFocused: boolean;
  isEmailNotificationFocused: boolean;
  isEmailCarbonCopyFocused: boolean;

  iswhenMessageArrivesChecked: boolean = false;
  forwardToEmailEnabled: boolean = false;
  unifiedMessagingEnabled: boolean = false;
  isunifiedMessagingChecked: boolean = false;
  isforwardToEmailChecked: boolean = false;
  isMessageWaitingIndicatorChecked: boolean = false;
  deliveryEmailAddress: string;
  forwardToEmailError: string;
  forwardToEmailUpdateError: string;
  isForwardToEmailFocused: boolean;
  processingType: string;

  voicemailRings: string[];
  voicemailRingSelected: string;
  vmRingSelectedRetrievingError: string = "";
  callstoVoicemail: string[];

  callSettingsOptionsList: DesktopSelectOption[] = new Array();
  private isCallsettingsFocused = false;
  private vmsLastSelectedValues;//holds the previous selected vm settings option list

  sendCallsSelectedOptions = [];
  csSelectedOptionsTextContinerId = "csSelectedOptionsTextContrainer";
  inputValue: String = this.customizedTextJson.voice_management.none;

  EmailNotificationInputWidth = 160;
  EmailCarbonCopyInputWidth = 160;
  ForwardToEmailInputWidth = 160;

  isVoicemailServiceFetched: boolean = false;
  private isDesktop: boolean = window['callSettingsHeroInput']['platform'];
  private phoneNumberMaxLength: number;

  cswDesktopMenuShow: boolean = false;


  constructor(private xsiServices: XSIServices, private serviceRouteProvider: ServiceRouteProvider, private voicemailService: VoicemailService, private voicemailServiceInput: VoicemailServiceInput, private util: Util) {
    this.voicemailRings = [this.customizedTextJson.voice_management.none, '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    this.phoneNumberMaxLength = this.util.PHONENUMBERMAXLENGTH;
    this.isDesktop = util.isDesktopPlatform();
  }

  ngAfterViewInit() {
    let self = this;

  }

  ngOnInit() {

    this.initializeVoicemailService();

  }

  initializeVoicemailService() {

    if ((this.serviceRouteProvider.fetchVoicemailUrl())) {
      this.voicemailVisible = this.xsiServices.fetchVoicemailVisible();
    }
    if (this.voicemailVisible) {
      this.vmServiceRetrievingError = "";
      this.voicemailService.getVoicemailService(this.serviceRouteProvider.fetchVoicemailUrl(), this.postVoicemailGet.bind(this));
      this.vmRingSelectedRetrievingError = "";
      this.voicemailService.getRingsService(this.serviceRouteProvider.fetchVoicemailGreetingUrl(), this.postVoicemailGreetingGet.bind(this));
    }

  }

  onCallSettingsOptionsChange(result: any) {
    this.updateSendCallsCurrentOptions(result);
  }

  //Initialize voicemail component data
  postVoicemailGet(voicemailParsedJson) {

    this.isVoicemailServiceFetched = true;

    if (voicemailParsedJson) {

      this.isVoicemailServiceChecked = this.voicemailServiceInput.getIsActive();
      this.isSendCallAlwaysSelected = this.voicemailServiceInput.getIsAlwaysRedirectToVoiceMail();
      this.isSendCallBusySelected = this.voicemailServiceInput.getIsBusyRedirectToVoiceMail();
      this.isSendCallNoAnswerSelected = this.voicemailServiceInput.getIsNoAnswerRedirectToVoiceMail();

      if (this.isSendCallAlwaysSelected){
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.always);
      }
      if (this.isSendCallBusySelected){
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_busy);
      }
      if (this.isSendCallNoAnswerSelected){
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_unanswered);
      }

      if (this.isSendCallAlwaysSelected && this.isSendCallBusySelected && this.isSendCallNoAnswerSelected) {
        this.isSendCallAllSettingsSelected = true;
        this.sendCallsSelectedOptions = [];
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.always);
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_busy);
        this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_unanswered);
      } else {
        this.isSendCallAllSettingsSelected = false;
      }

      this.vmsLastSelectedValues = [];
      if(this.isSendCallAllSettingsSelected){
        this.callSettingsOptionsList = [];
        this.vmsLastSelectedValues.push(this.customizedTextJson.voice_management.always);
        this.vmsLastSelectedValues.push(this.customizedTextJson.voice_management.when_busy);
        this.vmsLastSelectedValues.push(this.customizedTextJson.voice_management.when_unanswered);
      } else {
        this.callSettingsOptionsList = [];
        if(this.isSendCallBusySelected){
          this.vmsLastSelectedValues.push(this.customizedTextJson.voice_management.when_busy);
        }
        if(this.isSendCallNoAnswerSelected){
          this.vmsLastSelectedValues.push(this.customizedTextJson.voice_management.when_unanswered);
        }
      }

      this.callSettingsOptionsList.push(new DesktopSelectOption(this.customizedTextJson.voice_management.always, this.isSendCallAlwaysSelected));
      this.callSettingsOptionsList.push(new DesktopSelectOption(this.customizedTextJson.voice_management.when_busy, this.isSendCallBusySelected));
      this.callSettingsOptionsList.push(new DesktopSelectOption(this.customizedTextJson.voice_management.when_unanswered, this.isSendCallNoAnswerSelected));

      if(this.isDesktop){
        if (this.sendCallsSelectedOptions.length > 0) {
          this.inputValue = this.sendCallsSelectedOptions.join();
        } else {
          this.inputValue = this.customizedTextJson.voice_management.none;
        }
      }


      if (this.isSendCallAlwaysSelected || this.isSendCallBusySelected || this.isSendCallNoAnswerSelected) {
        this.issendCallstoVoicemailChecked = true;
      }
      if (this.voicemailService.fetchProcessing() == "Unified Voice and Email Messaging") {
        this.iswhenMessageArrivesChecked = true;
        this.isunifiedMessagingChecked = true;
        this.isforwardToEmailChecked = false;
      }

      if (this.voicemailService.fetchProcessing() == "Deliver To Email Address Only") {
        this.iswhenMessageArrivesChecked = true;
        this.isforwardToEmailChecked = true;
        this.isunifiedMessagingChecked = false;
      }

      this.isMessageWaitingIndicatorChecked = this.voicemailService.fetchMessageWaitingIndicator();
      this.deliveryEmailAddress = this.voicemailService.fetchDeliveryMailAddress();
      this.isEmailNotificationChecked = this.voicemailService.fetchIsEmailNotificationChecked();
      this.notifyEmailAddress = this.voicemailService.fetchNotifyEmailAddress();
      this.isEmailCarbonCopyChecked = this.voicemailService.fetchIsEmailCarbonCopyChecked();
      this.carbonCopyEmailAddress = this.voicemailService.fetchCarbonCopyEmailAddress();
      this.isTransferChecked = this.voicemailService.fetchIsTransferToPhoneNumberChecked();
      this.transferPhoneNumber = this.voicemailService.fetchTransferNumber();

      this.updateEmailCarbonCopyInputWidth();
      this.updateEmailNotificationInputWidth();
      this.updateForwardToEmailInputWidth();

    } else {
      this.vmServiceRetrievingError = this.customizedTextJson.error.unabletofetch;
    }

  }

  //Initialize Number of Rings data
  postVoicemailGreetingGet(voicemailGreetingsParsedJson) {
    if (voicemailGreetingsParsedJson) {
      this.voicemailRingSelected = this.voicemailServiceInput.getSendCallsRings();
       if(this.voicemailRingSelected == '0'){
               this.voicemailRingSelected = this.customizedTextJson.voice_management.none ;
            }
    } else {
      this.vmRingSelectedRetrievingError = this.customizedTextJson.error.unabletofetch;
    }
  }


  private updateEmailNotificationInputWidth() {
    this.EmailNotificationInputWidth = this.util.getInputDynamicWidth(this.notifyEmailAddress);
  }
  private updateEmailCarbonCopyInputWidth() {
    this.EmailCarbonCopyInputWidth = this.util.getInputDynamicWidth(this.carbonCopyEmailAddress);
  }
  private updateForwardToEmailInputWidth() {
    this.ForwardToEmailInputWidth = this.util.getInputDynamicWidth(this.deliveryEmailAddress);
  }

  // Invoked when the voicemail service toggle is switched ON/OFF
  voicemailServiceActive() {

    if (this.isVoicemailServiceChecked) {
      this.isVoicemailServiceChecked = false;
    } else {
      this.isVoicemailServiceChecked = true;
    }
    this.isVMServiceUpdateInprgress = true;
    this.vmServiceUpdateError = "";
    this.voicemailService.putVoicemailService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isVoicemailServiceChecked, this.postVoicemailSwitchPut.bind(this));
  }

  //Voicemail service switch Callback
  postVoicemailSwitchPut(res) {
    this.isVMServiceUpdateInprgress = false;
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isVoicemailServiceChecked = !this.isVoicemailServiceChecked;
      
      if (res) {
        if (res.status === 0) {
          this.vmServiceUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.vmServiceUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }

    }
  }

  //Send Calls Options Update Callback
  postVMSendCallsPut(res){
        this.isVMServiceUpdateInprgress = false;
        this.sendCallsUpdateError="";
    if(!res || !(res.status >= 200 && res.status < 400)){
      this.isSendCallAlwaysSelected = !this.isSendCallAlwaysSelected;
      this.isSendCallBusySelected = !this.isSendCallBusySelected ;
      this.isSendCallNoAnswerSelected = !this.isSendCallNoAnswerSelected ;
      
      if (res) {
        if (res.status === 0) {
          this.sendCallsUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.sendCallsUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }
  
  //Email Notification Update Callback
  postVMNotifyEmailAddressPut(res) {
        this.isVMServiceUpdateInprgress = false;
        this.emailNotificationUpdateError ="";
    if(!res || !(res.status >= 200 && res.status < 400)){
      this.isEmailNotificationChecked = !this.isEmailNotificationChecked;

      if (res) {
        if (res.status === 0) {
          this.emailNotificationUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.emailNotificationUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      
      }
    }  
  }

  //Email Carbon Copy Update Callback
  postVMEmailCarbonCopyPut(res) {
    this.isVMServiceUpdateInprgress = false;
    this.emailCarbonCopyUpdateError = "";
    if (!res || !(res.status >= 200 && res.status < 400)) {
      this.isEmailCarbonCopyChecked = !this.isEmailCarbonCopyChecked;

      if (res) {
        if (res.status === 0) {
          this.emailCarbonCopyUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.emailCarbonCopyUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }

      }

    }
  }

  //Press 0 to transfer Update Callback
  postVMTransferCheckedPut(res) {
        this.isVMServiceUpdateInprgress = false;
        this.transferNumberUpdateError="";
        this.isTransferChecked = this.voicemailService.fetchIsTransferToPhoneNumberChecked();
        this.transferPhoneNumber = this.voicemailService.fetchTransferNumber();
    if(!res || !(res.status >= 200 && res.status < 400)){ 
      if(res){
        if (res.status === 0) {
          this.transferNumberUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.transferNumberUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
      
    }
  }

  //When message arrives Update Callback
  postVMWhenMessageArrivesPut(res) {
        this.isVMServiceUpdateInprgress = false;
        this.forwardToEmailUpdateError ="";
    if(!res || !(res.status >= 200 && res.status < 400)){
      this.processingType=this.voicemailServiceInput.getProcessing();
      this.isforwardToEmailChecked = !this.isforwardToEmailChecked;
      this.isunifiedMessagingChecked = !this.isunifiedMessagingChecked;
    
      if(res){
         if (res.status === 0) {
          this.forwardToEmailUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.forwardToEmailUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
    }
  }

  //Number of rings update callback
  postVoicemailGreetingPut(res) {
    this.isVMServiceUpdateInprgress = false;
        this.sendCallsUpdateError="";
    if(!res || !(res.status >= 200 && res.status < 400)){

      if(res){
        if (res.status === 0) {
          this.sendCallsUpdateError = this.customizedTextJson.error.networkerror;
        } else {
          this.sendCallsUpdateError = this.util.frameErrorMessage(this.customizedTextJson.error.updatefailed, res.status);
        }
      }
     
    }
  }

  //Invoked to validate the input keys when input for "Press 0 to transfer" is provided
  private onPhonenumberKeydown(event) {
    if (event.keyCode == 8 || event.key == "Backspace" || event.keyCode == 46 || event.key == "Delete") {
    }
  }

    //Invoked to validate the input keys when input for "Press 0 to transfer" is provided
  private onPhoneNumberChange(event) {
    let key;
    this.transferNumberError = "";
    this.isTransferNumberFocused = true ;
    if (event.key) {
      key = event.key;
    } else {
      key = String.fromCharCode(event.keyCode);
    }

    if (!this.util.phoneNumberRegx.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    } 
  }

  //Invoked when input for "Press 0 to transfer" is provided by paste
  private onPasteEvent(event) {
    this.util.validatePhoneNumberOnCopyPaste(event);
  }

  //Invoked when there is a Number of Rings update
  setNumberOfRings(event) {
    this.voicemailRingSelected = event.target.value;
    this.voicemailService.putRingsService(this.serviceRouteProvider.fetchVoicemailGreetingUrl(), this.voicemailRingSelected ,this.postVoicemailGreetingPut.bind(this));
  }

  //Invoked when Email Notification toggle is switched ON/OFF
  emailNotificationChecked() {

    if ((this.notifyEmailAddress && !this.emailNotificationError) || (!this.isEmailNotificationChecked && this.notifyEmailAddress )) {
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      if(this.emailNotificationError){
        this.notifyEmailAddress = this.voicemailServiceInput.getNotifyEmailAddress();
        this.emailNotificationError="";
      }
      this.voicemailService.putEmailNotificationService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isEmailNotificationChecked, this.notifyEmailAddress ,this.postVMNotifyEmailAddressPut.bind(this));
    } else if (!this.notifyEmailAddress){
      this.emailNotificationError = this.customizedTextJson.voice_management.email_address_required;
    }
  }

  //Invoked when email address for Email Notification is provided
  emailNotificationInput(event) {
    this.emailNotificationError = "";
    this.isEmailNotificationFocused = false;
    this.notifyEmailAddress = event.target.value;
    if (!this.util.emailRegx.test(this.notifyEmailAddress)) {
      this.emailNotificationError = this.customizedTextJson.voice_management.invalid_email_address_msg;
    }
    if (this.notifyEmailAddress && !this.emailNotificationError) {
      this.isEmailNotificationChecked=true;
    } else if (!this.notifyEmailAddress) {
      this.isEmailNotificationChecked = false;
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putEmailNotificationService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isEmailNotificationChecked, this.notifyEmailAddress , this.postVMNotifyEmailAddressPut.bind(this));
      this.emailNotificationError = this.customizedTextJson.voice_management.email_address_required;
    }
    if (!this.emailNotificationError){
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putEmailNotificationService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isEmailNotificationChecked, this.notifyEmailAddress , this.postVMNotifyEmailAddressPut.bind(this));
    }

  }

  //Invoked when Email Carbon Copy toggle is switched ON/OFF
  emailCarbonCopyChecked() {

    if ((this.carbonCopyEmailAddress && !this.emailCarbonCopyError) || (!this.isEmailCarbonCopyChecked && this.carbonCopyEmailAddress)) {
      this.voicemailServiceInput.setSendCarbonCopyVoiceMessage(this.isEmailCarbonCopyChecked);

      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      if(this.emailCarbonCopyError){
        this.carbonCopyEmailAddress = this.voicemailServiceInput.getVoiceMessageCarbonCopyEmailAddress();
        this.emailCarbonCopyError="";
      }
      this.voicemailService.putEmailCarbonCopyService(this.serviceRouteProvider.fetchVoicemailUrl(),this.isEmailCarbonCopyChecked ,this.carbonCopyEmailAddress ,this.postVMEmailCarbonCopyPut.bind(this));
    } else if (!this.carbonCopyEmailAddress) {
      this.emailCarbonCopyError = this.customizedTextJson.voice_management.email_address_required;
     }
  }

  //Invoked when email address for Email Carbon Copy is provided
  emailCarbonCopyInput(event) {
    this.isEmailCarbonCopyFocused = false;
    this.emailCarbonCopyError = "";
    this.carbonCopyEmailAddress = event.target.value;
    if (!this.util.emailRegx.test(this.carbonCopyEmailAddress)) {
      this.emailCarbonCopyError = this.customizedTextJson.voice_management.invalid_email_address_msg;
    }
    if (this.carbonCopyEmailAddress && !this.emailCarbonCopyError) {
       this.isEmailCarbonCopyChecked = true;
    } else if (!this.carbonCopyEmailAddress) {
      this.isEmailCarbonCopyChecked = false;
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putEmailCarbonCopyService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isEmailCarbonCopyChecked ,this.carbonCopyEmailAddress ,this.postVMEmailCarbonCopyPut.bind(this));
      this.emailCarbonCopyError = this.customizedTextJson.voice_management.email_address_required;
    }
    if (!this.emailCarbonCopyError){
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putEmailCarbonCopyService(this.serviceRouteProvider.fetchVoicemailUrl(),this.isEmailCarbonCopyChecked ,this.carbonCopyEmailAddress , this.postVMEmailCarbonCopyPut.bind(this));
    }

  }

  //Invoked when Press 0 to transfer toggle is switched ON/OFF
  transferNumberChecked() {

    if ((this.transferPhoneNumber && !this.transferNumberError) || (!this.isTransferChecked && this.transferPhoneNumber)) {
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
        if(this.transferNumberError || this.transferNumberUpdateError){
        this.transferPhoneNumber = this.voicemailService.fetchTransferNumber();
        
        this.transferNumberError="";
        this.transferNumberUpdateError = "";
      }
      this.voicemailService.putTransferToNumberService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isTransferChecked , this.transferPhoneNumber ,this.postVMTransferCheckedPut.bind(this));
    } else if (!this.transferPhoneNumber) {
      this.transferNumberError = this.customizedTextJson.voice_management.phone_number_required;
    }
  }

  //Invoked when phone number for Press 0 to transfer is provided
  transferPhoneNumberInput(event) {
    this.transferNumberError = "";
    this.isTransferNumberFocused=false;
    this.transferPhoneNumber = event.target.value;
    if (this.transferPhoneNumber) {
      if (!this.util.isE164valid(this.transferPhoneNumber)) {
        this.transferNumberError = this.customizedTextJson.voice_management.invalid_phone_number_msg;
      } else {
        this.isTransferChecked = true;
      }
    } else if (!this.transferPhoneNumber) {
      this.isTransferChecked = false;
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putTransferToNumberService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isTransferChecked , this.transferPhoneNumber ,this.postVMTransferCheckedPut.bind(this));
      this.transferNumberError = this.customizedTextJson.voice_management.phone_number_required;
    }
    if (!this.transferNumberError){
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putTransferToNumberService(this.serviceRouteProvider.fetchVoicemailUrl(),this.isTransferChecked , this.transferPhoneNumber ,  this.postVMTransferCheckedPut.bind(this));
    }

  }

  //Invoked to make the Email Notification service input in focus
  emailNotificationKeyup() {
    this.emailNotificationError = "";
    this.isEmailNotificationFocused = true;
  }

  //Invoked to make the Email Carbon Copy service input in focus
  emailCarbonCopyKeyup() {
    this.emailCarbonCopyError = "";
    this.isEmailCarbonCopyFocused = true;
  }

  //Invoked when When Message Arrives is expanded
  whenMessageArrivesChecked() {

    if (this.iswhenMessageArrivesChecked){
      this.iswhenMessageArrivesChecked = false;
    } else { 
      this.iswhenMessageArrivesChecked = true;
    }
  }

  //Invoked when Use unified messaging toggle is switched ON/OFF
  isUnifiedMessagingEnabled() {
    if (this.isunifiedMessagingChecked) {
      this.isunifiedMessagingChecked = false;
      this.isforwardToEmailChecked = true;
      if (this.deliveryEmailAddress) {
        this.processingType = "Deliver To Email Address Only";
      } else {
        this.processingType = "Unified Voice and Email Messaging";
      }
    } else {
      this.isunifiedMessagingChecked = true;
      this.isforwardToEmailChecked = false;
      this.processingType = "Unified Voice and Email Messaging";
    }

    this.isVMServiceUpdateInprgress = true;
    this.vmServiceUpdateError = "";
    this.voicemailService.putMessageArrivesService(this.serviceRouteProvider.fetchVoicemailUrl(), this.processingType , this.deliveryEmailAddress , this.isMessageWaitingIndicatorChecked,this.postVMWhenMessageArrivesPut.bind(this));
  }

  //Invoked when Forward to Email Address toggle is switched ON/OFF
  isForwardToEmailEnabled() {

    if (this.isforwardToEmailChecked) {
      this.isforwardToEmailChecked = false;
      this.isunifiedMessagingChecked = true;
      this.processingType = "Unified Voice and Email Messaging";
    }
    else {
      this.isforwardToEmailChecked = true;
      this.isunifiedMessagingChecked = false;
      this.processingType = "Deliver To Email Address Only";
    }

    if ((this.deliveryEmailAddress && !this.forwardToEmailError) || (!this.isforwardToEmailChecked && this.deliveryEmailAddress)) {

      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      if(this.forwardToEmailError){
        this.deliveryEmailAddress = this.voicemailServiceInput.getVoiceMessageDeliveryEmailAddress();
        this.forwardToEmailError="";
      }
      this.voicemailService.putMessageArrivesService(this.serviceRouteProvider.fetchVoicemailUrl(), this.processingType , this.deliveryEmailAddress , this.isMessageWaitingIndicatorChecked,this.postVMWhenMessageArrivesPut.bind(this));
    } else {
      this.forwardToEmailError = this.customizedTextJson.voice_management.email_address_required;
    }
  }

  //Invoked when checkbox corresponding to Message Waiting Indicator is checked/unchecked
  unifiedMessagingIndicatorChecked() {
    if (this.voicemailService.fetchMessageWaitingIndicator()) {
      this.isMessageWaitingIndicatorChecked = false;
    } else {
      this.isMessageWaitingIndicatorChecked = true;
    }

    this.processingType = "Unified Voice and Email Messaging";
    this.isVMServiceUpdateInprgress = true;
    this.vmServiceUpdateError = "";
   this.voicemailService.putMessageArrivesService(this.serviceRouteProvider.fetchVoicemailUrl(), this.processingType , this.deliveryEmailAddress , this.isMessageWaitingIndicatorChecked,this.postVMWhenMessageArrivesPut.bind(this));

  }

  //Invoked when email address for Forward to Email Address is provided
  forwardToEmailAddress(event) {
    this.forwardToEmailError = "";
    this.isForwardToEmailFocused=false;
    this.deliveryEmailAddress = event.target.value;
    if (!this.util.emailRegx.test(this.deliveryEmailAddress)) {
      this.forwardToEmailError = this.customizedTextJson.voice_management.invalid_email_address_msg;
    }
    if (this.deliveryEmailAddress && !this.forwardToEmailError) {
      this.processingType = "Deliver To Email Address Only";
    } else if (!this.deliveryEmailAddress) {
      this.isforwardToEmailChecked = false;
      this.isunifiedMessagingChecked = true;
      this.processingType = "Unified Voice and Email Messaging";

      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putMessageArrivesService(this.serviceRouteProvider.fetchVoicemailUrl(), this.processingType , this.deliveryEmailAddress , this.isMessageWaitingIndicatorChecked,this.postVMWhenMessageArrivesPut.bind(this));

      this.forwardToEmailError = this.customizedTextJson.voice_management.email_address_required;
    }
    if (!this.forwardToEmailError){
      this.isVMServiceUpdateInprgress = true;
      this.vmServiceUpdateError = "";
      this.voicemailService.putMessageArrivesService(this.serviceRouteProvider.fetchVoicemailUrl(), this.processingType , this.deliveryEmailAddress , this.isMessageWaitingIndicatorChecked,this.postVMWhenMessageArrivesPut.bind(this));

    }
  }

  //Invoked to make the Forward to email address service input in focus
  forwardToEmailKeyup() {
    this.forwardToEmailError = "";
    this.isForwardToEmailFocused = true;
  }


  //Invoked when Send Calls to Voicemail option is selected
  private onSendCallsUpdateOptions(event) {
    
    let selectedCallOptions = event.currentTarget.selectedOptions;
    let result = [], callOptions;
    if (selectedCallOptions.length > 0) {

      for (var i = 0, iLen = selectedCallOptions.length; i < iLen; i++) {
        callOptions = selectedCallOptions[i];
        if (callOptions.selected) {
          result.push(callOptions.value || callOptions.text);
        }
      }
    }

    this.updateSendCallsCurrentOptions(result);
  }

  //Invoked to update the Send Calls to Voicemail selected options
  private updateSendCallsCurrentOptions(result) {
    

        this.sendCallsSelectedOptions = [];

    if (result.indexOf(this.customizedTextJson.voice_management.always) > -1) {
      this.isSendCallAlwaysSelected = true;
      this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.always);
    } else {
      this.isSendCallAlwaysSelected = false;
    }
    if (result.indexOf(this.customizedTextJson.voice_management.when_busy) > -1) {
      this.isSendCallBusySelected = true;
      this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_busy);
    } else {
      this.isSendCallBusySelected = false;
    }
    if (result.indexOf(this.customizedTextJson.voice_management.when_unanswered) > -1) {
      this.isSendCallNoAnswerSelected = true;
      this.sendCallsSelectedOptions.push(this.customizedTextJson.voice_management.when_unanswered);
    } else {
      this.isSendCallNoAnswerSelected = false;
    }
    if(this.isDesktop){
      if(result.length === 0){
        this.inputValue = this.customizedTextJson.none;
      } else {
        this.inputValue = result.join();
      }
    }

    this.isVMServiceUpdateInprgress = true;
    this.vmServiceUpdateError = "";
    this.voicemailService.putSendCallsToVoicemailService(this.serviceRouteProvider.fetchVoicemailUrl(), this.isSendCallAlwaysSelected,this.isSendCallBusySelected,  this.isSendCallNoAnswerSelected,this.postVMSendCallsPut.bind(this));
  }

  onDesktopSelectMenuHide(flag: boolean) {
    this.cswDesktopMenuShow = flag;
    this.hideSendCallsCurrentOptionsDropdown();
  }

  private showSendCallsCurrentOptionsDropdown(event) {
    this.isCallsettingsFocused = true;
    if (this.isDesktop) {
      this.cswDesktopMenuShow = true;
    }
  }
  private hideSendCallsCurrentOptionsDropdown() {
    this.isCallsettingsFocused = false;
  }


  //Invoked when Send Calls To Voicemail is expanded
  sendCallstoVoicemailChecked() {
    if (this.issendCallstoVoicemailChecked){
      this.issendCallstoVoicemailChecked = false;
    } else {
      this.issendCallstoVoicemailChecked = true;
    }
  }

  //Invoked to make the SendCallsToVoicemail Select options in focus
  setFocus(){
    this.isCallsettingsFocused = true;
  }


}