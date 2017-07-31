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
import { incomingComponent } from './IncomingCalls/incoming.component';
import { SimultaneousRingComponent } from './IncomingCalls/SimultaneousRing/simultaneousRing.component';
import { outgoingComponent } from  './OutgoingCalls/outgoing.component';
import { remoteOfficeComponent } from './IncomingCalls/RemoteOffice/remoteOffice.component';
import { callForwardComponent } from './IncomingCalls/CallForwarding/callForward.component';
import { voicemailComponent } from './Voicemail/voicemail.component';

import { Util } from './AppCommon/util';
import { DesktopSelectDropdown } from './common/desktopSelectDropdown.component';
import { CallControlComponent } from './CallControl/callControl.component';
import { ServiceRouteProvider } from './AppCommon/serviceRouteProvider.service'; 
import { HttpServices } from './AppCommon/httpservices.service';
import { CallControlServiceInput } from 'app/CallControl/callControlServiceInput.service';
import { BroadWorksMobilityService } from 'app/CallControl/BroadWorksMobility/broadWorksMobilityService.service';
import { XSIServices } from './AppCommon/xsiServiceList.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';

@NgModule({
  declarations: [
    AppComponent,
    incomingComponent,
    outgoingComponent,
    voicemailComponent,
    SimultaneousRingComponent,
    remoteOfficeComponent ,
    callForwardComponent,
    BroadworksMobilityComponent,
    CallControlComponent,
    DesktopSelectDropdown
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  providers: [VoicemailServiceInput, ServiceRouteProvider, BroadWorksMobilityService, CallControlServiceInput, HttpServices, CallForwardingService, CallForwardingServiceInput, Util, ServiceRouteProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }

