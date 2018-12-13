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
          stats={this.props.stats}
          onChange={this.handleChange}
        />
    )
  }

  handleChange(event) {
    this.props.onChange({
      value: event.value,
      cursor: event.cursor
    });
  }
}

Editor.propTypes = {
  cursor: PropTypes.shape({
    line: PropTypes.number.isRequired,
    ch: PropTypes.number.isRequired
  }).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  stats: PropTypes.array.isRequired
};
