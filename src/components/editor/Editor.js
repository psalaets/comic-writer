import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Editor.css';

export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      textAreaScrollHeight: '100%' // Default to one-hundo, we don't know the
                                   //  initial height.
    };

    this.handleChange = this.handleChange.bind(this);
    this.setTextarea = this.setTextarea.bind(this);
  }

  render() {
    const style = {
      // height: this.state.textAreaScrollHeight
    }
    return (
      <div className="Editor"
        onScroll={this.props.onScroll}
       >
        <label key="editor-label" htmlFor="editor" className="u-hide--visually">Script Editor</label>
        <textarea
          style={style}
          key="editor-area"
          id="editor"
          className="Editor__textarea"
          value={this.state.value}
          onChange={this.handleChange}
          ref={this.setTextarea}
        />
        <div
          className="Editor__scrollpast"
          onClick={() => document.getElementById('editor').focus()}
        />
      </div>
    )
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }

  autoSize() {
    const el = this.textarea;

    // compute the height difference which is caused by border and outline
    var outerHeight = parseInt(window.getComputedStyle(el).height, 10);
    var diff = outerHeight - el.clientHeight;

    // set the height to 0 in case of it has to be shrinked
    const parent = el.parentElement;
    parent.style['min-height'] = parent.scrollHeight;
    const parentScroll = parent.scrollTop;

    el.style.height = 0;

    // set the correct height
    // el.scrollHeight is the full height of the content, not just the visible part
    el.style.height = el.scrollHeight + diff + 'px';

    parent.scrollTop = parentScroll;
    parent.style['min-height'] = 'initial';
  }

  handleChange(event) {
    // Auto Grow Text area. uses this value to auto-resize text area.
    // this.setState({
    //   textAreaScrollHeight: event.target.scrollHeight
    // })

    this.autoSize();

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
          cursor += newLine.length - line.length;

          return newLine;
        } else if (isPanel) {
          const newLine = `### Panel ${panelNumber}`;
          cursor += newLine.length - line.length;

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

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired
};