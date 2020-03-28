import { LineClassification } from './types';

const PAGE_EXPANSION_PATTERN = /^page *$/i;
const PAGES_EXPANSION_PATTERN = /^pages *$/i;
const SPREAD_EXPANSION_PATTERN = /^spread$/i;

const PANEL_PATTERN = /^panel/i;
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
    if (!classifiablePrefixes.includes(line[0])) {
      return regularLine(line);
    }

    const cursorOnThisLine = lineNumber + lineOffset === cursorLine;

    if (PAGE_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine(line) : singlePageLine(line);
    }

    if (PAGES_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine(line) : multiPageLine(line, 2);
    }

    if (SINGLE_PAGE_PATTERN.test(line)) {
      return singlePageLine(line);
    }

    const pageRange = line.match(PAGE_RANGE_PATTERN);
    if (pageRange) {
      const start = parseInt(pageRange[1], 10);
      const end = parseInt(pageRange[2], 10);

      if (isValidPageRange(start, end)) {
        return multiPageLine(line, 1 + end - start);
      }

      // invalid but user is still editing the line
      if (cursorOnThisLine) {
        return invalidPageRangeLine(line)
      }

      // invalid and cursor is gone, change the line to something usable
      return isInvertedPageRange(start, end)
        ? multiPageLine(line, 2)
        : singlePageLine(line);
    }

    if (PARTIAL_PAGE_RANGE_PATTERN.test(line)) {
      return cursorOnThisLine
        ? partialPageRangeLine(line)
        : singlePageLine(line);
    }

    if (PANEL_PATTERN.test(line)) {
      return panelLine(line);
    }

    if (SPREAD_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? regularLine(line) : multiPageLine(line, 2);
    }

    return regularLine(line);
  };
}

function isValidPageRange(start: number, end: number): boolean {
  return start < end;
}

function isInvertedPageRange(start: number, end: number): boolean {
  return start > end;
}

function regularLine(line: string): LineClassification {
  return {
    type: 'regular',
    line
  };
}

function singlePageLine(line: string): LineClassification {
  return {
    type: 'single-page',
    count: 1,
    line
  };
}

function multiPageLine(line: string, count: number): LineClassification {
  return {
    type: 'multi-page',
    count,
    line
  };
}

// startPage and a dash but no endPage
function partialPageRangeLine(line: string): LineClassification {
  return {
    type: 'partial-page-range',
    line
  };
}

// startPage >= endPage
function invalidPageRangeLine(line: string): LineClassification {
  return {
    type: 'invalid-page-range',
    line
  };
}

function panelLine(line: string): LineClassification {
  return {
    type: 'panel',
    line
  };
}
