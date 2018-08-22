import React, { Component } from 'react';
import './Writer.css';

import { parse } from '../../custom-markdown';

import Editor from '../editor/Editor';
import Script from '../script/Script';

import postParse from '../../custom-markdown/post-parse';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [],
      lineCount: 0,
      cursorAtEnd: false,
      length: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    this.setState({
      value: postParse(parse(value)),
      lineCount: event.lineCount,
      cursorAtEnd: event.cursorAtEnd,
      sourceLength: event.sourceLength
    });
  }

  render() {
    return (
      <div className="writer">
        <Editor onChange={this.handleChange} />
        <Script
          blocks={this.state.value}
          lineCount={this.state.lineCount}
          cursorAtEnd={this.state.cursorAtEnd}
          sourceLength={this.state.sourceLength}
        />
      </div>
    );
  }
}
