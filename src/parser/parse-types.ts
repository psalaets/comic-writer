/** Anything that can appear anywhere in a comic. */
export type ComicNode = Spread | Panel | Lettering | Metadata | Paragraph | LetteringContentChunk;

/** Top level nodes of a comic. */
export type ComicChild = Spread | Panel | Metadata | Paragraph;

export interface Paragraph {
  id: string;
  type: 'paragraph';
  content: string;
  startingLine: number;
}

export interface Metadata {
  id: string;
  type: 'metadata';
  name: string;
  value: string;
  startingLine: number;
}

export interface Spread {
  id: string;
  type: 'spread';
  label: string;
  content: SpreadChild[];
  pageCount: number;
  panelCount: number;
  speakers: string[];
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
  startingLine: number;
}

/** Immediate children of a spread. */
export type SpreadChild = Panel | Lettering | Paragraph;

export interface Panel {
  id: string;
  type: 'panel';
  number: number;
  content: PanelChild[];

  speakers: string[];
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
  startingLine: number;
}

/** Immediate children of a panel. */
export type PanelChild = Lettering | Metadata | Paragraph;

export type Lettering = Dialogue | Caption | Sfx;

export interface Dialogue {
  id: string;
  type: 'dialogue';
  number: number;
  speaker: string;
  modifier: string | null;
  content: LetteringContentChunk[];
  wordCount: number;
  startingLine: number;
}

export interface Caption {
  id: string;
  type: 'caption';
  number: number;
  modifier: string | null;
  content: LetteringContentChunk[];
  wordCount: number;
  startingLine: number;
}

export interface Sfx {
  id: string;
  type: 'sfx';
  number: number;
  modifier: string | null;
  content: string;
  startingLine: number;
}

export interface LetteringContentChunk {
  type: 'text' | 'lettering-bold';
  content: string;
}