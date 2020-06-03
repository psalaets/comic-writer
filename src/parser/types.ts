import * as parts from '../comic-part-types';

/**
 * Nodes that can be in the upper script area before spreads.
 */
export type PreSpread = Metadata | Paragraph | BlankLine;

export type SpreadChild = Panel | Leaf;

/** Lettering nodes */
type Lettering = Dialogue | Caption | Sfx;

/** Nodes that don't contain other nodes */
type Leaf = Lettering | Metadata | Paragraph | BlankLine;

export interface Spread {
  // core spread properties
  type: typeof parts.SPREAD;
  pageCount: number;

  // properties that require looking at the spread's children
  panelCount: number;
  speakers: Array<string>;
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
}

export interface Panel {
  // core panel properties
  type: typeof parts.PANEL;
  number: number;

  // properties that require looking at the panel's children
  speakers: Array<string>;
  dialogueCount: number;
  captionCount: number;
  sfxCount: number;
  dialogueWordCount: number;
  captionWordCount: number;
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
 * A spread and all of its children.
 *
 * @type SpreadType - Type of the spread value
 * @type ChildType - Type of each spread child
 */
export interface SpreadChunk<SpreadType, ChildType> {
  /**
   * The spread.
   */
  spread: SpreadType,
  /**
   * The children of this spread.
   */
  children: Array<ChildType>
}

/**
 * A spread chunk where
 *
 * - spread is a string
 * - children are strings
 */
export type RawSpreadChunk = SpreadChunk<string, string>;

/**
 * A spread chunk where
 *
 * - spread is a Spread
 * - children are SpreadChild
 */
export type ParsedSpreadChunk = SpreadChunk<Spread, SpreadChild>;

/**
 * Internal parser state.
 */
export interface LetteringNumbering {
  nextLetteringNumber(): number;
}
