export class NamedType {
  constructor(
    public name:string, public xmltype:string,
    public typeset: NamedType[], public type:string
  ){}

  // toString(): string {
  //   let result = "{" +
  //     "\"name\":\"" + this.name + "\"," +
  //     "\"xmltype\":\"" + this.xmltype + "\"," +
  //     "\"typeset\": [";

  //   for (let type of this.typeset) {
  //     result = result + type.toString();
  //   }

  //   result = result + "], " +
  //     "\"type\":\"" + this.type + "\"" + "}";

  //   return result;
  // }

  // equals(n: NamedType): boolean {
  //   if (n.name === this.name &&
  //       n.type === this.type){
  //         if (this.type === 'simple'){ 
  //             if (this.xmltype === n.xmltype) return true;
  //             else return false;
  //         }else{
  //           for (let t1 of n.typeset) {
  //             let found = false;
  //             for (let t2 of this.typeset){
  //               if (t1.equals(t2)){ found = true; break; }
  //             }
  //             if (!found) return false;
  //           }
  //           return true;
  //         }
  //   }
  //   return false;
  // }
}

export interface Node {
  id: number;
  sort: string;
  inputs: NamedType[];
  outputs: NamedType[];
}

export class Channel {
  constructor(public source: number, public sourceType: NamedType,
    public dest: number, public destType: NamedType){}

  // toString(): string {
  //   let result = "{" +
  //     "\"source\":\"" + this.source + "\"," +
  //     "\"sourceType\":" + this.sourceType.toString() + "," +
  //     "\"dest\":\"" + this.dest + "\"," +
  //     "\"destType\":" + this.destType.toString() + "}";
      
  //   return result;
  // }

  // equals(c: Channel): boolean {
  //   if (this.source === c.source &&
  //     this.dest === c.dest &&
  //     this.sourceType.equals(c.sourceType) &&
  //     this.destType.equals(c.destType))
  //   return true;
  //   else return false;
  // }
}

export class Architecture {
  constructor(public nodes: Node[], public channels: Channel[], public mismatches: Channel[]) {
  }
}
