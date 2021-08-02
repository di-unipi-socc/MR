import { Component, OnInit, Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Architecture, FormServiceService } from 'src/app/services/form-service/form-service.service';

@Injectable()
@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnInit {
  
  inputRoute: string = "";
  outputRoute: any;

  constructor(public formService : FormServiceService) { }

  ngOnInit(): void {
  }

  parseRoute() {
    this.formService.postRoute(this.inputRoute).subscribe(
      response => console.log(response)
    );

    this.formService.getArchitecture().subscribe(
      (data : Architecture) => {
        this.outputRoute = "Nodes : \n";
        for (let node in data.nodes) 
          this.outputRoute += "Node : " + node + "\n";

        this.outputRoute += "Channels : \n";
        for (let channel in data.channels) 
          this.outputRoute += "Channel : " + channel + "\n";

      }
    );
  }

}
