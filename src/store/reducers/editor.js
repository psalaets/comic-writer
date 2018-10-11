import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED
} from '../action-types';

export default function editorReducer(state, action) {
  state = state || {
    source: '',
    cursor: 0
  };

  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      const { value } = transformMarkdown(action.payload.source, state.cursor);

      return {
        ...state,
        source: value
      };
    }
    case CHANGE_SOURCE: {
      const { value, cursor } = transformMarkdown(action.payload.source, action.payload.cursor);

      return {
        source: value,
        cursor: cursor
      };
    }
    default:
      return state;
  }
}

function transformMarkdown(value, cursor) {
  let runningLength = 0;
  const lines = value.split(/\n/)
    .map((text, index) => {
      const line = {
        number: index + 1,
        text: text,
        length: text.length,
        start: runningLength,
        end: runningLength + text.length
      };

      runningLength += line.length + 1;

      return line;
    })

  lines.filter(line => {
    return line.start <= cursor && line.end >= cursor;
  })
    .forEach(line => {
      line.containsCursor = true;
    });

  // The page that cursor is in
  let cursorPage;
  let cursorPanel;

  let pageNumber = 0;
  let panelNumber = 0;

  const newValue = lines
    .map(line => {
      const isPage = line.text.match(/^## /);
      const isPanel = line.text.match(/^### /);

      if (isPage) {
        pageNumber += 1;
        panelNumber = 0;
      } else if (isPanel) {
        panelNumber += 1;
      }

      if (line.containsCursor) {
        if (pageNumber > 0) {
          cursorPage = pageNumber;
        }

        if (panelNumber > 0) {
          cursorPanel = panelNumber;
        }
      }

      if (isPage) {
        const newLine = `## Page ${pageNumber}`;
        cursor += newLine.length - line.length;

        return newLine;
      } else if (isPanel) {
        const newLine = `### Panel ${panelNumber}`;
        cursor += newLine.length - line.length;

        return newLine;
      } else {
        return line.text;
      }
    })
    .join('\n');

  return {
    value: newValue,
    cursor
  };
}