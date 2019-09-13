import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimaryFixedDialogData } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'app-primaryfixed',
  templateUrl: './primaryfixed.component.html',
  styleUrls: ['./primaryfixed.component.css']
})
export class PrimaryfixedComponent implements OnInit {
  customizedTextJson = window['customizedTexts'];

  constructor(public dialogRef: MatDialogRef<PrimaryfixedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrimaryFixedDialogData) { }
  onNoClick(): void {
    this.data.pnrfdDOList.forEach(element => {
      if (this.data.allSelectedSettings.includes(element.name)) {
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
