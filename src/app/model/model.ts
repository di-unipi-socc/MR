export interface NamedType {
    name: string;
    XMLType: string;
    typeSet: NamedType[];
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
  
  export interface Architecture {
    nodes: Node[];
    channels: Channel[];
  }
  