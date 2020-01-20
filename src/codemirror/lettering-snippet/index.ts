import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

const SUBJECT_PLACEHOLDER = 'subject';

export function letteringSnippet(
  cm: CodeMirror.Editor,
  getCharacterNames: () => Array<string>
) {
  const lineNumber = cm.getCursor().line;
  let stepIndex = -1;
  const steps = makeSteps(getCharacterNames);

  const keyMap: CodeMirror.KeyMap = {
    Tab() {
      next();
    },
    Enter() {
      exit();
      return CodeMirror.Pass;
    },
    Esc() {
      exit();
      return CodeMirror.Pass;
    },
    // auto pair parens
    'Shift-9'(cm) {
      const cursor = cm.getCursor();
      cm.replaceRange('()', {
        line: cursor.line,
        ch: cursor.ch
      });
      cm.setCursor({
        line: cursor.line,
        ch: cursor.ch + 1
      });
    }
  };

  enter();
  next();

  function enter() {
    cm.addKeyMap(keyMap);
    cm.on('cursorActivity', handleCursorActivity);
  }

  function next() {
    stepIndex += 1;

    const step = steps[stepIndex];
    if (step) {
      step(cm);
    } else {
      exit();
    }
  }

  function exit() {
    cm.off('cursorActivity', handleCursorActivity);
    cm.removeKeyMap(keyMap);
  }

  function handleCursorActivity(cm: CodeMirror.Editor) {
    // Exit if it seems like user is trying to get out of snippet

    // moved to different line
    if (lineNumber !== cm.getCursor().line) {
      exit();
    }

    // moved to start of line
    if (cm.getCursor().ch === 0) {
      exit();
    }
  }
}

function makeSteps(getCharacterNames: () => Array<string>) {
  return [
    function metadataState(cm: CodeMirror.Editor) {
      const cursor = cm.getCursor();
      cm.replaceRange(`\t${SUBJECT_PLACEHOLDER}: content`, cursor);

      const lineText = cm.getLine(cursor.line);
      const tabIndex = lineText.indexOf('\t');
      const colonIndex = lineText.indexOf(':');

      cm.setSelection(
        {
          line: cursor.line,
          ch: tabIndex + 1
        },
        {
          line: cursor.line,
          ch: colonIndex
        }
      );

      cm.showHint({
        hint: makeHinter(getCharacterNames()),
        // don't auto select a single suggestion because use could be typing a
        // new character name
        completeSingle: false,
      });
    },
    function contentState(cm: CodeMirror.Editor) {
      const cursor = cm.getCursor();
      const lineText = cm.getLine(cursor.line);
      const lastColonIndex = lineText.lastIndexOf(':');

      cm.setSelection(
        {
          line: cursor.line,
          ch: lastColonIndex + 2
        },
        {
          line: cursor.line,
          ch: lastColonIndex + 100000
        }
      );
    }
  ];
}

function makeHinter(characterNames: Array<string>) {
  function hinter(cm: CodeMirror.Editor) {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);

    const suggestions = ['caption', 'sfx'].concat(characterNames)
      .filter(name => {
        return token.string === SUBJECT_PLACEHOLDER || name.startsWith(token.string);
      });

    return {
      list: suggestions,
      from: {
        line: cursor.line,
        ch: token.start
      },
      to: {
        line: cursor.line,
        ch: token.end
      }
    };
  }

  // allow hint popup when text is selected
  hinter.supportsSelection = true;

  return hinter;
}
