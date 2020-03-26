import * as parts from '../comic-part-types';

/** Anything that can be in a script */
export type ComicNode = Spread | Panel | Lettering | Metadata | Paragraph | BlankLine;
/** Anything that can be in the pre-spread part of the script */
export type PreSpreadChild = Metadata | Paragraph | BlankLine;
/** Anything that can be directly under a spread */
export type SpreadChild = Panel | Lettering | Paragraph | BlankLine;
/** Anything that can be directly under a panel */
export type PanelChild = Lettering | Metadata | Paragraph | BlankLine;
/** The various types of lettering */
export type Lettering = Dialogue | Caption | Sfx;

export interface Script {
  preSpread: Array<PreSpreadChild>;
  spreads: Array<Spread>;
}

export interface Spread {
  type: typeof parts.SPREAD;
  // content: Array<SpreadChild>;

  pageCount: number;
  // panelCount: number;
  // speakers: Array<string>;
  // dialogueCount: number;
  // captionCount: number;
  // sfxCount: number;
  // dialogueWordCount: number;
  // captionWordCount: number;
}

export interface Panel {
  type: typeof parts.PANEL;
  number: number;
  // content: Array<PanelChild>;

  // speakers: Array<string>;
  // dialogueCount: number;
  // captionCount: number;
  // sfxCount: number;
  // dialogueWordCount: number;
  // captionWordCount: number;
}

export interface Paragraph {
  type: typeof parts.PARAGRAPH;
  content: string;
}

export interface Metadata {
  type: typeof parts.METADATA;
  name: string;
  value: string;
}

export interface Dialogue {
  type: typeof parts.DIALOGUE;
  number: number;
  speaker: string;
  modifier: string | null;
  content: Array<LetteringContentChunk>;
  wordCount: number;
}

export interface Caption {
  type: typeof parts.CAPTION;
  number: number;
  modifier: string | null;
  content: Array<LetteringContentChunk>;
  wordCount: number;
}

export interface Sfx {
  type: typeof parts.SFX;
  number: number;
  modifier: string | null;
  content: string;
}

export interface LetteringContentChunk {
  type: typeof parts.TEXT | typeof parts.LETTERING_BOLD;
  content: string;
}

export interface BlankLine {
  type: typeof parts.BLANK;
}
