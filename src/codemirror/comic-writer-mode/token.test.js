import CodeMirror from 'codemirror';
import createMode from './mode-config';
import token from './token';

const cmConfig = {};
const startState = createMode(cmConfig).startState;

describe('mode.token()', () => {
  describe('page', () => {
    test('single digit page', () => {
      const tokens = collectTokens('page 5', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('multi digit page', () => {
      const tokens = collectTokens('page 10', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix', () => {
      const tokens = collectTokens('page', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix number', () => {
      const tokens = collectTokens('page ', startState());

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('panel', () => {
    test('single digit panel', () => {
      const tokens = collectTokens('panel 2', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('multi digit panel', () => {
      const tokens = collectTokens('panel 10', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix', () => {
      const tokens = collectTokens('panel', startState());

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix number', () => {
      const tokens = collectTokens('panel ', startState());

      expect(tokens).toMatchSnapshot();
    });
  });
});

function collectTokens(line, state) {
  const tabSize = 4;
  const stream = new CodeMirror.StringStream(line, tabSize);
  const tokens = [];

  while (!stream.eol()) {
    const style = token(stream, state);

    if (stream.pos === stream.start) {
      throw Error('failed to advance stream');
    }

    tokens.push({
      style: style ? style.split(' ').sort() : style,
      start: stream.start,
      end: stream.pos,
      string: stream.current()
    });
  }

  return tokens;
}