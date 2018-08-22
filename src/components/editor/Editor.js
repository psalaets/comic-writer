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
        onScroll={this.props.handelScroll}
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

    // The page that cursor is in
    let cursorPage;
    let cursorPanel;

    let pageNumber = 0;
    let panelNumber = 0;

    const newValue = lines
      .map(line => {
        const isPage = line.text.match(/^## /);
        const isPanel = line.text.match(/^### /);

        if (isPage) {
          pageNumber += 1;
          panelNumber = 0;
        } else if (isPanel) {
          panelNumber += 1;
        }

        if (line.containsCursor) {
          if (pageNumber > 0) {
            cursorPage = pageNumber;
          }

          if (panelNumber > 0) {
            cursorPanel = panelNumber;
          }
        }

        if (isPage) {
          const newLine = `## Page ${pageNumber}`;

          if (line.containsCursor) {
            cursor += newLine.length - line.length;
          }

          return newLine;
        } else if (isPanel) {
          const newLine = `### Panel ${panelNumber}`;

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
        value: newValue,
        cursorAtEnd: newValue.length === cursor,
        cursorPage,
        cursorPanel
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
