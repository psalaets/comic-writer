import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

import { LetteringLine } from './lettering-line';

const SUBJECT_PLACEHOLDER = 'SUBJECT';
/**
 * css class applied to the line when lettering snippet is active.
 *
 * Keep this synced with theme.css
 */
const LETTERING_SNIPPET_CLASS = 'lettering-snippet';

type TabStop = {
  name: string,
  activate: () => 'skip' | void;
};

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

  let tabStopIndex = 0;
  const tabStops = makeTabStops(cm);
  const keyMap = makeKeyMap(nextStop, previousStop, exitSnippet);

  enterSnippet();
  nextStop();
  showHint();

  function enterSnippet() {
    cm.addKeyMap(keyMap);
    cm.on('cursorActivity', handleCursorActivity);
    cm.addLineClass(lineNumber, 'text', LETTERING_SNIPPET_CLASS);

    cm.replaceRange(`\t${SUBJECT_PLACEHOLDER}: content`, cm.getCursor());
  }

  function exitSnippet() {
    cm.removeLineClass(lineNumber, 'text', LETTERING_SNIPPET_CLASS);
    cm.off('cursorActivity', handleCursorActivity);
    cm.removeKeyMap(keyMap);
  }

  function previousStop() {
    move(-1);
  }

  function nextStop() {
    move(1);
  }

  function move(delta: number) {
    tabStopIndex += delta;

    const stop = tabStops[tabStopIndex];

    if (stop) {
      const result = stop.activate();

      if (result === 'skip') {
        move(delta);
      }
    } else {
      exitSnippet();
    }
  }

  // Exit if it seems like user is trying to get out of snippet
  function handleCursorActivity(cm: CodeMirror.Editor) {
    // moved to different line
    if (lineNumber !== cm.getCursor().line) {
      exitSnippet();
    }

    // moved to start of line
    if (cm.getCursor().ch === 0) {
      exitSnippet();
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

function makeTabStops(cm: CodeMirror.Editor): Array<TabStop> {
  function selectTokens(line: number, ...tokens: Array<CodeMirror.Token>): void {
    const start = Math.min(...tokens.map(token => token.start));
    const end = Math.max(...tokens.map(token => token.end));

    cm.setSelection(
      { line, ch: start },
      { line, ch: end }
    );
  }

  return [
    {
      name: 'left-sentinel',
      activate() {
        cm.operation(() => {
          cm.execCommand('goLineLeft');
        });
      }
    },
    {
      name: 'subject',
      activate() {
        const cursor = cm.getCursor();
        const line = new LetteringLine(cm.getLineTokens(cursor.line));
        const subject = line.getSubject();

        if (subject) {
          selectTokens(cursor.line, subject);
        }
      }
    },
    {
      name: 'modifier',
      activate() {
        const cursor = cm.getCursor();
        const line = new LetteringLine(cm.getLineTokens(cursor.line));
        const modifier = line.getModifier();

        if (modifier) {
          selectTokens(cursor.line, modifier);
        } else {
          return 'skip';
        }
      }
    },
    {
      name: 'content',
      activate() {
        const cursor = cm.getCursor();
        const line = new LetteringLine(cm.getLineTokens(cursor.line));
        const contentTokens = line.getAllContent();

        if (contentTokens.length > 0) {
          selectTokens(cursor.line, ...contentTokens);
        }
      }
    },
    {
      name: 'right-sentinel',
      activate() {
        cm.operation(() => {
          cm.execCommand('goLineRight');
          cm.execCommand('newlineAndIndent');
        });
      }
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

function makeKeyMap(next: () => void, prev: () => void, exit: () => void): CodeMirror.KeyMap {
  return {
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
}
