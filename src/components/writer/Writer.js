import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Writer.css';

import Editor from '../editor/Editor';
import Script from '../script/Script';

export default class Writer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: [],
      initialEditorValue: '',
      // This is the value that the editor uses relay scroll position to the
      // script view.
      scrollPercentage: 0,
      // The number that represents the editor/50-50/script view state.
      editorWidthPercent: 50,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.copyEditorContent = this.copyEditorContent.bind(this);
    this.handleWidthControl = this.handleWidthControl.bind(this);
    this.controlIsVisible = this.controlIsVisible.bind(this);
  }

  handleChange(event) {
    this.props.onSourceChange(event.value);
  }

  handleScroll(type) {
    return (event) => {
      // Should this be debounced? Or ceil'd?
      // We want to know where to scroll the top of the editor view relative to
      // to the script view.
      // editors scroll position (from the top) / (the height of the content - visible content in the overflow'd div)
      const percentage = event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight);
      // Relaying this value to state, so we can communicate it to script view.
      this.setState({
        scrollPercentage: percentage
      });
    };
  }

  // This might be more complicated than it needs to be.
  handleWidthControl(type) {
    const scriptCalculateWidth = widthPercent => {
      if (widthPercent === 100) {
        return 50;
      } else if (widthPercent >= 50) {
        return 0;
      } else {
        return 50;
      }
    };

    const editorCalculateWidth = widthPercent => {
      if (widthPercent >= 50) {
        return 100;
      } else {
        return 50;
      }
    };

    return () => {
      if (type === 'script') {
        this.setState({
          editorWidthPercent: scriptCalculateWidth(this.state.editorWidthPercent)
        });
      } else if (type === 'editor') {
        this.setState({
          editorWidthPercent: editorCalculateWidth(this.state.editorWidthPercent)
        });
      } else {
        console.log('You done goofed');
      }
    };
  }

  controlIsVisible(type) {
    if (this.state.editorWidthPercent === 50) {
      return true;
    } else if (type === 'script') {
      if (this.state.editorWidthPercent <= 50) {
        return false;
      } else {
        return true;
      }
    } else if (type === 'editor') {
      if (this.state.editorWidthPercent <= 50) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  copyEditorContent(value) {
    this.setState({
      initialEditorValue: value
    });
  }

  render() {
    return (
      <main className="Writer">
        { this.controlIsVisible('script') ?
            [
              <Editor
                key="editor"
                onChange={this.handleChange}
                onScroll={this.handleScroll('editor')}
                initialEditorValue={this.state.initialEditorValue}
                onWillUnmount={this.copyEditorContent}
                editorWidthPercent={this.state.editorWidthPercent}
              />,
              <button
                key="scriptControl"
                className="Writer__view-control Writer__view-control-script"
                onClick={this.handleWidthControl('script')}
                tabIndex="0"
              >
                <span className="Writer__view-control-text">◀</span>
                <span className="u-hide--visually">
                  Expand Script View
                </span>
              </button>
            ] : false }

        { this.controlIsVisible('editor') ?
            [
              <button
                key="editorControl"
                className="Writer__view-control Writer__view-control-writer"
                onClick={this.handleWidthControl('editor')}
                tabIndex="0"
              >
                <span className="Writer__view-control-text">▶</span>
                <span className="u-hide--visually">
                  Expand Writer View
                </span>
              </button>,
              <Script
                key="script"
                blocks={this.props.parseTree}
                scrollPercentage={this.state.scrollPercentage}
                editorWidthPercent={this.state.editorWidthPercent}
              />
            ] : false }

      </main>
    );
  }
}

Writer.propTypes = {
  parseTree: PropTypes.array.isRequired,
  onSourceChange: PropTypes.func.isRequired
};
