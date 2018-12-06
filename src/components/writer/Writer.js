import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Writer.css';

import Editor from '../editor/Editor';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onSourceChange({
      source: event.value,
      cursor: event.cursor
    });
  }

  render() {
    return (
      <main className="c-writer">
        <Editor
          key="editor"
          value={this.props.source}
          cursor={this.props.cursor}
          wordCounts={this.props.wordCounts}
          onChange={this.handleChange}
        />
      </main>
    );
  }
}

Writer.propTypes = {
  source: PropTypes.string.isRequired,
  cursor: PropTypes.number.isRequired,
  onSourceChange: PropTypes.func.isRequired,
  wordCounts: PropTypes.array.isRequired
};
