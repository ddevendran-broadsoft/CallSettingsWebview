import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FixedDialogData } from 'app/CallControl/BroadWorksMobility/broadworksMobility.component';

@Component({
  selector: 'app-fixed',
  templateUrl: './fixed.component.html',
  styleUrls: ['./fixed.component.css']
})
export class FixedComponent implements OnInit {

  customizedTextJson = window['customizedTexts'];

  constructor(public dialogRef: MatDialogRef<FixedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FixedDialogData) { }
  onNoClick(): void {
    this.data.mnrfdDOList.forEach(element => {
      if (this.data.allSelectedSettingsMobileNumber.includes(element.name)) {
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