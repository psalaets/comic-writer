import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

import autosize from 'autosize';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.textareaRef = React.createRef();
  }

  componentDidMount() {
    autosize(this.textareaRef.current);
    this.autoSize();
  }

  componentWillUnmount() {
    autosize.destroy(this.textareaRef.current);
  }

  componentDidUpdate(prevProps) {
    const widthChanged = this.props.editorWidthPercent !== prevProps.editorWidthPercent;
    const valueChanged = this.props.value !== prevProps.value;

    if (widthChanged || valueChanged) {
      this.autoSize();
    }

    if (this.props.cursor !== prevProps.cursor) {
      this.textareaRef.current.setSelectionRange(this.props.cursor, this.props.cursor);
    }
  }

  render() {
    return (
      <div className="c-editor"
        onScroll={this.props.onScroll}
        onClick={this.handleClick}
       >
        <label key="editor-label" htmlFor="editor" className="u-hide--visually">Script Editor</label>
        <textarea
          key="editor-area"
          id="editor"
          className="c-editor__textarea"
          value={this.props.value}
          onChange={this.handleChange}
          ref={this.textareaRef}
          tabIndex="0"
          placeholder="Adventure starts here..."
          rows="1"
        />
        <div className="c-editor__scrollpast" />
      </div>
    )
  }

  handleClick(event) {
    if (event.target !== this.textareaRef.current) {
      const cursor = this.textareaRef.current.value.length;

      this.textareaRef.current.focus();
      this.textareaRef.current.setSelectionRange(cursor, cursor);
    }
  }

  // Semi hack: keeps the textarea big enough so it never needs a scrollbar
  autoSize() {
    if (process.env.NODE_ENV === 'test') return;

    autosize.update(this.textareaRef.current);
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
