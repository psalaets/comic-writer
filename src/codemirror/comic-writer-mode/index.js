import CodeMirror from 'codemirror';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, cmConfig => {
  return {
    startState() {
      return {};
    },
    token(stream, state) {
      if (stream.match(/^page \d+$/i)) return 'page';
      if (stream.match(/^panel \d+$/i)) return 'panel';
      if (stream.match(/^\tsfx ?(\(.+\))?: ?([^]+)$/i)) return 'sfx';
      if (stream.match(/^\tcaption ?(\(.+\))?: ?([^]+)$/i)) return 'caption';
      if (stream.match(/^\t([^]+) ?(\([^]+\))?: ?([^]+)$/)) return 'dialogue';
      if (stream.match(/^([^]+): ?([^]+)/)) return 'metadata';

      // advance stream past stuff that isn't styled, like plain paragraphs
      stream.skipToEnd();
      return null;
    }
  };
});