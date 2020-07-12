import { LineClassification } from './types';

const PAGE_EXPANSION_PATTERN = /^page *$/i;
const PAGES_EXPANSION_PATTERN = /^pages *$/i;
const SPREAD_EXPANSION_PATTERN = /^spread$/i;
const PANEL_EXPANSION_PATTERN = /^panel$/i;

const SINGLE_PANEL_PATTERN = /^panel +\d{1,}$/i;

const SINGLE_PAGE_PATTERN = /^pages? +\d{1,}$/i;
const PAGE_RANGE_PATTERN = /^pages? +(\d{1,})-(\d{1,})$/i;
const PARTIAL_PAGE_RANGE_PATTERN = /^pages? \d{1,}-$/i;

// If line doesn't start with one of these, it's a "regular" line. This only
// works because we know what the regexes look like (above).
const classifiablePrefixes = ['p', 'P', 's', 'S'];

// These classification types are stateless so we can use one instance of each
const PANEL_LINE        : LineClassification = { type: 'panel' };
const SINGLE_PAGE_LINE  : LineClassification = { type: 'single-page' };
const REGULAR_LINE      : LineClassification = { type: 'regular' };
const PARTIAL_PAGE_RANGE: LineClassification = { type: 'partial-page-range' };
const INVALID_PAGE_RANGE: LineClassification = { type: 'invalid-page-range' };

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
      return REGULAR_LINE;
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
      return PANEL_LINE;
    }

    if (PANEL_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? REGULAR_LINE : PANEL_LINE;
    }

    if (SINGLE_PAGE_PATTERN.test(line)) {
      return SINGLE_PAGE_LINE;
    }

    if (PAGE_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? REGULAR_LINE : SINGLE_PAGE_LINE;
    }

    if (PAGES_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? REGULAR_LINE : multiPageLine(2);
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
        return INVALID_PAGE_RANGE;
      }

      // invalid and cursor is gone, change the line to something usable
      return isInvertedPageRange(start, end)
        ? multiPageLine(2)
        : SINGLE_PAGE_LINE;
    }

    if (PARTIAL_PAGE_RANGE_PATTERN.test(line)) {
      return cursorOnThisLine
        ? PARTIAL_PAGE_RANGE
        : SINGLE_PAGE_LINE;
    }

    if (SPREAD_EXPANSION_PATTERN.test(line)) {
      return cursorOnThisLine ? REGULAR_LINE : multiPageLine(2);
    }

    return REGULAR_LINE;
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

function multiPageLine(count: number): LineClassification {
  return {
    type: 'multi-page',
    count
  };
}
