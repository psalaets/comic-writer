import React, { Component } from 'react';
import './Writer.css';

import { parse } from '../../custom-markdown';

import Editor from '../editor/Editor';
import Script from '../script/Script';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [],
      scrollPercentage: 0,
      editorWidthPercent: 50,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleWidthControl = this.handleWidthControl.bind(this);
    this.controlIsVisible = this.controlIsVisible.bind(this);
  }

  handleChange(event) {
    const {value} = event;

    this.setState({
      value: parse(value)
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

  // This might be more complicated than it needs to be.
  handleWidthControl(type) {
    return () => {
      type === 'script' ? this.setState({
        editorWidthPercent: this.state.editorWidthPercent === 100 ? 50 :
                            this.state.editorWidthPercent >= 50 ? 0 :
                            50
      }):
      type === 'writer' ? this.setState({
        editorWidthPercent: this.state.editorWidthPercent >= 50 ? 100 : 50,
      }):
      false
    }
  }

  // This might be more complicated than it needs to be.
  controlIsVisible(type) {
    console.log(this.state.editorWidthPercent);
    return this.state.editorWidthPercent === 50 ? true :
           type === 'script' ?
             this.state.editorWidthPercent <= 50 ? false : true :
           type === 'writer' ?
             this.state.editorWidthPercent <= 50 ? true : false :
           true
  }

  render() {
    return (
      <main className="Writer">
        <Editor
          onChange={this.handleChange}
          onScroll={this.handleScroll('editor')}
          editorWidthPercent={this.state.editorWidthPercent}
        />

        {this.controlIsVisible('script') ? <button
          className="Writer__view-control Writer__view-control-script"
          onClick={this.handleWidthControl('script')}
        >
          ◀
          <span className="u-hide--visually">
            Expand Script View
          </span>
        </button> : false}

        {this.controlIsVisible('writer') ? <button
          className="Writer__view-control Writer__view-control-writer"
          onClick={this.handleWidthControl('writer')}
        >
          ▶
          <span className="u-hide--visually">
            Expand Writer View
          </span>
        </button> : false}

        <Script
          tabIndexHide={!this.controlIsVisible('writer')}
          blocks={this.state.value}
          scrollPercentage={this.state.scrollPercentage}
          editorWidthPercent={this.state.editorWidthPercent}
        />
      </main>
    );
  }
}
