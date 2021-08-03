import { Component, Input, OnInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { Node, Channel } from 'src/app/model/model';

//TODO importare JSPLUMB Community e creare un esempio di grafo con due nodi e un canale

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let plumbIns = jsPlumb.getInstance()
    plumbIns.ready(function () {
      plumbIns.connect({
        // corresponding to the above basic concepts
        source: 'item-8',
        target: 'item-9',
        anchor: ['Left', 'Right', 'Top', 'Bottom', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
        connector: 'StateMachine',
        endpoint: 'Blank',
        overlays: [['Arrow', { width: 8, length: 8, location: 1 }]], // overlay
        // add style
        // paintStyle: { stroke: '#909399', strokeWidth: 2 }, // connector
        // endpointStyle: { fill: '#909399', outlineStroke: '#606266', outlineWidth: 1 } // endpoint
      })
    })

  }

}