import React, { Component } from 'react';
import PropTypes from 'prop-types';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';

export default class CodeMirror extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  render() {
    const styles = {
      maxWidth: `${this.props.editorWidth + 2}ex`
    }
    return (
      <>
        <label className="u-hide--visually" htmlFor="code-mirror-textarea">Editor</label>
        <div className="c-codemirror" style={styles} ref={this.el} />
      </>
    );
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

      this.cm.setValue(this.props.value);
      this.cm.setCursor({
        line, ch
      });
    }
  }

  componentDidMount() {
    this.cm = codemirror(this.el.current, {
      value: this.props.value,
      lineWrapping: true,
      cursorScrollMargin: 200, // Not *exactly* sure why this value works.
      scrollbarStyle: null,
    });

    // Doing this for A11y, textarea's (even though hidden) need an ID and a
    // Label
    const cmTextarea = document.querySelector('.'+this.el.current.className + ' textarea');
    cmTextarea.id = "code-mirror-textarea"
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
  }

  componentWillUnmount() {

  }
}

CodeMirror.propTypes = {
  value: PropTypes.string.isRequired,
  cursor: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
