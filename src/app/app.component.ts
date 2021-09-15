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
  mismatches: Channel[] = new Array;
  newNodes: number[] = new Array;
  success: boolean = false;
  lines: number[][] = [];

  title = 'mismatchresolver-frontend';

  constructor(public parseService: ParseService) { }

  ngOnInit() { }

  orderChannels() {
    let orderedChannels: Channel[] = [];
    for (let c of this.channels) {
      if (c.source === 0) orderedChannels.push(c);
    }

    this.insertFollowing(orderedChannels, orderedChannels[0].dest);

    this.channels = orderedChannels;
  }

  insertFollowing(list: Channel[], source: number) {

    for (let c of this.channels) {
      if (c.source === source) {
        if(list.indexOf(c) < 0) list.push(c);
        this.insertFollowing(list, c.dest);
      }
    }

  }

  createLines() {
    this.orderChannels();
    console.log("ORDERED CHANNELS");
    console.log(this.channels);
    this.lines = [];
    let set_ids = [];
    this.lines.push([]);
    this.lines[0].push(0);
    set_ids.push(0);
    for (let c of this.channels) {
      let s = c.source;
      let i = 0;
      let childs_count = 0;
      for (let c1 of this.channels) {
        if (s === c1.source) { childs_count++; }
      }
      if (childs_count === 1) {
        let parent_line = -1;
        for (let line of this.lines) {
          for (let node of line) {
            if (s === node) {
              parent_line = this.lines.indexOf(line);
              break;
            }
          }
          if (parent_line >= 0) break;
        }
        if (set_ids.indexOf(c.dest) < 0 && parent_line >= 0) {
          this.lines[parent_line].push(c.dest);
          set_ids.push(c.dest);
        } else {
          if (set_ids.indexOf(c.dest) < 0) {
            this.lines[i].push(c.dest);
            set_ids.push(c.dest);
          }
          i++;
        }
      } else {
        for (let c2 of this.channels) {
          if (s === c2.source) {
            while (this.lines.length <= i) {
              this.lines.push([]);
              for (let j = 0; j < this.lines[this.lines.length - 2].length - 1; j++)
                this.lines[this.lines.length - 1].push(-1);
            }
            if (set_ids.indexOf(c2.dest) < 0) {
              this.lines[i].push(c2.dest);
              set_ids.push(c2.dest);
            }
            i++;
          }
        }
      }
    }
    console.log("LINES CREATED : ");
    console.log(this.lines);
  }

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
            this.createLines();
            this.success = true;
            this.mismatches = new Array;
          }
        );
      },
      error => {
        alert("Error in communication with server, please retry");
      }
    );
  }

  containsNode (nodes : Node[], node : Node) : boolean {
    let found = false;
    for (let n of nodes){
      if (n.id === node.id) {
        found = true;
        break;
      }
    }
    return found;
  }

  onResolve(architecture: Architecture) {
    this.parseService.setArchitecture(architecture).subscribe(
      success => {
        this.parseService.getFixedArchitecture().subscribe(
          (data: Architecture) => {

            for (let n of data.nodes) {
              if (!this.containsNode(this.nodes, n)) {
                this.newNodes.push(n.id);
              }
            }

            this.nodes = data.nodes;
            this.channels = data.channels;
            this.mismatches = data.mismatches;
            console.log("FIXED ARCHITECTURE RECEIVED WITH BODY : ");
            console.log(data);
            for (let channel of this.channels) {
              if (typeof channel.sourceType === "undefined")
                channel.sourceType = new NamedType("empty", "empty", [], "empty");
              if (typeof channel.destType === "undefined")
                channel.destType = new NamedType("empty", "empty", [], "empty");
            }
            this.createLines();
            this.success = true;
            console.log("NEW CHANNELS : ");
            console.log(this.channels);
          }
        );
      },
      error => {
        alert("Error in communication with server, please retry");
      }
    );
  }

  onAnalyze(architecture: Architecture) {
    this.parseService.setArchitecture(architecture).subscribe(
      success => {
        this.parseService.getAnalyzedArchitecture().subscribe(
          (data: Architecture) => {
            this.nodes = data.nodes;
            this.channels = data.channels;
            this.mismatches = data.mismatches;

            if (this.mismatches.length === 0)
              alert("Your architecture is already valid.");
            else
              alert("Your architecture presents " + this.mismatches.length + " mismatches, they are signaled in red.");

            console.log("MISMATCHES RECEIVED WITH BODY : ");
            console.log(data);
            for (let channel of this.channels) {
              if (typeof channel.sourceType === "undefined")
                channel.sourceType = new NamedType("empty", "empty", [], "empty");
              if (typeof channel.destType === "undefined")
                channel.destType = new NamedType("empty", "empty", [], "empty");
            }
            this.createLines();
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
