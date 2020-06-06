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

interface ScriptMember {
  /** Unique across all other nodes in the script */
  id: string;
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

type SpreadLocation = ScriptMember & SpreadPages & Labelled;
type PanelLocation = ScriptMember & Labelled;

/**
 * Located node types
 *
 * For every node type Foo, a LocatedFoo is a Foo in the context of a comic
 * script. The comic script context is represented by additional properties such
 * as line number and node id.
 */

export type LocatedSpread    = Spread<LocatedSpreadChild> & SpreadLocation;
export type LocatedPanel     = Panel<LocatedPanelChild>   & PanelLocation;
export type LocatedDialogue  = Dialogue  & ScriptMember;
export type LocatedCaption   = Caption   & ScriptMember;
export type LocatedSfx       = Sfx       & ScriptMember;
export type LocatedMetadata  = Metadata  & ScriptMember;
export type LocatedParagraph = Paragraph & ScriptMember;
export type LocatedBlankLine = BlankLine & ScriptMember;

export type LocatedSpreadChild = LocatedPanel | LocatedPanelChild;

export type LocatedPanelChild = LocatedDialogue
  | LocatedCaption
  | LocatedSfx
  | LocatedParagraph
  | LocatedBlankLine;
