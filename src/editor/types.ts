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
  type: string;
  lineNumber: number;
  current: boolean;
}

export interface SpreadOutlineItem extends OutlineItem {
  type: 'spread';
  label: string;
};

export interface PanelOutlineItem extends OutlineItem {
  type: 'panel';
  panelNumber: number;
  description: string | null;
}

export interface OutlineItemSelectionEvent {
  /** Zero-based line number of the selected item */
  lineNumber: number;
}

/**
 * Fired by outline items when they need to be centered in the outline.
 */
export interface CenteringRequestEvent {
  /** The element to be centered */
  element: HTMLElement;
}
