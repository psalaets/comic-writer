import React, { Component } from 'react';
import SimpleMarkdown from 'simple-markdown';
import './Writer.css';

import Editor from '../editor/Editor';
import Script from '../script/Script';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    this.setState({
      value: SimpleMarkdown.defaultBlockParse(value)
    });
  }

  render() {
    return (
      <div className="writer">
        <Editor onChange={this.handleChange} />
        <Script blocks={this.state.value} />
      </div>
    );
  }
}