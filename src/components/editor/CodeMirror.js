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

import {
  create as createPanelCounts
} from '../../codemirror/panel-counts';


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
    const valueChanged = prevProps.value !== this.props.value;
    const statsChanged = prevProps.stats !== this.props.stats;

    if (valueChanged) {
      withScrollPreserved(this.cm, cm => {
        cm.setValue(this.props.value);
        cm.setCursor(this.props.cursor);
      });
    }

    if (statsChanged) {
      this.wordCountsGutter.update(this.props.stats);
    }

    if (valueChanged && statsChanged) {
      this.panelCounts.update(this.props.stats);
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

      const cursor = cm.getCursor();

      this.props.onChange({
        value: cm.getValue(),
        cursor: {
          line: cursor.line,
          ch: cursor.ch
        }
      })
    });

    this.wordCountsGutter = createWordCounts(this.cm);
    this.panelCounts = createPanelCounts(this.cm);
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
  cursor: PropTypes.shape({
    line: PropTypes.number.isRequired,
    ch: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  stats: PropTypes.array.isRequired
};
