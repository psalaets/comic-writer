import { LineWidget, LineHandle, Position } from 'codemirror';

// Type declarations for things that the CodeMirror typings don't have named
// types for, yet.

/**
 * The type returned from `cm.lineInfo(line: number | LineHandle)`
 */
export interface LineInfo {
  line: number;
  handle: LineHandle;
  text: string;
  /** Object mapping gutter IDs to marker elements. */
  gutterMarkers: {
    [id: string]: any
  };
  textClass: string;
  bgClass: string;
  wrapClass: string;
  /** Array of line widgets attached to this line. */
  widgets: Array<LineWidget>;
}

/**
 * The type returned by `cm.listSelections()`.
 */
export interface Selection {
  anchor: Position,
  head: Position
}
