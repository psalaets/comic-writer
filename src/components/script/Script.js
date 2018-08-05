import React, { Component } from 'react';
import SimpleMarkdown from 'simple-markdown';
import './Script.css';
const mdOutput = SimpleMarkdown.defaultReactOutput;

export default class Script extends Component {
  render() {
    const output = mdOutput(this.props.blocks);
    return (<div className="Script">{output}</div>);
  }
}
