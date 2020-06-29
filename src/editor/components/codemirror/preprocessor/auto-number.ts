import {
  LineClassification,
  SINGLE_PAGE_LINE,
  MULTI_PAGE_LINE,
  PARTIAL_PAGE_RANGE_LINE,
  INVALID_PAGE_RANGE_LINE,
  PANEL_LINE
} from './types';

export default function createAutoNumber(classifications: Array<LineClassification>) {
  let pagesInComic = 0;
  let panelsInPage = 0;

  return function autoNumber(line: string, index: number): string {
    const lineClass = classifications[index];

    switch (lineClass.type) {
      case SINGLE_PAGE_LINE:
        pagesInComic += 1;
        panelsInPage = 0;

        return `Page ${pagesInComic}`;
      case MULTI_PAGE_LINE:
        const startPage = pagesInComic + 1;
        panelsInPage = 0;

        if (lineClass.count > 1) {
          pagesInComic += lineClass.count;

          return `Pages ${startPage}-${pagesInComic}`;
        } else {
          return line;
        }
      case INVALID_PAGE_RANGE_LINE:
        pagesInComic += 2;
        panelsInPage = 0;

        return line;
      case PARTIAL_PAGE_RANGE_LINE:
        pagesInComic += 1;
        panelsInPage = 0;

        return `Pages ${pagesInComic}-`;
      case PANEL_LINE:
        panelsInPage += 1;

        return `Panel ${panelsInPage}`;
      default:
        return line;
    }
  };
}
