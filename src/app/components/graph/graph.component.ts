import { AfterViewInit, Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Node, Channel, Architecture, NamedType } from 'src/app/model/model';

import { jsPlumb, jsPlumbInstance } from 'jsplumb';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';
import { ImportTypesDialogComponent } from '../import-types-dialog/import-types-dialog.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {

  @Input() nodes: Node[] = [];
  @Input() channels: Channel[] = [];
  @Input() mismatches: Channel[] = [];
  @Input() newNodes: number[] = [];
  changed: boolean = false;
  @Input() lines: number[][] = [];

  plumbIns: jsPlumbInstance = jsPlumb.getInstance();

  @Output() resolve = new EventEmitter<Architecture>();
  @Output() analyze = new EventEmitter<Architecture>();

  constructor(public dialog: MatDialog) { }
  ngAfterViewInit() {
    this.createGraph();
  }

  ngAfterViewChecked() {
    if (this.changed) {
      this.changed = false;
      this.createGraph();
    }
  }

  ngOnChanges() {
    this.changed = true;
    this.cleanUI();
  }

  createGraph() {
    this.plumbIns.deleteEveryEndpoint();
    this.plumbIns.deleteEveryConnection();
    // this.plumbIns.ready(() => {})
    for (let channel of this.channels) {

      if (this.isAMismatch(channel))
        this.createChannel(this.plumbIns, channel.source.toString(), channel.dest.toString(), 'arrow-mismatch');
      else
        this.createChannel(this.plumbIns, channel.source.toString(), channel.dest.toString(), 'arrow');
    }
    // this.plumbIns.repaintEverything();
  }

  createChannel(plumbIns: jsPlumbInstance, sourceID: string, destID: string, css: string): void {
    var c = plumbIns.connect({
      // corresponding to the above basic concepts
      source: sourceID,
      target: destID,
      anchor: ['Left', 'Right', 'Top', 'Bottom', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
      connector: 'StateMachine',
      endpoint: 'Blank',
      overlays: [['Arrow', { width: 8, length: 8, location: 1 }]], // overlay
      cssClass: css
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

    console.log("OPENING DIALOG FOR CHANNEL : " + channelIndex);
    console.log("SOURCE : " + this.channels[channelIndex].source);
    console.log("DEST : " + this.channels[channelIndex].dest);
    console.log("SOURCETYPE : " + sourceType);
    console.log("DESTTYPE : " + destType);

    let sourceTypeSet = "[";
    for (let t of sourceType.typeset) sourceTypeSet = sourceTypeSet + this.stringifyType(t);
    sourceTypeSet = sourceTypeSet + "]";

    let destTypeSet = "[";
    for (let t of destType.typeset) destTypeSet = destTypeSet + this.stringifyType(t);
    destTypeSet = destTypeSet + "]";

    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
      width: '750px',
      data: {
        id: channelIndex,
        source: this.getNodeById(this.channels[channelIndex].source)?.sort,
        dest: this.getNodeById(this.channels[channelIndex].dest)?.sort,
        sourceType_name: sourceType.name,
        sourceType_xmltype: sourceType.xmltype,
        sourceType_typeset: sourceTypeSet,
        sourceType_type: sourceType.type,
        destType_name: destType.name,
        destType_xmltype: destType.xmltype,
        destType_typeset: destTypeSet,
        destType_type: destType.type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'undefined') {return;}
      console.log("DIALOG CLOSED WITH RESULT : ");
      console.log(result);
      this.channels[result.id].sourceType.name = result.sourceType_name;
      this.channels[result.id].sourceType.xmltype = result.sourceType_xmltype;
      this.channels[result.id].sourceType.typeset = JSON.parse(result.sourceType_typeset);
      this.channels[result.id].sourceType.type = result.sourceType_type;
      this.channels[result.id].destType.name = result.destType_name;
      this.channels[result.id].destType.xmltype = result.destType_xmltype;
      this.channels[result.id].destType.typeset = JSON.parse(result.destType_typeset);
      this.channels[result.id].destType.type = result.destType_type;
      console.log("MISMATCHES AFTER DIALOG CLOSE BEFORE CALLING");
      console.log(this.mismatches);
      // this.channels[result.id].sourceType = JSON.parse(result.sourceType);
      // this.channels[result.id].destType = JSON.parse(result.destType);
    });
  }

  analyzeArchitecture() {
    let newArchitecture = new Architecture(
      this.nodes,
      this.channels,
      []
    );
    this.analyze.emit(newArchitecture);
  }

  resolveMismatches() {
    let newArchitecture = new Architecture(
      this.nodes,
      this.channels,
      []
    );
    this.resolve.emit(newArchitecture);
  }

  isNew (nodeID : number) {
    let found = false;
    for (let n of this.newNodes) {
      if (n === nodeID){
        found = true;
        break;
      }
    }
    return found;
  }

  getNodeById(id: number): Node | null {
    for (let node of this.nodes)
      if (node.id === id) return node;

    return null;
  }

  isAMismatch(channel: Channel): boolean {
    for (let m of this.mismatches){
      if (this.channelEquality(m, channel))
        return true;
    }
    return false;
  }

  stringifyChannel(channel: Channel): string {
    let result = "{" +
      "\"source\":\"" + channel.source + "\"," +
      "\"sourceType\":" + this.stringifyType(channel.sourceType) + "," +
      "\"dest\":\"" + channel.dest + "\"," +
      "\"destType\":" + this.stringifyType(channel.destType) + "}";
      
    return result;
  }

  channelEquality(c1: Channel, c2:Channel): boolean {
    if (c1.source === c2.source &&
      c1.dest === c2.dest &&
      this.typeEquality(c1.sourceType, c2.sourceType) &&
      this.typeEquality(c1.destType, c2.destType))
    return true;
    else return false;
  }

  stringifyType(type: NamedType): string {
    let result = "{" +
      "\"name\":\"" + type.name + "\"," +
      "\"xmltype\":\"" + type.xmltype + "\"," +
      "\"typeset\": [";

    for (let t of type.typeset) {
      result = result + this.stringifyType(t);
    }

    result = result + "], " +
      "\"type\":\"" + type.type + "\"" + "}";

    return result;
  }

  typeEquality(t1: NamedType, t2:NamedType): boolean {
    if (t1.name === t2.name &&
      t1.type === t2.type){
          if (t2.type === 'simple'){ 
              if (t2.xmltype === t1.xmltype) return true;
              else return false;
          }else{
            for (let t of t1.typeset) {
              let found = false;
              for (let k of t2.typeset){
                if (this.typeEquality(t,k)){ found = true; break; }
              }
              if (!found) return false;
            }
            return true;
          }
    }
    return false;
  }

  cleanUI() {
    var elements = document.getElementsByClassName("nodeLine");
    while(elements.length > 0) {
        if(elements[0].parentNode != null) {
          elements[0].parentNode.removeChild(elements[0]);
        }
    }
  }

  cleanChannels() {
    var elements = document.getElementsByClassName("arrow");
    while(elements.length > 0) {
        if(elements[0].parentNode != null) {
          elements[0].parentNode.removeChild(elements[0]);
        }
    }

    elements = document.getElementsByClassName("arrow-mismatch");
    while(elements.length > 0) {
        if(elements[0].parentNode != null) {
          elements[0].parentNode.removeChild(elements[0]);
        }
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    console.log("resize");
    // this.plumbIns.repaintEverything();
  }

  graphScroll() {
    // console.log("graph scroll");
    // this.cleanChannels();
    // this.createGraph();

    var arrows = document.getElementsByTagName("svg");
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].style.position = "relative";
      arrows[i].style.left = (parseInt(arrows[i].style.left) - 350 - 31*i).toString() + "px";
      arrows[i].style.top = (parseInt(arrows[i].style.top) - 1965).toString() + "px";
        
      document.getElementsByClassName("graph-container")[0].appendChild(arrows[i]);
    }
  }

  importChannels () {
    const dialogRef = this.dialog.open(ImportTypesDialogComponent, {
      width: '750px',
      data: {
        types: JSON.stringify(this.channels, null, 4)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'undefined') {return;}
      console.log("DIALOG CLOSED WITH RESULT : ");
      console.log(result);

      this.channels = JSON.parse(result.types);

    });
  }
}