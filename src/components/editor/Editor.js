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
          stats={this.props.stats}
          onChange={this.handleChange}
        />
    )
  }

  handleChange(event) {
    this.props.onChange(event);
  }
}

Editor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  stats: PropTypes.array.isRequired
};
