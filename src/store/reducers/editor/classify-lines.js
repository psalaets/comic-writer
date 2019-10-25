const PAGE_EXPANSION_PATTERN = /^page *$/i;
const PAGES_EXPANSION_PATTERN = /^pages *$/i;
const PANEL_EXPANSION_PATTERN = /^panel/i;
const SPREAD_EXPANSION_PATTERN = /^spread$/i;

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
      let start = parseInt(pageRange[1], 10);
      let end = parseInt(pageRange[2], 10);

      // turn invalid ranges with cursor gone into a 2 pager
      if (start > end && !cursorOnThisLine) {
        end = start + 1;
      }

      return multiPageLine(line, 1 + end - start);
    }

    if (line.match(PARTIAL_PAGE_RANGE_PATTERN)) {
      return cursorOnThisLine
        ? partialPageRangeLine(line)
        : singlePageLine(line);
    }

    if (line.match(PANEL_EXPANSION_PATTERN)) {
      return panelLine(line);
    }

    if (line.match(SPREAD_EXPANSION_PATTERN)) {
      return cursorOnThisLine ? regularLine(line) : multiPageLine(line, 2);
    }

    return regularLine(line);
  };
}

function regularLine(line) {
  return {
    type: 'regular',
    line
  };
}

function singlePageLine(line) {
  return {
    type: 'page',
    count: 1,
    line
  };
}

function multiPageLine(line, count) {
  return {
    type: 'page',
    count,
    line
  };
}

function partialPageRangeLine(line) {
  return {
    type: 'partial-page',
    count: 1,
    line
  };
}

function panelLine(line) {
  return {
    line,
    type: 'panel'
  };
}
