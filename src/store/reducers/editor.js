import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../action-types';

export default function editorReducer(state, action) {
  state = state || {
    source: ''
  };

  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      return {
        source: transformMarkdown(action.payload.source)
      };
    }
    case CHANGE_SOURCE: {
      return {
        source: transformMarkdown(action.payload.source)
      };
    }
    default:
      return state;
  }
}

// exported for testing purposes
export function transformMarkdown(value) {
  let pageNumber = 0;
  let panelNumber = 0;

  const lines = value.split(/\n/);
  const newValue = lines
    .map(line => {
      const isPage = line.match(/^page/i);
      const isPanel = line.match(/^panel/i);

      if (isPage) {
        pageNumber += 1;
        panelNumber = 0;
        return `Page ${pageNumber}`;
      } else if (isPanel) {
        panelNumber += 1;
        return `Panel ${panelNumber}`;
      } else {
        return line;
      }
    })
    .join('\n');

  return newValue;
}
