import CodeMirror from 'codemirror';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, cmConfig => {
  return {
    startState() {
      return {
        isInCaption: false
      };
    },
    token(stream, state) {
      if (stream.match(/^\tcaption ?(\(.+\))?: ?/i)) {
        state.isInCaption = !stream.eol();
        return 'caption';
      }

      // currently in caption
      if (state.isInCaption) {
        // but at the end of the line
        if (stream.eol()) {
          // this is the end of the caption
          state.isInCaption = false;
          return 'caption';
        }
        // stream is currently at double star
        else if (stream.match(/\*\*/)) {
          // and there is another double star somewhere
          if (stream.match(/.*?\*\*/)) {
            // that was a lettering-bold
            state.isInCaption = !stream.eol();
            return 'caption lettering-bold'
          }
          // it was actually an unpaired double star
          else {
            // the rest of the line is regular caption
            stream.skipToEnd();
            state.isInCaption = false;
            return 'caption';
          }
        }
        // stream isn't at double star but there is a double star on the line
        else if (stream.skipTo('**')) {
          // we skipped past some regular caption
          return 'caption';
        }
        // no double star anywhere
        else {
          // the rest of the line is regular caption
          stream.skipToEnd();
          state.isInCaption = false;
          return 'caption';
        }
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