import React, { Component } from 'react';
import './Editor.css';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.setTextarea = this.setTextarea.bind(this);
  }

  render() {
    return (
      <textarea
        className="Editor"
        value={this.state.value}
        onChange={this.handleChange}
        ref={this.setTextarea}
      />
    )
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }

  handleChange(event) {
    const value = event.target.value;
    let cursor = event.target.selectionStart;

    let runningLength = 0;
    const lines = value.split(/\n/)
      .map((text, index) => {
        const line = {
          number: index + 1,
          text: text,
          length: text.length,
          start: runningLength,
          end: runningLength + text.length
        };

        runningLength += line.length + 1;

        return line;
      })

    lines.filter(line => {
      return line.start <= cursor && line.end >= cursor;
    })
      .forEach(line => {
        line.containsCursor = true;
      });

    let pageNumber = 1;
    let panelNumber = 1;

    const newValue = lines
      .map((line, index, array) => {
        if (line.text.match(/^## /)) {
          panelNumber = 1;

          const newLine = `## Page ${pageNumber++}`;

          if (line.containsCursor) {
            cursor += newLine.length - line.length;
          }

          return newLine;
        } else if (line.text.match(/^### /)) {
          const newLine = `### Panel ${panelNumber++}`;

          if (line.containsCursor) {
            cursor += newLine.length - line.length;
          }

          return newLine;
        } else {
          return line.text;
        }
      })
      .join('\n');

    if (this.props.onChange) {
      this.props.onChange({
        value: newValue
      });
    }

    this.setState({
      value: newValue
    }, () => {
      if (this.textarea) {
        this.textarea.setSelectionRange(cursor, cursor);
      }
    });
  }
}
