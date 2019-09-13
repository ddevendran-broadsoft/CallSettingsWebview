import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertingDialogData } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'app-alerting',
  templateUrl: './alerting.component.html',
  styleUrls: ['./alerting.component.css']
})
export class AlertingComponent implements OnInit {

  public customizedTextJson = window['customizedTexts'];

  constructor(public dialogRef: MatDialogRef<AlertingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertingDialogData) { }
  onNoClick(): void {
    this.data.mngsDOList.forEach(element => {
      if (this.data.allSelectedGeneralSettingsOptions.includes(element.name)) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
