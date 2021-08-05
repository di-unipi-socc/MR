import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NamedType } from 'src/app/model/model';

export interface DialogData {
  id: number;
  source: number;
  sourceType: NamedType;
  dest: number;
  destType: NamedType;
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
