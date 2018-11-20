import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

import CodeMirror from './CodeMirror';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div className="c-editor">
        <CodeMirror
          editorWidth={80}
          value={this.props.value}
          cursor={this.props.cursor}
          onChange={this.handleChange}
          onScroll={this.props.onScroll}
        />
      </div>
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
};
