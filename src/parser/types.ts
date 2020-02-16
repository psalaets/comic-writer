import * as parts from '../comic-part-types';

/** Anything that can appear anywhere in a comic. */
export type ComicNode = Spread | Panel | Lettering | Metadata | Paragraph | LetteringContentChunk;

/** Top level nodes of a comic. */
export type ComicChild = Spread | Panel | Metadata | Paragraph;

export interface Paragraph {
  id: string;
  type: typeof parts.PARAGRAPH;
  content: string;
  startingLine: number;
}

export interface Metadata {
  id: string;
  type: typeof parts.METADATA;
  name: string;
  value: string;
  startingLine: number;
}

export interface Spread {
  id: string;
  type: typeof parts.SPREAD;
  label: string;
  content: Array<SpreadChild>;
  pageCount: number;
  panelCount: number;
  speakers: Array<string>;
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
  type: typeof parts.PANEL;
  number: number;
  content: Array<PanelChild>;

  speakers: Array<string>;
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
  type: typeof parts.DIALOGUE;
  number: number;
  speaker: string;
  modifier: string | null;
  content: Array<LetteringContentChunk>;
  wordCount: number;
  startingLine: number;
}

export interface Caption {
  id: string;
  type: typeof parts.CAPTION;
  number: number;
  modifier: string | null;
  content: Array<LetteringContentChunk>;
  wordCount: number;
  startingLine: number;
}

export interface Sfx {
  id: string;
  type: typeof parts.SFX;
  number: number;
  modifier: string | null;
  content: string;
  startingLine: number;
}

export interface LetteringContentChunk {
  type: typeof parts.TEXT | typeof parts.LETTERING_BOLD;
  content: string;
}
