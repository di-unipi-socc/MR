import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  types: string;
}

@Component({
  selector: 'app-import-types-dialog',
  templateUrl: './import-types-dialog.component.html',
  styleUrls: ['./import-types-dialog.component.css']
})
export class ImportTypesDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImportTypesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
