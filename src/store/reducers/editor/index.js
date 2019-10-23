import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../../action-types';

import classifyLines from './classify-lines';

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
    .map(classifyLines(cursorLine))
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
