import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MobileDialogData } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  customizedTextJson = window['customizedTexts'];

  constructor(public dialogRef: MatDialogRef<MobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MobileDialogData) { }
  onNoClick(): void {
    this.data.mnrmdDOList.forEach(element => {
      if (this.data.allSelectedMobileNumbersUnderMobileIdentity.includes(element.name)) {
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
