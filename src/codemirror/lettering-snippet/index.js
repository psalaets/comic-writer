import CodeMirror from 'codemirror';

export function letteringSnippet(cm, getCharacterNames) {
  const lineNumber = cm.getCursor().line;
  let stepIndex = -1;
  const steps = makeSteps(getCharacterNames);

  const keyMap = {
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

  function enter() {
    cm.addKeyMap(keyMap);
    cm.on('cursorActivity', handleCursorActivity);

    cm.replaceRange('\tsubject: content', cm.getCursor());
    next();
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

  function handleCursorActivity(cm) {
    if (lineNumber !== cm.getCursor().line) {
      exit();
    }
  }
}

function makeSteps(getCharacterNames) {
  return [
    function metadataState(cm) {
      const suggestionsSnapshot = ['sfx', 'caption'].concat(getCharacterNames());
      const cursor = cm.getCursor();
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


      function hint() {
        const suggestions = suggestionsSnapshot
          .filter(name => {
            const cursor = cm.getCursor();
            const token = cm.getTokenAt(cursor);

            return token.string === 'subject' || name.startsWith(token.string);
          })
          .map(name => {
            return {
              text: name,
              displayText: name.toUpperCase(),
              hint(cm) {
                const cursor = cm.getCursor();
                const token = cm.getTokenAt(cursor);

                const from = {
                  line: cursor.line,
                  ch: token.start
                };

                const to = {
                  line: cursor.line,
                  ch: token.end
                };

                cm.replaceRange(name, from, to);
              }
            };
          });

        return {
          list: suggestions
        };
      }

      hint.supportsSelection = true;

      cm.showHint({
        hint,
        completeSingle: false,
      });
    },
    function contentState(cm) {
      const cursor = cm.getCursor();
      const lineText = cm.getLine(cursor.line);
      const lastColonIndex = lineText.lastIndexOf(':');

      cm.setSelection({
        line: cursor.line,
        ch: lastColonIndex + 2
      }, {
          line: cursor.line,
          ch: lastColonIndex + 100000
        });
    }
  ];
}