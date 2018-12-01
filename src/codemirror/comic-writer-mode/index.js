import CodeMirror from 'codemirror';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, cmConfig => {
  return {
    startState() {
      return {
        isInCaptionText: false,
        isInDialogueText: false
      };
    },
    indent: () => 0,
    token(stream, state) {
      // match the first part of a caption
      if (stream.match(/^\tcaption ?(\(.+\))?: ?/i)) {
        state.isInCaptionText = !stream.eol();
        return 'caption';
      }

      // handle caption text
      if (state.isInCaptionText) {
        return tokenLetteringText(stream, state, 'isInCaptionText', 'caption');
      }

      // match the first part of dialogue
      if (stream.match(/^\t([^]+) ?(\([^]+\))?: ?/)) {
        state.isInDialogueText = !stream.eol();
        return 'dialogue';
      }

      if (state.isInDialogueText) {
        return tokenLetteringText(stream, state, 'isInDialogueText', 'dialogue');
      }

      // easy matches
      if (stream.match(/^page \d+$/i)) return 'page';
      if (stream.match(/^panel \d+$/i)) return 'panel';
      if (stream.match(/^\tsfx ?(\(.+\))?: ?([^]+)$/i)) return 'sfx';
      if (stream.match(/^([^]+): ?([^]+)/)) return 'metadata';

      // advance stream past stuff that isn't styled, like plain paragraphs
      stream.skipToEnd();
      return null;
    }
  };
});

/**
 * Special token handler for lettering that can contain bold.
 *
 * @param {Object} stream - Stream from codemirror
 * @param {Object} state - State from codemirror
 * @param {String} stateFlagName - Name of state property that determines if
 *                                 tokener is still in the lettering text.
 * @param {String} defaultToken - Default token to return on every call
 * @returns {String} tokens
 */
function tokenLetteringText(stream, state, stateFlagName, defaultToken) {
  const tokens = [defaultToken];

  // stream is currently at double star
  if (stream.match(/\*\*/)) {
    // and there is another double star somewhere
    if (stream.match(/.*?\*\*/)) {
      // that was a run of lettering-bold
      tokens.push('lettering-bold');
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

  state[stateFlagName] = !stream.eol();
  return tokens.join(' ');
}