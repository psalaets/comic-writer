import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

import autosize from 'autosize';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.setTextarea = this.setTextarea.bind(this);
  }

  componentDidMount() {
    autosize(this.textarea);
    this.autoSize();
  }

  componentWillUnmount() {
    autosize.destroy(this.textarea);
  }

  componentDidUpdate(prevProps) {
    const widthChanged = this.props.editorWidthPercent !== prevProps.editorWidthPercent;
    const valueChanged = this.props.value !== prevProps.value;

    if (widthChanged || valueChanged) {
      this.autoSize();
    }

    if (this.props.cursor !== prevProps.cursor) {
      this.textarea.setSelectionRange(this.props.cursor, this.props.cursor);
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
          value={this.props.value}
          onChange={this.handleChange}
          ref={this.setTextarea}
          tabIndex="0"
          placeholder="Adventure starts here..."
          rows="1"
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
    this.props.onChange({
      value: event.target.value,
      cursor: event.target.selectionStart
    });
  }
}

Editor.propTypes = {
  cursor: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  editorWidthPercent: PropTypes.number,
};
