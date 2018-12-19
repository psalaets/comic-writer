// these values become css classes so keep them synced with theme file
const PAGE_STYLE = 'page';
const PANEL_STYLE = 'panel';
const CAPTION_STYLE = 'caption';
const DIALOGUE_STYLE = 'dialogue';
const LETTERING_BOLD_STYLE = 'lettering-bold';
const METADATA_STYLE = 'metadata';

const LETTERING_SUBJECT = 'lettering-subject';
const LETTERING_MODIFIER = 'lettering-modifier';
const LETTERING_CONTENT = 'lettering-content';

const END_OF_LETTERING = Symbol('end of lettering');

export default function token(stream, state) {
  if (stream.match(/^\t/i)) {
    state.lettering = letteringState(stream);
    return state.lettering.lineStyles;
  }

  if (state.lettering) {
    const nextStyle = state.lettering.next(stream);
    if (nextStyle === END_OF_LETTERING) {
      state.lettering = undefined;
      return null;
    } else {
      return nextStyle;
    }
  }

  if (stream.match(/^page \d+$/i)) return PAGE_STYLE;
  if (stream.match(/^panel \d+$/i)) return PANEL_STYLE;
  if (stream.match(/^(.+): ?(.+)/)) return METADATA_STYLE;

  // advance stream past stuff that isn't styled, like plain paragraphs
  stream.skipToEnd();
  return null;
}


/**
 * Special token handler for lettering that can contain bold.
 *
 * @param {Object} stream - Stream from codemirror
 * @returns {String} tokens
 */
function tokenLetteringText(stream) {
  const tokens = [LETTERING_CONTENT];

  // stream is currently at double star
  if (stream.match(/^\*\*/)) {
    // and there is another double star somewhere
    if (stream.match(/.*?\*\*/)) {
      // that was a run of lettering-bold
      tokens.push(LETTERING_BOLD_STYLE);
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

// figure out lettering type on the fly, when parsing subject token
// the style for subject is the lettering-subject style and also a line- style
// after determining subject, it sets: line- style, bold parsing rules
function letteringState(stream) {
  let lineStyles = null;
  let allowsBoldInContent;

  if (stream.match(/^sfx/i, false)) {
    allowsBoldInContent = false;
    lineStyles = 'line-cm-lettering line-cm-sfx';
  } else if (stream.match(/^caption/i, false)) {
    allowsBoldInContent = true;
    lineStyles = 'line-cm-lettering line-cm-caption';
  } else {
    allowsBoldInContent = true;
    lineStyles = 'line-cm-lettering line-cm-dialogue';
  }

  const state = {
    subjectDone: false,
    subjectSuffixTrimmed: false,
    modifierDone: false,
    colonDone: false,
    contentDone: false,
    contentPrefixTrimmed: false
  };

  return {
    next(stream) {
      if (!state.subjectDone) {
        if (stream.match(/^sfx/i)) {
          state.subjectDone = true;
          return LETTERING_SUBJECT;
        } else if (stream.match(/^caption/i)) {
          state.subjectDone = true;
          return LETTERING_SUBJECT;
        } else {
          /*
          match some text follow by any of:
            spaces and parens
            spaces and colon
            end of string
          */
          stream.match(/^.*?(?= *\(.*\)| *:|$)/);
          state.subjectDone = true;
          return LETTERING_SUBJECT;
        }
      }

      if (!state.subjectSuffixTrimmed) {
        state.subjectSuffixTrimmed = true;
        if (stream.eatSpace()) return null;
      }

      if (!state.modifierDone && !state.colonDone) {
        if (stream.eatSpace()) return null;

        if (stream.peek() === '(') {
          if (stream.eatWhile(/[^)]/)) {
            state.modifierDone = true;
            stream.next();
            return LETTERING_MODIFIER;
          }
        }
      }

      if (!state.colonDone) {
        if (stream.eat(':')) {
          state.colonDone = true;
        }
        return null;
      }

      if (!state.contentPrefixTrimmed) {
        state.contentPrefixTrimmed = true;
        if (stream.eatSpace()) return null;
      }

      if (!state.contentDone) {
        if (allowsBoldInContent) {
          const styles = tokenLetteringText(stream);

          if (stream.eol()) {
            state.contentDone = true;
          }

          return styles;
        } else {
          state.contentDone = true;
          stream.skipToEnd();
          return LETTERING_CONTENT;
        }
      }

      return END_OF_LETTERING;
    },
    get lineStyles() {
      return lineStyles;
    }
  };
}
