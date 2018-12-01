import CodeMirror from 'codemirror';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, cmConfig => {
  return {
    startState() {
      return {
        isInCaptionText: false
      };
    },
    token(stream, state) {
      if (stream.match(/^\tcaption ?(\(.+\))?: ?/i)) {
        state.isInCaptionText = !stream.eol();
        return 'caption';
      }

      if (state.isInCaptionText) {
        return tokenCaptionText(stream, state);
      }

      if (stream.match(/^\t([^]+) ?(\([^]+\))?: ?([^]+)$/)) return 'dialogue';

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

function tokenCaptionText(stream, state) {
  const tokens = ['caption'];

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

  state.isInCaptionText = !stream.eol();
  return tokens.join(' ');
}