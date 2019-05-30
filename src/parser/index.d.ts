export = parse;

declare function parse(source: string): parse.ComicChild[];

declare namespace parse {
  export type ComicChild = Page | Panel | Metadata | Paragraph;

  export type Paragraph = {
    id: number;
    type: string;
    content: string;
    startingLine: number;
  }

  export type Metadata = {
    id: number;
    type: string;
    name: string;
    value: string;
    startingLine: number;
  }

  export type Page = {
    id: number;
    type: string;
    number: number;
    content: PageChild[];
    panelCount: number;
    speakers: string[];
    dialogueCount: number;
    captionCount: number;
    sfxCount: number;
    dialogueWordCount: number;
    captionWordCount: number;
    startingLine: number;
  }

  export type PageChild = Panel | Lettering | Paragraph;

  export type Panel = {
    id: number;
    type: string;
    number: number;
    content: PanelChild[]
  }

  export type PanelChild = Lettering | Metadata | Paragraph;

  export type Lettering = Dialogue | Caption | Sfx;

  export type Dialogue = {
    id: number;
    type: string;
    number: number;
    speaker: string;
    modifier: string;
    content: LetteringContentChunk[];
    wordCount: number;
    startingLine: number;
  }

  export type Caption = {
    id: number;
    type: string;
    number: number;
    modifier: string;
    content: LetteringContentChunk[];
    wordCount: number;
    startingLine: number;
  }

  export type Sfx = {
    id: number;
    type: string;
    number: number;
    modifier: string;
    content: string;
    startingLine: number;
  }

  export type LetteringContentChunk = {
    type: "text" | "lettering-bold";
    content: string;
  }
}
