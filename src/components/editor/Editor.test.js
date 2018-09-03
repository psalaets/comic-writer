import React from 'react';
import renderer from 'react-test-renderer';

import Editor from './Editor';

describe('Editor', () => {
  describe('page markers', () => {
    it('first marker', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = `## `
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding marker at start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## \n## Page 1\npage 1 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding marker at end', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n## '
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding marker in the middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n## \n## Page 2\npage 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting page at start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 3\npage 3 info\n## Page 1\npage 1 info\n## Page 2\npage 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting page at end', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 2\npage 2 info\n## Page 1\npage 1 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting page in middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n## Page 3\npage 3 info\n## Page 2\npage 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('remove page from start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 2\npage 2 info\n## Page 3\npage 3 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('remove page from middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n## Page 3\npage 3 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting content with page count in double digits', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const tenPages = Array.from(new Array(10), (p, i) => `## Page ${i + 1}`).join('\n');
      const value = tenPages + '\n## \n## \n## ';
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })
  })

  describe('panel markers', () => {
    it('adding panel to page', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n### '
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding second panel to page', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n### Panel 1\n### '
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding panel at start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n### \n### Panel 1\npanel 1 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding panel in middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 1\npanel 1 info\n### \n### Panel 2\npanel 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding panel to second page', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 1\npanel 1 info\n## Page 2\n### '
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('adding another panel to second page', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 1\npanel 1 info\n## Page 2\n### Panel 1\n### '
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting panel at start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\npage 1 info\n### Panel 2\n### Panel 1\npanel 1 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('pasting panel in middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 1\npanel 1 info\n### Panel 3\n### Panel 2\npanel 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('removing panel from start', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 2\npanel 2 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })

    it('removing panel from middle', () => {
      const component = renderer.create(<Editor onChange={noOp} onScroll={noOp} />);
      let textarea = getTextarea(component);

      const value = '## Page 1\n### Panel 1\npanel 1 info\n### Panel 3\npanel 3 info'
      textarea.props.onChange(onChangeEvent(value));

      textarea = getTextarea(component);

      expect(textarea).toMatchSnapshot();
    })
  })

  describe('onChange event', () => {
    describe('value', () => {
      it('when changed with basic text', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = 'this is some basic text'
        textarea.props.onChange(onChangeEvent(value));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('this is some basic text');
      })

      it('changed with markdown', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = '## '
        textarea.props.onChange(onChangeEvent(value));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('## Page 1');
      })

      it('cleared', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent(''));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('');
      })
    })

    describe('cursorAtEnd', () => {
      it('cursor at the end of value', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent('abc', 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorAtEnd).toBe(true);
      })

      it('cursor in middle of value', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent('abc', 1));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorAtEnd).toBe(false);
      })
    })

    describe('cursorPage and cursorPanel', () => {
      it('cursor in a page and panel', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = '## Page 1\n## Page 2\n### Panel 1\nadsf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(2);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(1);
      })

      it('cursor has no page nor panel', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = 'asdf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(undefined);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(undefined);
      })

      it('cursor has page only', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = '## Page 1\n## Page 2\nasdf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(2);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(undefined);
      })

      it('cursor has panel only', () => {
        const onChange = jest.fn();
        const component = renderer.create(<Editor onChange={onChange} onScroll={noOp} />);
        let textarea = getTextarea(component);

        const value = '### Panel 1\n### Panel 2\nasdf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(undefined);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(2);
      })
    })
  })
})

function noOp() {}

function onChangeEvent(text, selectionStart = 0) {
  return {
    target: {
      value: text,
      selectionStart
    }
  };
}

function getTextarea(testRenderedEditor) {
  const json = testRenderedEditor.toJSON();
  const children = json.children;

  if (!Array.isArray(children) || children.length < 2) {
    throw new Error('expected toJSON() to return element with 2 children' + json);
  }

  return children[1];
}