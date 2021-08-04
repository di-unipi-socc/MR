import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Node, Channel } from 'src/app/model/model';

import { jsPlumb, jsPlumbInstance } from 'jsplumb';

//TODO importare JSPLUMB Community e creare un esempio di grafo con due nodi e un canale

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

  @Input() nodes: Node[] = [];
  @Input() channels: Channel[] = [];
  initialized:boolean = false;

  constructor() { }

  ngAfterViewInit() {
    this.createGraph();
    this.initialized = true;
  }

  ngOnChanges() {
    if (this.initialized) this.createGraph();
  }

  createGraph() {
    let plumbIns = jsPlumb.getInstance();
    plumbIns.deleteEveryConnection();
    plumbIns.repaintEverything();
    plumbIns.ready(() => {
      for (let channels of this.channels) {
        this.createChannel(plumbIns, channels.source.toString(), channels.dest.toString());
      }
    });
  }

  createChannel(plumbIns: jsPlumbInstance, sourceID: string, destID: string): void {
    plumbIns.connect({
      // corresponding to the above basic concepts
      source: sourceID,
      target: destID,
      anchor: ['Left', 'Right', 'Top', 'Bottom', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
      connector: 'StateMachine',
      endpoint: 'Blank',
      overlays: [['Arrow', { width: 8, length: 8, location: 1 }]], // overlay
      // add style
      // paintStyle: { stroke: '#909399', strokeWidth: 2 }, // connector
      // endpointStyle: { fill: '#909399', outlineStroke: '#606266', outlineWidth: 1 } // endpoint
    });
    console.log(plumbIns.getAllConnections().length);
  }
}