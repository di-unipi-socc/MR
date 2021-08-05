import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Node, Channel, Architecture } from 'src/app/model/model';

import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { MatDialog } from '@angular/material/dialog';
import { AddTypeDialogComponent } from '../add-type-dialog/add-type-dialog.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

  @Input() nodes: Node[] = [];
  @Input() channels: Channel[] = [];
  initialized:boolean = false;

  plumbIns: jsPlumbInstance = jsPlumb.getInstance();

  @Output() analyze = new EventEmitter<Architecture>();

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.createGraph();
    this.initialized = true;
  }

  ngOnChanges() {
    if (this.initialized) this.createGraph();
  }

  createGraph() {
    this.plumbIns.deleteEveryConnection();
    this.plumbIns.repaintEverything();
    this.plumbIns.ready(() => {
      for (let channels of this.channels) {
        this.createChannel(this.plumbIns, channels.source.toString(), channels.dest.toString());
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
    const dialogRef = this.dialog.open(AddTypeDialogComponent, {
      width: '750px',
      data: {
        id: channelIndex,
        source: this.channels[channelIndex].source,
        dest: this.channels[channelIndex].dest,
        sourceType: this.channels[channelIndex].sourceType,
        destType: this.channels[channelIndex].destType
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