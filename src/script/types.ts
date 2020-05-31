import {
  Spread,
  Panel,
  Dialogue,
  Caption,
  Sfx,
  Metadata,
  Paragraph,
  BlankLine,
  SpreadChunk
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

export type LocatedSpread = Spread & SpreadPages & ScriptLocation;
export type LocatedPanel = Panel & ScriptLocation;
export type LocatedDialogue = Dialogue & ScriptLocation;
export type LocatedCaption = Caption & ScriptLocation;
export type LocatedSfx = Sfx & ScriptLocation;
export type LocatedMetadata = Metadata & ScriptLocation;
export type LocatedParagraph = Paragraph & ScriptLocation;
export type LocatedBlankLine = BlankLine & ScriptLocation;

export type LocatedSpreadChild = LocatedPanel
  | LocatedDialogue
  | LocatedCaption
  | LocatedSfx
  | LocatedMetadata
  | LocatedParagraph
  | LocatedBlankLine;

/**
 * A spread chunk where the children are of type LocatedSpreadChild and the
 * spread is a LocatedSpread.
 */
export type LocatedSpreadChunk = SpreadChunk<LocatedSpreadChild, LocatedSpread>;
