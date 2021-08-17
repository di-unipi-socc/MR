import { Component, OnInit } from '@angular/core';
import { Node, Architecture, Channel, NamedType } from './model/model';
import { ParseService } from './services/parse-service/parse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  inputRoute: string = "";

  nodes: Node[] = new Array;
  channels: Channel[] = new Array;
  success: boolean = false;

  title = 'mismatchresolver-frontend';

  constructor(public parseService: ParseService) { }

  ngOnInit() { }

  onParse(inputRoute: string) {
    this.inputRoute = inputRoute;

    this.parseService.postRoute(this.inputRoute).subscribe(
      success => {
        this.parseService.getArchitecture().subscribe(
          (data: Architecture) => {
            this.nodes = data.nodes;
            this.channels = data.channels;
            for (let channel of this.channels) {
              if (typeof channel.sourceType === "undefined")
                channel.sourceType = new NamedType("empty", "empty", [], "empty");
              if (typeof channel.destType === "undefined")
                channel.destType = new NamedType("empty", "empty", [], "empty");
            }
            this.success = true;
          }
        );
      },
      error => {
        alert("Error in communication with server, please retry");
      }
    );
  }

  onAnalyze(architecture: Architecture) {
    this.parseService.analyzeArchitecture(architecture).subscribe(
      success => {
        this.parseService.getFixedArchitecture().subscribe(
          (data: Architecture) => {
            this.nodes = data.nodes;
            this.channels = data.channels;
            for (let channel of this.channels) {
              console.log(channel);
              if (typeof channel.sourceType === "undefined")
                channel.sourceType = new NamedType("empty", "empty", [], "empty");
              if (typeof channel.destType === "undefined")
                channel.destType = new NamedType("empty", "empty", [], "empty");
            }
            this.success = true;
          }
        );
      },
      error => {
        alert("Error in communication with server, please retry");
      }
    );
  }
}
