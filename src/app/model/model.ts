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
  
  export class Architecture {
    constructor(public nodes: Node[], public channels: Channel[]) {
    }

    // toJSON() : string {
    //   let json = "{ \"architecture\":";
    //   json = json + "{";
    //   json = json + "\"nodes\":{"
    //   for(let node of this.nodes){
    //     json = json + ""
    //   }
    //   json = json + "},";
    //   json = json + "}";
    //   return json;
    // }
  }
  