import CodeMirror from 'codemirror';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

// these values become css classes so keep them synced with theme file
const PAGE_STYLE = 'page';
const PANEL_STYLE = 'panel';
const SFX_STYLE = 'sfx';
const CAPTION_STYLE = 'caption';
const DIALOGUE_STYLE = 'dialogue';
const LETTERING_BOLD_STYLE = 'lettering-bold';
const METADATA_STYLE = 'metadata';

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
      if (stream.match(/^\tsfx ?(\(.+\))?: ?(.+)$/i)) return SFX_STYLE;

      // match the first part of a caption
      if (stream.match(/^\tcaption ?(\(.+\))?: ?/i)) {
        state.isInCaptionText = !stream.eol();
        return CAPTION_STYLE;
      }

      // handle caption text
      if (state.isInCaptionText) {
        const styles = tokenLetteringText(stream, CAPTION_STYLE);
        state.isInCaptionText = !stream.eol();
        return styles;
      }

      // dialogue matching must be after sfx and caption to prevent characters
      // named "sfx" and "caption"
      if (stream.match(/^\t(.+) ?(\(.+\))?: ?/)) {
        state.isInDialogueText = !stream.eol();
        return DIALOGUE_STYLE;
      }

      if (state.isInDialogueText) {
        const styles = tokenLetteringText(stream, DIALOGUE_STYLE);
        state.isInDialogueText = !stream.eol();
        return styles;
      }

      if (stream.match(/^page \d+$/i)) return PAGE_STYLE;
      if (stream.match(/^panel \d+$/i)) return PANEL_STYLE;
      if (stream.match(/^(.+): ?(.+)/)) return METADATA_STYLE;

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
 * @param {String} defaultToken - Default token to return on every call
 * @returns {String} tokens
 */
function tokenLetteringText(stream, defaultToken) {
  const tokens = [defaultToken];

  // stream is currently at double star
  if (stream.match(/\*\*/)) {
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