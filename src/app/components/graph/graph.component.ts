import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Node, Channel, Architecture, NamedType } from 'src/app/model/model';

import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

  @Input() nodes: Node[] = [];
  @Input() channels: Channel[] = [];
  initialized: boolean = false;
  changed: boolean = false;

  plumbIns: jsPlumbInstance = jsPlumb.getInstance();

  @Output() analyze = new EventEmitter<Architecture>();

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.createGraph();
    this.initialized = true;
  }

  ngAfterViewChecked() {
    if (this.changed) {
      this.changed = false;
      this.createGraph();
    }
  }

  ngOnChanges() {
    this.changed = true;
  }

  createGraph() {
    this.plumbIns.deleteEveryConnection();
    this.plumbIns.repaintEverything();
    this.plumbIns.ready(() => {
      for (let channel of this.channels) {
        console.log("Source " + channel.source.toString() + " : " +
          document.getElementById(channel.source.toString())
        );
        console.log("Dest " + channel.dest.toString() + " : " +
          document.getElementById(channel.dest.toString())
        );
        this.createChannel(this.plumbIns, channel.source.toString(), channel.dest.toString());
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
  }

  openDialog(channelIndex: number) {

    let sourceType = this.channels[channelIndex].sourceType;
    let destType = this.channels[channelIndex].destType;

    if (typeof sourceType === "undefined")
      sourceType = new NamedType(
        "newSource",
        "",
        [],
        "simple"
      );

    if (typeof destType === "undefined")
      destType = new NamedType(
        "newDest",
        "",
        [],
        "simple"
      );

    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
      width: '750px',
      data: {
        id: channelIndex,
        source: this.channels[channelIndex].source,
        dest: this.channels[channelIndex].dest,
        sourceType: sourceType,
        destType: destType
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.channels[result.id].sourceType = JSON.parse(result.sourceType);
      this.channels[result.id].destType = JSON.parse(result.destType);
    });
  }

  analyzeArchitecture() {
    let newArchitecture = new Architecture(
      this.nodes,
      this.channels
    );
    this.analyze.emit(newArchitecture);
  }

}