export interface EditorChangeEvent {
  /** New contents of the editor */
  lines: Array<string>;
}

export interface ScrollPosition {
  /** Zero-based line number of first line in visible editor area. */
  topLine: number;
}

export type EditorScrollEvent = ScrollPosition;

// For populating the Outline component

export type SpreadOutlineItem = OutlineItem & {
  panels: Array<OutlineItem>
};

export interface OutlineItem {
  id: string;
  label: string;
  current: boolean;
}
