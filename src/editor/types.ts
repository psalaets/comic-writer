
// component related

export interface EditorChangeEvent {
  /** New contents of the editor */
  lines: Array<string>;
}

export interface ScrollPosition {
  /** Zero-based line number of first line in visible editor area. */
  topLine: number;
}

export type EditorScrollEvent = ScrollPosition;
