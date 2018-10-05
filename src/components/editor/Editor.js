import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

import autosize from 'autosize';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.setTextarea = this.setTextarea.bind(this);

    this.state = {
      value: this.props.initialValue
    };
  }

  componentDidMount() {
    autosize(this.textarea);
    this.autoSize();
  }

  componentWillUnmount() {
    autosize.destroy(this.textarea);
  }

  componentDidUpdate(prevProps) {
    // Use editorWidthPercent as a indicator to when resize buttons have been
    // pressed in order to run autosize on the textarea.
    if (this.props.editorWidthPercent !== prevProps.editorWidthPercent) {
      this.autoSize()
    }
  }

  render() {
    return (
      <div className="c-editor"
        onScroll={this.props.onScroll}
       >
        <label key="editor-label" htmlFor="editor" className="u-hide--visually">Script Editor</label>
        <textarea
          key="editor-area"
          id="editor"
          className="c-editor__textarea"
          value={this.state.value}
          onChange={this.handleChange}
          ref={this.setTextarea}
          tabIndex="0"
          placeholder="Adventure starts here..."
        />
        <div className="c-editor__scrollpast"/>
      </div>
    )
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }

  // Semi hack: keeps the textarea big enough so it never needs a scrollbar
  autoSize() {
    if (process.env.NODE_ENV === 'test') return;

    autosize.update(this.textarea);
  }

  handleChange(event) {
    this.autoSize();

    const value = event.target.value;
    let cursor = event.target.selectionStart;

    let runningLength = 0;
    const lines = value.split(/\n/)
      .map((text, index) => {
        const line = {
          number: index + 1,
          text: text,
          length: text.length,
          start: runningLength,
          end: runningLength + text.length
        };

        runningLength += line.length + 1;

        return line;
      })

    lines.filter(line => {
      return line.start <= cursor && line.end >= cursor;
    })
      .forEach(line => {
        line.containsCursor = true;
      });

    // The page that cursor is in
    let cursorPage;
    let cursorPanel;

    let pageNumber = 0;
    let panelNumber = 0;

    const newValue = lines
      .map(line => {
        const isPage = line.text.match(/^## /);
        const isPanel = line.text.match(/^### /);

        if (isPage) {
          pageNumber += 1;
          panelNumber = 0;
        } else if (isPanel) {
          panelNumber += 1;
        }

        if (line.containsCursor) {
          if (pageNumber > 0) {
            cursorPage = pageNumber;
          }

          if (panelNumber > 0) {
            cursorPanel = panelNumber;
          }
        }

        if (isPage) {
          const newLine = `## Page ${pageNumber}`;
          cursor += newLine.length - line.length;

          return newLine;
        } else if (isPanel) {
          const newLine = `### Panel ${panelNumber}`;
          cursor += newLine.length - line.length;

          return newLine;
        } else {
          return line.text;
        }
      })
      .join('\n');

    if (this.props.onChange) {
      this.props.onChange({
        value: newValue,
        cursorAtEnd: newValue.length === cursor,
        cursorPage,
        cursorPanel
      });
    }

    this.setState({
      value: newValue
    }, () => {
      if (this.textarea) {
        this.textarea.setSelectionRange(cursor, cursor);
      }
    });
  }
}

Editor.propTypes = {
  initialValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  editorWidthPercent: PropTypes.number,
};
