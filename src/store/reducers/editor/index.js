import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../../action-types';

export default function editorReducer(state, action) {
  state = state || {
    source: ''
  };

  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      return {
        source: transformMarkdown(action.payload.source, 0)
      };
    }
    case CHANGE_SOURCE: {
      return {
        source: transformMarkdown(action.payload.source, action.payload.cursorLine)
      };
    }
    default:
      return state;
  }
}

// exported for testing purposes
export function transformMarkdown(value, cursorLine) {
  let pagesInComic = 0;
  let panelsInPage = 0;

  const lines = value.split(/\n/);
  const newValue = lines
    .map((line, lineNumber) => {
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
    })
    .map(obj => {
      const {line, type, count} = obj;

      if (type === 'page') {
        pagesInComic += 1;
        panelsInPage = 0;

        const startPage = pagesInComic;

        if (count > 1) {
          pagesInComic += count - 1;
          const endPage = pagesInComic;

          return `Pages ${startPage}-${endPage}`;
        } else {
          return `Page ${startPage}`;
        }
      } else if (type === 'panel') {
        panelsInPage += 1;

        return `Panel ${panelsInPage}`;
      } else {
        return line;
      }
    })
    .join('\n');

  return newValue;
}

function pageCount(start, end) {
  return 1 + end - start;
}
