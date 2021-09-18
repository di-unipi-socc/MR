import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: number;
  source: string;
  sourceType_name: string;
  sourceType_xmltype: string;
  sourceType_typeset: string;
  sourceType_type: string;
  dest: string;
  destType_name: string;
  destType_xmltype: string;
  destType_typeset: string;
  destType_type: string;
}

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.css']
})
export class AddChannelDialogComponent implements OnInit {

  types: any[] = [
    {value: 'simple', viewValue: 'Simple'},
    {value: 'composite', viewValue: 'Composite'}
  ];

  constructor(public dialogRef: MatDialogRef<AddChannelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log("OPENING DIALOG WITH DATA : ");
      console.log(data);
     }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
