import React, { Component } from 'react';
import PropTypes from 'prop-types';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

export default class CodeMirror extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
  }

  render() {
    return <div ref={this.el} />;
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
      value: 'test'
    });

    this.cm.on('beforeChange', (cm, change) => {
      // console.log('cm.beforeChange:', change);
      // console.log('cm.getValue()', cm.getValue())

      // this.props.onChange({
      //   target: {
      //     value: change
      //   }
      // })
    });

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
  onChange: PropTypes.func.isRequired
};