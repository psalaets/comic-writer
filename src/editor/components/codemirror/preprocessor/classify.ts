import { LineClassification } from './types';

const PAGE_EXPANSION_PATTERN = /^page *$/i;
const PAGES_EXPANSION_PATTERN = /^pages *$/i;
const SPREAD_EXPANSION_PATTERN = /^spread$/i;
const PANEL_EXPANSION_PATTERN = /^panel/i;

const SINGLE_PANEL_PATTERN = /^panel +\d{1,}$/i;

const SINGLE_PAGE_PATTERN = /^pages? +\d{1,}$/i;
const PAGE_RANGE_PATTERN = /^pages? +(\d{1,})-(\d{1,})$/i;
const PARTIAL_PAGE_RANGE_PATTERN = /^pages? \d{1,}-$/i;

// If line doesn't start with one of these, it's a "regular" line. This only
// works because we know what the regexes look like (above).
const classifiablePrefixes = ['p', 'P', 's', 'S'];

/**
 * Create a line classifier for purposes of pre-processing the script.
 *
 * @param cursorLine Zero based line number that the cursor is on. This affects
 *                   how the classifier will treat certain partial lines.
 * @param lineOffset When the classifier receives line number values, this is
 *                   how far they are from their true line position.
 */
export default function createClassifier(cursorLine: number, lineOffset: number) {
  return function classify(line: string, lineNumber: number): LineClassification {
    // Early bailout for obvious regular lines to save us from ping ponging
    // through all the regexes below, only to find out it's a regular line.
    if (isDefinitelyRegularLine(line)) {
      return regularLine();
    }

    const cursorOnThisLine = lineNumber + lineOffset === cursorLine;

    /**
     * Order matters in here for 2 reasons:
     *
     *   - Need to check against more specific patterns first because a more
     *     general pattern could take all the matches.
     *   - Matching more likely patterns first means higher chances of matching
     *     sooner which is good for performance.
     */

    if (SINGLE_PANEL_PATTERN.test(line)) {
      return panelLine();
    }

    if (PANEL_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine() : panelLine();
    }

    if (SINGLE_PAGE_PATTERN.test(line)) {
      return singlePageLine();
    }

    if (PAGE_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine() : singlePageLine();
    }

    if (PAGES_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine() : multiPageLine(2);
    }

    const pageRange = line.match(PAGE_RANGE_PATTERN);
    if (pageRange) {
      const start = parseInt(pageRange[1], 10);
      const end = parseInt(pageRange[2], 10);

      if (isValidPageRange(start, end)) {
        return multiPageLine(1 + end - start);
      }

      // invalid but user is still editing the line
      if (cursorOnThisLine) {
        return invalidPageRangeLine()
      }

      // invalid and cursor is gone, change the line to something usable
      return isInvertedPageRange(start, end)
        ? multiPageLine(2)
        : singlePageLine();
    }

    if (PARTIAL_PAGE_RANGE_PATTERN.test(line)) {
      return cursorOnThisLine
        ? partialPageRangeLine()
        : singlePageLine();
    }

    if (SPREAD_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine() : multiPageLine(2);
    }

    return regularLine();
  };
}

function isDefinitelyRegularLine(line: string): boolean {
  return !classifiablePrefixes.includes(line[0]);
}

function isValidPageRange(start: number, end: number): boolean {
  return start < end;
}

function isInvertedPageRange(start: number, end: number): boolean {
  return start > end;
}

function regularLine(): LineClassification {
  return {
    type: 'regular'
  };
}

function singlePageLine(): LineClassification {
  return {
    type: 'single-page',
    count: 1
  };
}

function multiPageLine(count: number): LineClassification {
  return {
    type: 'multi-page',
    count
  };
}

// startPage and a dash but no endPage
function partialPageRangeLine(): LineClassification {
  return {
    type: 'partial-page-range'
  };
}

// startPage >= endPage
function invalidPageRangeLine(): LineClassification {
  return {
    type: 'invalid-page-range'
  };
}

function panelLine(): LineClassification {
  return {
    type: 'panel'
  };
}
