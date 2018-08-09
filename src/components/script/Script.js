import React, { Component } from 'react';
import SimpleMarkdown from 'simple-markdown';
import './Script.css';

import { reactOutput } from '../../custom-markdown';

export default class Script extends Component {
  render() {
    const output = reactOutput(this.props.blocks);
    return (<div className="Script">{output}</div>);
  }
}
