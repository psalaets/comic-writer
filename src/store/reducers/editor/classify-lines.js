const PAGE_EXPANSION_PATTERN = /^page *$/i;
const PAGES_EXPANSION_PATTERN = /^pages *$/i;
const SPREAD_EXPANSION_PATTERN = /^spread$/i;

const PANEL_PATTERN = /^panel/i;
const SINGLE_PAGE_PATTERN = /^pages? +\d{1,}$/i;
const PAGE_RANGE_PATTERN = /^pages? +(\d{1,})-(\d{1,})$/i;
const PARTIAL_PAGE_RANGE_PATTERN = /^pages? \d{1,}-$/i;

export default function classifyLines(cursorLine) {
  return function classify(line, lineNumber) {
    const cursorOnThisLine = lineNumber === cursorLine;

    if (line.match(PAGE_EXPANSION_PATTERN)) {
      return cursorOnThisLine ? regularLine(line) : singlePageLine(line);
    }

    if (line.match(PAGES_EXPANSION_PATTERN)) {
      return cursorOnThisLine ? regularLine(line) : multiPageLine(line, 2);
    }

    if (line.match(SINGLE_PAGE_PATTERN)) {
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

    if (line.match(PARTIAL_PAGE_RANGE_PATTERN)) {
      return cursorOnThisLine
        ? partialPageRangeLine(line)
        : singlePageLine(line);
    }

    if (line.match(PANEL_PATTERN)) {
      return panelLine(line);
    }

    if (line.match(SPREAD_EXPANSION_PATTERN)) {
      return cursorOnThisLine ? regularLine(line) : multiPageLine(line, 2);
    }

    return regularLine(line);
  };
}

function isValidPageRange(start, end) {
  return start < end;
}

function isInvertedPageRange(start, end) {
  return start > end;
}

function regularLine(line) {
  return {
    type: 'regular',
    line
  };
}

function singlePageLine(line) {
  return {
    type: 'single-page',
    count: 1,
    line
  };
}

function multiPageLine(line, count) {
  return {
    type: 'multi-page',
    count,
    line
  };
}

// startPage and a dash but no endPage
function partialPageRangeLine(line) {
  return {
    type: 'partial-page-range',
    line
  };
}

// startPage >= endPage
function invalidPageRangeLine(line) {
  return {
    type: 'invalid-page-range',
    line
  };
}

function panelLine(line) {
  return {
    type: 'panel',
    line
  };
}