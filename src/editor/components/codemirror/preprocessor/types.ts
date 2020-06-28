export const REGULAR_LINE = 'regular';
export const SINGLE_PAGE_LINE = 'single-page';
export const MULTI_PAGE_LINE = 'multi-page';
export const PARTIAL_PAGE_RANGE_LINE = 'partial-page-range';
export const INVALID_PAGE_RANGE_LINE = 'invalid-page-range';
export const PANEL_LINE = 'panel';

interface Regular {
  type: typeof REGULAR_LINE
}

interface SinglePage {
  type: typeof SINGLE_PAGE_LINE
}

interface MultiPage {
  type: typeof MULTI_PAGE_LINE,
  count: number
}

interface PartialPageRange {
  type: typeof PARTIAL_PAGE_RANGE_LINE
}

interface InvalidPageRange {
  type: typeof INVALID_PAGE_RANGE_LINE
}

interface Panel {
  type: typeof PANEL_LINE
}

export type LineClassification = Regular
  | SinglePage
  | MultiPage
  | PartialPageRange
  | InvalidPageRange
  | Panel;
