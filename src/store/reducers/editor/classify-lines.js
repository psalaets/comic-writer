export default function classifyLines(cursorLine) {
  return function classify(line, lineNumber) {
    const cursorOnThisLine = lineNumber === cursorLine;
    const lonePageKeyword = line.match(/^page *$/i);

    if (lonePageKeyword && cursorOnThisLine) {
      return {
        line,
        type: 'regular'
      };
    } else if (lonePageKeyword && !cursorOnThisLine) {
      return {
        line,
        type: 'page',
        count: 1
      };
    }

    const longPageRangeKeyword = line.match(/^pages *$/i);

    if (longPageRangeKeyword && cursorOnThisLine) {
      return {
        line,
        type: 'regular'
      };
    } else if (longPageRangeKeyword && !cursorOnThisLine) {
      return {
        line,
        type: 'page',
        count: 2
      };
    }

    const singlePage = line.match(/^pages? +\d{1,}$/i);

    if (singlePage) {
      return {
        line,
        type: 'page',
        count: 1
      };
    }

    const pageRange = line.match(/^pages? +(\d{1,})-(\d{1,})$/i);

    if (pageRange) {
      let start = parseInt(pageRange[1], 10);
      let end = parseInt(pageRange[2], 10);

      // turn invalid ranges into a 2 pager
      if (start > end) {
        end = start + 1;
      }

      return {
        line,
        type: 'page',
        count: 1 + end - start
      };
    }

    const partialPageRange = line.match(/^pages? \d{1,}-$/i);

    if (partialPageRange) {
      return {
        line,
        type: 'page',
        count: 1
      };
    }

    const panel = line.match(/^panel/i);

    if (panel) {
      return {
        line,
        type: 'panel'
      };
    }

    return {
      line,
      type: 'regular'
    };
  };
}
