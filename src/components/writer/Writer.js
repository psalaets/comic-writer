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
      source: event.value
    });
  }

  render() {
    return (
      <main className="c-writer">
        <h2 className="u-hide--visually">Editor</h2>
        <Editor
          key="editor"
          value={this.props.source}
          stats={this.props.stats}
          characters={this.props.characters}
          onChange={this.handleChange}
        />
      </main>
    );
  }
}

Writer.propTypes = {
  source: PropTypes.string.isRequired,
  onSourceChange: PropTypes.func.isRequired,
  stats: PropTypes.array.isRequired,
  characters: PropTypes.arrayOf(PropTypes.string).isRequired
};
