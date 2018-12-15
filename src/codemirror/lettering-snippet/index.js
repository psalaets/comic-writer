import CodeMirror from 'codemirror';

export function letteringSnippet(cm) {
  const lineNumber = cm.getCursor().line;
  let stepIndex = -1;
  const steps = makeSteps();

  const keyMap = {
    Tab() {
      next();
    },
    Enter() {
      exit();
      return CodeMirror.Pass;
    },
    Escape() {
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

function makeSteps() {
  return [
    function metadataState(cm) {
      const cursor = cm.getCursor();
      const lineText = cm.getLine(cursor.line);
      const tabIndex = lineText.indexOf('\t');
      const colonIndex = lineText.indexOf(':');

      cm.setSelection({
        line: cursor.line,
        ch: tabIndex + 1
      },
        {
          line: cursor.line,
          ch: colonIndex
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