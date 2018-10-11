import React from 'react';
import renderer from 'react-test-renderer';

import Editor from './Editor';

describe.skip('Editor', () => {
  describe('onChange event', () => {
    describe('value', () => {
      it('when changed with basic text', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        const value = 'this is some basic text'
        textarea.props.onChange(onChangeEvent(value));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('this is some basic text');
      })

      it('changed with markdown', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        const value = '## '
        textarea.props.onChange(onChangeEvent(value));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('## Page 1');
      })

      it('cleared', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent(''));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].value).toBe('');
      })
    })

    describe('cursorAtEnd', () => {
      it('cursor at the end of value', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent('abc', 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorAtEnd).toBe(true);
      })

      it('cursor in middle of value', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        textarea.props.onChange(onChangeEvent('abc', 1));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorAtEnd).toBe(false);
      })
    })

    describe('cursorPage and cursorPanel', () => {
      it('cursor in a page and panel', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        const value = '## Page 1\n## Page 2\n### Panel 1\nadsf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(2);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(1);
      })

      it('cursor has no page nor panel', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        const value = 'asdf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(undefined);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(undefined);
      })

      it('cursor has page only', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
        let textarea = getTextarea(component);

        const value = '## Page 1\n## Page 2\nasdf';
        textarea.props.onChange(onChangeEvent(value, value.length - 3));

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0].cursorPage).toBe(2);
        expect(onChange.mock.calls[0][0].cursorPanel).toBe(undefined);
      })

      it('cursor has panel only', () => {
        const onChange = jest.fn();
        const component = renderer.create(editor({ onChange }));
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

function editor(propOverrides = {}) {
  const props = {
    onChange: noOp,
    onScroll: noOp,
    initialValue: '',
    editorWidthPercent: 50,
    ...propOverrides
  };
  return <Editor {...props} />;
}

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