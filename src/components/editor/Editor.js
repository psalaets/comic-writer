import React, { Component } from 'react';
import PropTypes from 'prop-types';
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


  componentDidMount() {
    this.setState({
      value: this.props.initialEditorValue
    });
    this.manualChange(this.props.initialEditorValue)
    this.autoSize();
  }

  componentWillUnmount() {
    this.props.onWillUnmount(this.state.value)
  }

  render() {
    return (
      <div className="Editor"
        onScroll={this.props.onScroll}
       >
        <label key="editor-label" htmlFor="editor" className="u-hide--visually">Script Editor</label>
        <textarea
          key="editor-area"
          id="editor"
          className="Editor__textarea"
          value={this.state.value}
          onChange={this.handleChange}
          ref={this.setTextarea}
        />
        <div className="Editor__scrollpast"/>
      </div>
    )
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }
  // this forces an an actual update to the content of the text when loading
  manualChange(val){
    var input = this.textarea;
    input.value = val;
    this.setState({value: val});
  }

  // Semi hack: keeps the textarea big enough so it never needs a scrollbar
  autoSize() {
    if (process.env.NODE_ENV === 'test') return;
    const el = this.textarea;

    // compute the height difference which is caused by border and outline
    const outerHeight = parseInt(window.getComputedStyle(el).height, 10);
    const diff = outerHeight - el.clientHeight;

    // preserve parent height/scroll to prevent snap effect due to what comes next
    const parent = el.parentElement;
    parent.style['min-height'] = parent.scrollHeight;
    const parentScroll = parent.scrollTop;

    // This trick means when we set height later it will be minimal size.
    el.style.height = 0;

    // set the correct height
    // el.scrollHeight is the full height of the content, not just the visible part
    el.style.height = el.scrollHeight + diff + 'px';

    // restore parent since its children are taking up space again
    parent.style['min-height'] = 'initial';
    parent.scrollTop = parentScroll;
  }

  handleChange(event) {
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
