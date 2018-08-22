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
      value: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    this.setState({
      value: postParse(parse(value))
    });
  }

  render() {
    return (
      <div className="Writer">
        <Editor onChange={this.handleChange} />
        <Script blocks={this.state.value} />
      </div>
    );
  }
}
