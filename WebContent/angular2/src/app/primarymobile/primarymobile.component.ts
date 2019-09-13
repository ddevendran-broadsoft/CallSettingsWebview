import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimaryMobileDialogData } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'app-primarymobile',
  templateUrl: './primarymobile.component.html',
  styleUrls: ['./primarymobile.component.css']
})
export class PrimarymobileComponent implements OnInit {

  customizedTextJson = window['customizedTexts'];

  constructor(public dialogRef: MatDialogRef<PrimarymobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrimaryMobileDialogData) { }
  onNoClick(): void {
    this.data.pnrmdDOList.forEach(element => {
      if (this.data.allSelectedMobileDeviceNumbers.includes(element.name)) {
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

