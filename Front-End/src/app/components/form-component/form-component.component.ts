import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnInit {

  inputRoute: string = "";
  @Output() parse = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  parseRoute() {
    this.parse.emit(this.inputRoute);
  }

}
