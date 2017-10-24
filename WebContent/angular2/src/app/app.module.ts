/* Copyright © 2017 BroadSoft Inc. */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule} from '@angular/material';
import { CallForwardingServiceInput } from './IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { CallForwardingService } from './IncomingCalls/CallForwarding/callForwardingService.service';
import { BroadworksMobilityComponent } from './CallControl/BroadWorksMobility/broadworksMobility.component';
import 'hammerjs'

import { AppComponent } from './AppCommon/app.component';
import {IncomingComponent } from './IncomingCalls/incoming.component';
import { SimultaneousRingComponent } from './IncomingCalls/SimultaneousRing/simultaneousRing.component';
import {OutgoingComponent } from './OutgoingCalls/outgoing.component';
import {RemoteOfficeComponent } from './IncomingCalls/RemoteOffice/remoteOffice.component';
import { CallForwardComponent } from './IncomingCalls/CallForwarding/callForward.component';
import { voicemailComponent } from './Voicemail/voicemail.component';
import { OutOfOfficeComponent } from './IncomingCalls/OutOfOffice/outOfOffice.component';
import { CallCenterComponent } from './CallControl/CallCenterQueues/callcenter.component';
import { SequentialRingComponent } from './IncomingCalls/SequentialRing/sequentialRing.component';
import { BroadworksAnywhereComponent } from './CallControl/BroadworksAnywhere/broadworksAnywhere.component';

import { Util } from './AppCommon/util';
import {DesktopSelectDropdown } from './common/desktopSelectDropdown.component';
import { CallControlComponent } from './CallControl/callControl.component';
import { ServiceRouteProvider } from './AppCommon/serviceRouteProvider.service';
import { HttpServices } from './AppCommon/httpservices.service';
import { BroadWorksMobilityServiceInput } from 'app/CallControl/BroadWorksMobility/broadWorksMobilityServiceInput.service';
import { BroadWorksMobilityService } from 'app/CallControl/BroadWorksMobility/broadWorksMobility.service';
import { XSIServices } from './AppCommon/xsiServiceList.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';
// import { BroadworksAnywhereService } from 'app/CallControl/BroadworksAnywhere/broadworksAnywhereService.service';

@NgModule({
  declarations: [
    AppComponent,
   IncomingComponent,
   OutgoingComponent,
    voicemailComponent,
    SimultaneousRingComponent,
   RemoteOfficeComponent,
    CallForwardComponent,
    BroadworksMobilityComponent,
    CallControlComponent,
    OutOfOfficeComponent,
    CallCenterComponent,
    SequentialRingComponent,
    BroadworksAnywhereComponent,
    DesktopSelectDropdown
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [VoicemailServiceInput, ServiceRouteProvider, BroadWorksMobilityService,
              BroadWorksMobilityServiceInput, HttpServices, CallForwardingService,
              CallForwardingServiceInput, Util, ServiceRouteProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }

