import React, { Component } from 'react';
import PropTypes from 'prop-types';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';

import { MODE, THEME } from '../../codemirror/comic-writer-mode';
import {
  ID as WORD_COUNTS,
  create as createWordCounts
} from '../../codemirror/gutters/word-counts';
import '../../codemirror/theme.css';

import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/scrollpastend';

export default class CodeMirror extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  render() {
    const styles = {
      maxWidth: `${this.props.editorWidth + 2}ex`,
    }
    return <div className="c-codemirror" style={styles} ref={this.el} />;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      let line = 0;
      let ch = 0;
      let charsSeen = 0;

      const lines = this.props.value.split(/\n/);

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length + charsSeen >= this.props.cursor) {
          ch = lines[i].length - ((lines[i].length + charsSeen) - this.props.cursor);
          break;
        } else {
          charsSeen += lines[i].length + 1;
          line += 1;
        }
      }

      withScrollPreserved(this.cm, cm => {
        cm.setValue(this.props.value);
        cm.setCursor({
          line, ch
        });
      });
    }

    if (prevProps.wordCounts !== this.props.wordCounts) {
      this.wordCountsGutter.update(this.props.wordCounts);
    }
  }

  componentDidMount() {
    this.cm = codemirror(this.el.current, {
      mode: MODE,
      theme: THEME,
      value: this.props.value,
      inputStyle: 'contenteditable',
      placeholder: 'Adventure starts here...',
      lineWrapping: true,
      cursorScrollMargin: 100, // Not *exactly* sure why this value works.
      scrollbarStyle: null,
      scrollPastEnd: true,
      gutters: [WORD_COUNTS]
    });

    this.cm.setSize('100%', '100%');

    this.cm.on('change', (cm, change) => {
      if (change.origin === 'setValue') {
        return;
      }

      // convert line/ch from codemirror into a selectionStart-like value
      let {line, ch} = cm.getCursor();
      const lines = cm.getValue().split(/\n/);
      let selectionStart = 0;

      for (let i = 0; i < line; i++) {
        if (line > 0) {
          selectionStart += 1;
        }

        selectionStart += lines[i].length;
      }
      selectionStart += ch;

      this.props.onChange({
        target: {
          value: cm.getValue(),
          selectionStart
        }
      })
    });

    this.wordCountsGutter = createWordCounts(this.cm);
  }

  componentWillUnmount() {

  }
}

function withScrollPreserved(cmInstance, fn) {
  const scrollInfo = cmInstance.getScrollInfo();
  fn(cmInstance);
  cmInstance.scrollTo(scrollInfo.left, scrollInfo.top);
}

CodeMirror.propTypes = {
  value: PropTypes.string.isRequired,
  cursor: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  wordCounts: PropTypes.array.isRequired
};
