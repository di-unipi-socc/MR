import { Component, OnInit, Injectable } from '@angular/core';

import { Architecture, Channel, Node } from 'src/app/model/model';
import { FormServiceService } from 'src/app/services/form-service/form-service.service';

@Injectable()
@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnInit {

  inputRoute: string = "";
  nodes: Node[] = new Array;
  channels: Channel[] = new Array;

  constructor(public formService: FormServiceService) { }

  ngOnInit(): void {
  }

  parseRoute() {
    this.formService.postRoute(this.inputRoute).subscribe(
      response => console.log(response)
    );

    this.formService.getArchitecture().subscribe(
      (data: Architecture) => {
        this.nodes = data.nodes;
        this.channels = data.channels;
      }
    );
  }

}
