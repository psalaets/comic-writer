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
      scrollPercentage: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    this.setState({
      value: postParse(parse(value))
    });
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
          blocks={this.state.value}
          scrollPercentage={this.state.scrollPercentage}
        />
      </main>
    );
  }
}
