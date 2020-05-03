import { StringStream } from 'codemirror';
import { ComicWriterModeState } from './types';

/*
 * These values become css classes so keep them synced with theme.css file.
 * For more info, see https://codemirror.net/doc/manual.html#modeapi
 */

// Token classes. These are applied to individual tokens of a line.
// CodeMirror adds a 'cm-' prefix to these before putting them in the dom.
const PAGE = 'page';
const PANEL = 'panel';
const METADATA = 'metadata';

const LETTERING_SUBJECT = 'lettering-subject';
const LETTERING_MODIFIER = 'lettering-modifier';
export const LETTERING_CONTENT = 'lettering-content';
export const LETTERING_BOLD = 'lettering-bold';

// Line classes. These are applied to entire lines.
// CM removes the 'line-' prefix before putting them in the dom.
const LETTERING_LINE = 'line-cm-lettering';
const SFX_LINE = 'line-cm-sfx';
const CAPTION_LINE = 'line-cm-caption';
const DIALOGUE_LINE = 'line-cm-dialogue';
/*
 * End of values that become css classes
 */


export default function token(
  stream: StringStream,
  state: ComicWriterModeState
): string | null {
  if (stream.sol()) {
    resetState(state);

    if (stream.peek() === '\t') {
      stream.next();
      state.inLettering = true;
      return null;
    }

    if (stream.match(/^pages? \d+(-(\d+)?)?$/i)) return PAGE;
    if (stream.match(/^panel \d+$/i)) return PANEL;
    if (stream.match(/^(.+): ?(.+)/)) return METADATA;
  }

  if (state.inLettering) {
    if (!state.subjectDone) {
      if (stream.match(/sfx/i)) {
        state.subjectDone = true;
        state.allowsBoldInContent = true;
        return `${LETTERING_SUBJECT} ${LETTERING_LINE} ${SFX_LINE}`;
      } else if (stream.match(/caption/i)) {
        state.subjectDone = true;
        state.allowsBoldInContent = true;
        return `${LETTERING_SUBJECT} ${LETTERING_LINE} ${CAPTION_LINE}`;
      } else if (stream.match(/[:(]/)) {
        // looks like there's no subject
        stream.skipToEnd();
        state.inLettering = false;
        return null;
      } else {
        state.subjectDone = true;
        state.allowsBoldInContent = true;

        const subject: Array<string> = [];

        // inch forward until getting to end of subject
        let eaten;
        /* eslint-disable-next-line no-cond-assign */
        while (eaten = stream.eat(/[^:(]/)) {
          subject.push(eaten);
        }

        // back track to get before any whitespace between subject and end of subject
        while (/\s/.test(subject[subject.length - 1])) {
          subject.pop();
          stream.backUp(1);
        }

        return `${LETTERING_SUBJECT} ${LETTERING_LINE} ${DIALOGUE_LINE}`;
      }
    }

    // haven't read modifier yet
    if (!state.modifierDone) {
      // consume any whitespace between subject and modifier
      if (stream.eatSpace()) return null;

      // next char is colon, there was no modifier
      if (stream.peek() === ':') {
        state.modifierDone = true;
      }
      // modifier has been opened, we're reading modifier text right now
      else if (state.inModifier) {
        if (stream.eatWhile(/[^:)]/)) {
          return LETTERING_MODIFIER;
        }
        // modifier is unclosed or empty
        else if (stream.eat(/[:)]/)) {
          state.inModifier = false;
          state.modifierDone = true;
          return null;
        }
        // modifier never ends
        else {
          stream.skipToEnd();
          state.inModifier = false;
          state.modifierDone = true;
          return null;
        }
      }
      // modifier not open yet but we know it's there, in some form
      else {
        stream.eat('(');
        state.inModifier = true;
        return null;
      }
    }

    if (!state.contentDone) {
      if (state.inContent) {
        if (state.allowsBoldInContent) {
          const styles = tokenLetteringText(stream);

          if (stream.eol()) {
            state.contentDone = true;
            state.inContent = false;
          }

          return styles;
        } else {
          stream.skipToEnd();
          return LETTERING_CONTENT;
        }
      } else if (stream.skipTo(':')) {
        stream.next();
        stream.eatSpace();

        state.inContent = true;
        return null;
      } else {
        stream.skipToEnd();
        state.contentDone = true;
        return null;
      }
    }
  }

  // advance stream past stuff that isn't styled, like plain paragraphs
  stream.skipToEnd();
  return null;
}

function resetState(state: ComicWriterModeState) {
  state.inLettering = false;
  state.allowsBoldInContent = false;
  state.subjectDone = false;
  state.modifierDone = false;
  state.inModifier = false;
  state.contentDone = false;
  state.inContent = false;
}

/**
 * Special token handler for lettering that can contain bold.
 *
 * @param {Object} stream - Stream from codemirror
 * @returns {String} tokens
 */
function tokenLetteringText(stream: StringStream): string {
  const tokens = [LETTERING_CONTENT];

  // stream is currently at double star
  if (stream.match(/^\*\*/)) {
    // and there is another double star somewhere
    if (stream.match(/.*?\*\*/)) {
      // that was a run of lettering-bold
      tokens.push(LETTERING_BOLD);
    }
    // stream is at an unpaired double star
    else {
      // the rest of the line is regular lettering
      stream.skipToEnd();
    }
  }
  // stream isn't at double star right now
  else {
    // skip to next double star, if any
    const lineContainsDoubleStar = stream.skipTo('**');
    // found no double star on the line
    if (!lineContainsDoubleStar) {
      // everything else is regular lettering
      stream.skipToEnd();
    }
  }

  return tokens.join(' ');
}
