import {
  Spread,
  Panel,
  Dialogue,
  Caption,
  Sfx,
  Metadata,
  Paragraph,
  BlankLine,
} from '../parser/types';

export interface PanelCount {
  count: number,
  /** Zero-based line number */
  lineNumber: number
}

export interface WordCount {
  count: number,
  /** Zero-based line number */
  lineNumber: number,
  isSpread: boolean
}

interface ScriptLocation {
  /** Zero based line number */
  lineNumber: number;
}

interface SpreadPages {
  startPage: number;
  endPage: number;
}

interface Labelled {
  /** Human readable label */
  label: string;
}

export type SpreadLocation = ScriptLocation & SpreadPages & Labelled;

/**
 * Located node types
 *
 * For every node type Foo, a LocatedFoo is a Foo in the context of a comic
 * script. The comic script context is represented by additional properties such
 * as line number.
 */

export type LocatedSpread = Spread<LocatedSpreadChild> & SpreadLocation;
export type LocatedPanel = Panel<LocatedPanelChild> & ScriptLocation & Labelled;
export type LocatedDialogue = Dialogue & ScriptLocation;
export type LocatedCaption = Caption & ScriptLocation;
export type LocatedSfx = Sfx & ScriptLocation;
export type LocatedMetadata = Metadata & ScriptLocation;
export type LocatedParagraph = Paragraph & ScriptLocation;
export type LocatedBlankLine = BlankLine & ScriptLocation;

export type LocatedSpreadChild = LocatedPanel | LocatedPanelChild;

export type LocatedPanelChild = LocatedDialogue
  | LocatedCaption
  | LocatedSfx
  | LocatedParagraph
  | LocatedBlankLine;
