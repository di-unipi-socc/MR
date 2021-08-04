import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: number;
  source: string;
  sourceType: string;
  dest:string;
  destType:string;
}

@Component({
  selector: 'app-add-type-dialog',
  templateUrl: './add-type-dialog.component.html',
  styleUrls: ['./add-type-dialog.component.css']
})
export class AddTypeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
