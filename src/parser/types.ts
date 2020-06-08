import * as parts from '../comic-part-types';

/**
 * Nodes that can be in the upper script area before spreads.
 */
export type PreSpread = Metadata | Paragraph | BlankLine;

/**
 * Nodes that can be a child of a spread.
 */
export type SpreadChild = Panel<PanelChild> | PanelChild;

/**
 * Nodes that can be a child of a panel.
 */
export type PanelChild = Lettering | Paragraph | BlankLine;

/** Lettering nodes */
type Lettering = Dialogue | Caption | Sfx;

export interface Spread<ChildType> {
  // core spread properties
  type: typeof parts.SPREAD;
  pageCount: number;
  children: Array<ChildType>;

  // properties that are derived from children
  panelCount: number;
  speakers: Array<string>;
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
}

export interface Panel<ChildType> {
  // core panel properties
  type: typeof parts.PANEL;
  number: number;
  children: Array<ChildType>;

  // properties that are derived from children
  speakers: Array<string>;
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
  description: string | null;
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

/**
 * The lines from a script that make up a spread and everything inside it.
 */
export interface SpreadContent {
  /**
   * The spread line.
   */
  spread: string;
  /**
   * The child lines of the spread.
   */
  children: Array<string>;
}
