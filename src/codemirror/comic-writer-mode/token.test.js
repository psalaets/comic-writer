import CodeMirror from 'codemirror';
import createMode from './mode';

const cmConfig = {};
const mode = createMode(cmConfig);

const startState = mode.startState;
const token = mode.token;

describe('mode.token()', () => {
  describe('page', () => {
    test('single digit page', () => {
      const tokens = collectTokens('page 5');

      expect(tokens).toMatchSnapshot();
    });

    test('multi digit page', () => {
      const tokens = collectTokens('page 10');

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix', () => {
      const tokens = collectTokens('page');

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix number', () => {
      const tokens = collectTokens('page ');

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('panel', () => {
    test('single digit panel', () => {
      const tokens = collectTokens('panel 2');

      expect(tokens).toMatchSnapshot();
    });

    test('multi digit panel', () => {
      const tokens = collectTokens('panel 10');

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix', () => {
      const tokens = collectTokens('panel');

      expect(tokens).toMatchSnapshot();
    });

    test('without suffix number', () => {
      const tokens = collectTokens('panel ');

      expect(tokens).toMatchSnapshot();
    });
  });
});

function collectTokens(line) {
  const tabSize = 4;
  const stream = new CodeMirror.StringStream(line, tabSize);
  const state = startState();

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