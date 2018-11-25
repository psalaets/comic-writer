import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Writer.css';

import Editor from '../editor/Editor';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // This is the value that the editor uses relay scroll position to the
      // script view.
      scrollPercentage: 0,
      // The number that represents the editor/50-50/script view state.
      editorWidthPercent: 50,
    };

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
          onChange={this.handleChange}
        />
      </main>
    );
  }
}

Writer.propTypes = {
  source: PropTypes.string.isRequired,
  cursor: PropTypes.number.isRequired,
  onSourceChange: PropTypes.func.isRequired
};
