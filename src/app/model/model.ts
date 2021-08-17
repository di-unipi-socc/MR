export class NamedType {
  // name: string;
  // XMLType: string;
  // typeSet: NamedType[];
  // type: string;

  constructor(
    public name:string, public xmltype:string,
    public typeset: NamedType[], public type:string
  ){}

  toString(): string {
    let result = "{" +
      "\"name\":\"" + this.name + "\"," +
      "\"XMLType\":\"" + this.xmltype + "\"," +
      "\"typeSet\": [";

    for (let type in this.typeset) {
      result = result + this.typeset.toString();
    }

    result = result + "], " +
      "\"type\":\"" + this.type + "\"" + "}";

    return result;
  }
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
