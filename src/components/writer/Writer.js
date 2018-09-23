import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Writer.css';

import Editor from '../editor/Editor';
import Script from '../script/Script';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollPercentage: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleChange(event) {
    this.props.onSourceChange(event.value);
  }

  handleScroll(type) {
    return (event) => {
      const percentage = event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight);
      this.setState({
        scrollPercentage: percentage
      });
    }
  }

  render() {
    return (
      <main className="Writer">
        <Editor
          onChange={this.handleChange}
          onScroll={this.handleScroll('editor')}
        />
        <Script
          blocks={this.props.parseTree}
          scrollPercentage={this.state.scrollPercentage}
        />
      </main>
    );
  }
}

Writer.propTypes = {
  parseTree: PropTypes.array.isRequired,
  onSourceChange: PropTypes.func.isRequired
};