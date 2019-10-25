export default function classifyLines(cursorLine) {
  return function classify(line, lineNumber) {
    const cursorOnThisLine = lineNumber === cursorLine;

    const lonePageKeyword = line.match(/^page *$/i);
    if (lonePageKeyword) {
      return cursorOnThisLine ? regularType(line) : pageType(line, 1);
    }

    const longPageRangeKeyword = line.match(/^pages *$/i);
    if (longPageRangeKeyword) {
      return cursorOnThisLine ? regularType(line) : pageType(line, 2);
    }

    const singlePage = line.match(/^pages? +\d{1,}$/i);
    if (singlePage) {
      return pageType(line, 1);
    }

    const pageRange = line.match(/^pages? +(\d{1,})-(\d{1,})$/i);
    if (pageRange) {
      let start = parseInt(pageRange[1], 10);
      let end = parseInt(pageRange[2], 10);

      // turn invalid ranges with cursor gone into a 2 pager
      if (start > end && !cursorOnThisLine) {
        end = start + 1;
      }

      return pageType(line, 1 + end - start);
    }

    const partialPageRange = line.match(/^pages? \d{1,}-$/i);

    if (partialPageRange) {
      return cursorOnThisLine
        ? partialPageRangeType(line, 1)
        : pageType(line, 1);
    }

    const panel = line.match(/^panel/i);
    if (panel) {
      return panelType(line);
    }

    const spread = line.match(/spread/i);
    if (spread && !cursorOnThisLine) {
      return pageType(line, 2);
    }

    return regularType(line);
  };
}

function regularType(line) {
  return {
    type: 'regular',
    line
  };
}

function pageType(line, count) {
  return {
    type: 'page',
    count,
    line
  };
}

function partialPageRangeType(line, count) {
  return {
    type: 'partial-page',
    count,
    line
  };
}

function panelType(line) {
  return {
    line,
    type: 'panel'
  };
}
