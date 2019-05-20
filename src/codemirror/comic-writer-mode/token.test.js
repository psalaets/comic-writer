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

  describe('sfx', () => {
    test('full', () => {
      const tokens = collectTokens('\tsfx (gun): blam');

      expect(tokens).toMatchSnapshot();
    });

    test('no modifier', () => {
      const tokens = collectTokens('\tsfx: blam');

      expect(tokens).toMatchSnapshot();
    });

    test('newly opened modifier', () => {
      const tokens = collectTokens('\tsfx (');

      expect(tokens).toMatchSnapshot();
    });

    test('unclosed modifier', () => {
      const tokens = collectTokens('\tsfx (gun');

      expect(tokens).toMatchSnapshot();
    });

    test('closed modifier but no colon', () => {
      const tokens = collectTokens('\tsfx (gun)');

      expect(tokens).toMatchSnapshot();
    });

    test('no content', () => {
      const tokens = collectTokens('\tsfx:');

      expect(tokens).toMatchSnapshot();
    });

    test('no colon', () => {
      const tokens = collectTokens('\tsfx');

      expect(tokens).toMatchSnapshot();
    });

    test('allows bold content', () => {
      const tokens = collectTokens('\tsfx: bam **bam** bam');

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('caption', () => {
    test('full', () => {
      const tokens = collectTokens('\tcaption (bill): it went well');

      expect(tokens).toMatchSnapshot();
    });

    test('no modifier', () => {
      const tokens = collectTokens('\tcaption: it went well');

      expect(tokens).toMatchSnapshot();
    });

    test('all bold content', () => {
      const tokens = collectTokens('\tcaption: **good one**');

      expect(tokens).toMatchSnapshot();
    });

    test('some bold content', () => {
      const tokens = collectTokens('\tcaption: it **did not** work');

      expect(tokens).toMatchSnapshot();
    });

    test('multiple bolds', () => {
      const tokens = collectTokens('\tcaption: it did **not** work at **all**!');

      expect(tokens).toMatchSnapshot();
    });

    test('no content', () => {
      const tokens = collectTokens('\tcaption:');

      expect(tokens).toMatchSnapshot();
    });

    test('no colon', () => {
      const tokens = collectTokens('\tcaption');

      expect(tokens).toMatchSnapshot();
    });

    test('newly opened modifier', () => {
      const tokens = collectTokens('\tcaption (');

      expect(tokens).toMatchSnapshot();
    });

    test('unclosed modifier', () => {
      const tokens = collectTokens('\tcaption (mom');

      expect(tokens).toMatchSnapshot();
    });

    test('closed modifier but no colon', () => {
      const tokens = collectTokens('\tcaption (mom)');

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('dialogue', () => {
    test('full', () => {
      const tokens = collectTokens('\tbill (whisper): it went well');

      expect(tokens).toMatchSnapshot();
    });

    test('no modifier', () => {
      const tokens = collectTokens('\tbill: it went well');

      expect(tokens).toMatchSnapshot();
    });

    test('all bold content', () => {
      const tokens = collectTokens('\tbill: **good one**');

      expect(tokens).toMatchSnapshot();
    });

    test('some bold content', () => {
      const tokens = collectTokens('\tbill: it **did not** work');

      expect(tokens).toMatchSnapshot();
    });

    test('multiple bolds', () => {
      const tokens = collectTokens('\tbill: it did **not** work at **all**!');

      expect(tokens).toMatchSnapshot();
    });

    test('no content', () => {
      const tokens = collectTokens('\tbill:');

      expect(tokens).toMatchSnapshot();
    });

    test('no colon', () => {
      const tokens = collectTokens('\tbill');

      expect(tokens).toMatchSnapshot();
    });

    test('newly opened modifier', () => {
      const tokens = collectTokens('\tbill (');

      expect(tokens).toMatchSnapshot();
    });

    test('unclosed modifier', () => {
      const tokens = collectTokens('\tbill (yell');

      expect(tokens).toMatchSnapshot();
    });

    test('unclosed modifier with content', () => {
      const tokens = collectTokens('\tbill (yell: ahhh');

      expect(tokens).toMatchSnapshot();
    });

    test('unopened modifier', () => {
      const tokens = collectTokens('\tbill yell)');

      expect(tokens).toMatchSnapshot();
    });

    test('unopened modifier with content', () => {
      const tokens = collectTokens('\tbill yell): ahhh');

      expect(tokens).toMatchSnapshot();
    });

    test('closed modifier but no colon', () => {
      const tokens = collectTokens('\tbill (yell)');

      expect(tokens).toMatchSnapshot();
    });

    test('no subject', () => {
      const tokens = collectTokens('\t(yell): bam');

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('metadata', () => {
    test('full', () => {
      const tokens = collectTokens('name: value');

      expect(tokens).toMatchSnapshot();
    });

    test('no space after colon', () => {
      const tokens = collectTokens('name:value');

      expect(tokens).toMatchSnapshot();
    });

    test('no value', () => {
      const tokens = collectTokens('name:');

      expect(tokens).toMatchSnapshot();
    });

    test('no colon', () => {
      const tokens = collectTokens('name');

      expect(tokens).toMatchSnapshot();
    });
  });

  describe('paragraph', () => {
    test('text', () => {
      const tokens = collectTokens('The first rays of sunrise hit the house. A car waits out front.');

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
    stream.start = stream.pos;
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