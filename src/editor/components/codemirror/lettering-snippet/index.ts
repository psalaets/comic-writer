import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

import {
  LETTERING_SUBJECT,
  LETTERING_MODIFIER,
  LETTERING_CONTENT
} from '../mode/token';
import { LetteringLine } from './lettering-line';

const SUBJECT_PLACEHOLDER = 'SUBJECT';
/**
 * css class applied to the line when lettering snippet is active.
 *
 * Keep this synced with theme.css
 */
const LETTERING_SNIPPET_CLASS = 'lettering-snippet';

/**
 * A code-editor style snippet for creating dialogue/caption/sfx.
 *
 * @param cm CodeMirror Editor
 * @param getCharacterNames
 */
export function letteringSnippet(
  cm: CodeMirror.Editor,
  getCharacterNames: () => Array<string>
) {
  const lineNumber = cm.getCursor().line;
  let stepIndex = 0;
  const steps = makeSteps();

  const keyMap: CodeMirror.KeyMap = {
    Tab() {
      next();
    },
    'Shift-Tab'() {
      prev();
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
      const line = new LetteringLine(cm.getLineTokens(cursor.line));

      const subjectToken = line.getSubject();

      // subject exists but there isn't already a modifier token
      if (subjectToken && !line.hasModifierMarkersBeforeContent()) {
        // if cursor between end of subject and colon
        if (line.isBetweenSubjectAndContent(cursor)) {
          const afterSubjectToken = line.getAfterSubject();

          const placeholder = afterSubjectToken?.string.startsWith(' ')
            ? '(MODIFIER)'
            : ' (MODIFIER)';

          cm.replaceRange(placeholder, {
            line: cursor.line,
            ch: cursor.ch
          });

          next();
        } else {
          return CodeMirror.Pass;
        }
      } else {
        return CodeMirror.Pass;
      }
    }
  };

  enter();
  next();
  showHint();

  function enter() {
    cm.addKeyMap(keyMap);
    cm.on('cursorActivity', handleCursorActivity);
    cm.addLineClass(lineNumber, 'text', LETTERING_SNIPPET_CLASS);

    cm.replaceRange(`\t${SUBJECT_PLACEHOLDER}: content`, cm.getCursor());
  }

  function prev() {
    move(-1);
  }

  function next() {
    move(1);
  }

  function move(delta: number) {
    stepIndex += delta;

    const step = steps[stepIndex];

    if (step) {
      const result = step(cm, delta);

      if (result === 'next') {
        next();
      } else if (result === 'prev') {
        prev();
      }
    } else {
      exit();
    }
  }

  function exit() {
    cm.removeLineClass(lineNumber, 'text', LETTERING_SNIPPET_CLASS);
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

  function showHint() {
    cm.showHint({
      hint: makeHinter(getCharacterNames()),
      // don't auto select a single suggestion because use could be typing a
      // new character name
      completeSingle: false,
    });
  }
}

function makeSteps() {
  return [
    function frontSentinel(cm: CodeMirror.Editor, stepDelta: number): any {
      cm.operation(() => {
        cm.execCommand('goLineLeft');
      });
    },
    function subjectState(cm: CodeMirror.Editor, stepDelta: number): any {
      const cursor = cm.getCursor();
      const subject = cm.getLineTokens(cursor.line)
        .find(token => {
          return token.type?.includes(LETTERING_SUBJECT);
        });

      if (subject) {
        cm.setSelection(
          {
            line: cursor.line,
            ch: subject.start
          },
          {
            line: cursor.line,
            ch: subject.end
          }
        );
      }
    },
    function modifierState(cm: CodeMirror.Editor, stepDelta: number): any {
      const cursor = cm.getCursor();
      const modifier = cm.getLineTokens(cursor.line)
        .find(token => {
          return token.type?.includes(LETTERING_MODIFIER);
        });

      if (modifier) {
        cm.setSelection(
          {
            line: cursor.line,
            ch: modifier.start
          },
          {
            line: cursor.line,
            ch: modifier.end
          }
        );
      } else {
        return stepDelta > 0 ? 'next' : 'prev';
      }
    },
    function contentState(cm: CodeMirror.Editor, stepDelta: number): any {
      const cursor = cm.getCursor();
      const content = cm.getLineTokens(cursor.line)
        .find(token => {
          return token.type?.includes(LETTERING_CONTENT);
        });

      if (content) {
        cm.setSelection(
          {
            line: cursor.line,
            ch: content.start
          },
          {
            line: cursor.line,
            ch: content.end
          }
        );
      }
    },
    function backSentinel(cm: CodeMirror.Editor, stepDelta: number): any {
      cm.operation(() => {
        cm.execCommand('goLineRight');
        cm.execCommand('newlineAndIndent');
      });
    }
  ];
}

function makeHinter(characterNames: Array<string>) {
  function hinter(cm: CodeMirror.Editor) {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);

    const current = token.string.toLocaleUpperCase();

    const suggestions = ['caption', 'sfx']
      .concat(characterNames)
      .map(suggestion => suggestion.toLocaleUpperCase())
      .filter(suggestion => {
        return current === SUBJECT_PLACEHOLDER
          || suggestion.startsWith(current);
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
