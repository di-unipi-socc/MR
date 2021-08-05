export interface NamedType {
    name: string;
    XMLType: string;
    typeSet: NamedType[];
    type: string;
}

export interface Node {
    id: number;
    sort: string;
    inputs: NamedType[];
    outputs: NamedType[];
  }
  
  export interface Channel {
    source: number;
    sourceType: NamedType;
    dest: number;
    destType: NamedType;
  }
  
  export class Architecture {
    constructor(public nodes: Node[], public channels: Channel[]) {
    }
  }
  