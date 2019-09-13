/* Copyright © 2017 BroadSoft Inc. */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CallForwardingServiceInput } from './IncomingCalls/CallForwarding/callForwardingServiceInput.service';
import { CallForwardingService } from './IncomingCalls/CallForwarding/callForwardingService.service';
import { BroadworksMobilityComponent } from './CallControl/BroadWorksMobility/broadworksMobility.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule} from 'angular-webstorage-service';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxWebstorageModule } from 'ngx-webstorage';

import 'hammerjs'

import { AppComponent } from './AppCommon/app.component';
import { IncomingComponent } from './IncomingCalls/incoming.component';
import { SimultaneousRingComponent } from './IncomingCalls/SimultaneousRing/simultaneousRing.component';
import { OutgoingComponent } from './OutgoingCalls/outgoing.component';
import { RemoteOfficeComponent } from './IncomingCalls/RemoteOffice/remoteOffice.component';
import { CallForwardComponent } from './IncomingCalls/CallForwarding/callForward.component';
import { VoicemailComponent } from './Voicemail/voicemail.component';
import { OutOfOfficeComponent } from './IncomingCalls/OutOfOffice/outOfOffice.component';
import { CallCenterComponent } from './CallControl/CallCenterQueues/callcenter.component';
import { SequentialRingComponent } from './IncomingCalls/SequentialRing/sequentialRing.component';
import { BroadworksAnywhereComponent } from './CallControl/BroadworksAnywhere/broadworksAnywhere.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';



import { Util } from './AppCommon/util';
import { DesktopSelectDropdownComponent } from './common/desktopSelectDropdown.component';
import { CallControlComponent } from './CallControl/callControl.component';
import { ServiceRouteProvider } from './AppCommon/serviceRouteProvider.service';
import { HttpServices } from './AppCommon/httpservices.service';
import { BroadWorksMobilityServiceInput } from 'app/CallControl/BroadWorksMobility/broadWorksMobilityServiceInput.service';
import { BroadWorksMobilityService } from 'app/CallControl/BroadWorksMobility/broadWorksMobility.service';
import { VoicemailServiceInput } from 'app/Voicemail/voicemailServiceInput.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { APP_BASE_HREF } from '@angular/common';
import { AlertingComponent } from './alerting/alerting.component';
import { FixedComponent } from './fixed/fixed.component';
import { MobileComponent } from './mobile/mobile.component';
import { PrimarymobileComponent } from './primarymobile/primarymobile.component';
import { PrimaryfixedComponent } from './primaryfixed/primaryfixed.component';

@NgModule({
  declarations: [
    AppComponent,
   IncomingComponent,
   OutgoingComponent,
    VoicemailComponent,
    SimultaneousRingComponent,
   RemoteOfficeComponent,
    CallForwardComponent,
    BroadworksMobilityComponent,
    CallControlComponent,
    OutOfOfficeComponent,
    CallCenterComponent,
    SequentialRingComponent,
    BroadworksAnywhereComponent,
    DesktopSelectDropdownComponent,
    DialogComponent,
    AlertingComponent,
    FixedComponent,
    MobileComponent,
    PrimarymobileComponent,
    PrimaryfixedComponent
  ],
  entryComponents: [DialogComponent, AlertingComponent, FixedComponent, MobileComponent, PrimarymobileComponent, PrimaryfixedComponent  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatRippleModule,
    MatListModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    StorageServiceModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxWebstorageModule.forRoot(),
  ],
  exports: [DialogComponent],
  providers: [VoicemailServiceInput, ServiceRouteProvider, BroadWorksMobilityService,
              BroadWorksMobilityServiceInput, HttpServices, CallForwardingService,
              CallForwardingServiceInput, Util, ServiceRouteProvider, {provide: APP_BASE_HREF, useValue: './'} ],
  bootstrap: [AppComponent]
})
export class AppModule { }

