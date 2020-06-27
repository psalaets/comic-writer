// events from Editor

export interface EditorChangeEvent {
  /** New contents of the editor */
  lines: Array<string>;
}

export interface ScrollPosition {
  /** Zero-based line number of first line in visible editor area. */
  topLine: number;
}

export type EditorScrollEvent = ScrollPosition;

// Prop types and events for Outline component

export interface OutlineItem {
  id: string;
  lineNumber: number;
  current: boolean;
}

export interface SpreadOutlineItem extends OutlineItem {
  label: string;
  panels: Array<PanelOutlineItem>;
};

export interface PanelOutlineItem extends OutlineItem {
  panelNumber: number;
  description: string | null;
}

export interface OutlineItemSelectionEvent {
  item: OutlineItem;
}

/**
 * Fired by outline items when they need to be centered in the outline.
 */
export interface CenteringRequestEvent {
  /** The element to be centered */
  element: HTMLElement;
}
