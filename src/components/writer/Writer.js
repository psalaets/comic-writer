import React, { Component } from 'react';
import './Writer.css';

import Editor from '../editor/Editor';

import SimpleMarkdown from 'simple-markdown';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    const parsed = SimpleMarkdown.defaultBlockParse(value);

    this.setState({
      value: JSON.stringify(parsed, null, 2)
    });
  }

  render() {
    return (
      <div className="writer">
        <Editor onChange={this.handleChange} />
        <pre>
          {this.state.value}
        </pre>
      </div>
    );
  }
}