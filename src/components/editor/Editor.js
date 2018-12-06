import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CodeMirror from './CodeMirror';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <CodeMirror
          editorWidth={80}
          value={this.props.value}
          cursor={this.props.cursor}
          wordCounts={this.props.wordCounts}
          onChange={this.handleChange}
          onScroll={this.props.onScroll}
        />
    )
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
  onScroll: PropTypes.func,
  editorWidthPercent: PropTypes.number,
  wordCounts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      lineNumber: PropTypes.number,
      count: PropTypes.number
    })
  ).isRequired
};
