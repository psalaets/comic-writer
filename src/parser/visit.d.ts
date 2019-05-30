export = visit;

declare function visit(nodes: string, visitor: object): void;

declare namespace visit {
    export type LetteringContentChunk = {
    type: "text" | "lettering-bold";
    content: string;
  }
}
