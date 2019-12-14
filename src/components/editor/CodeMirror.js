import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';

import { preprocessLines } from '../../preprocessor';

import { MODE, THEME } from '../../codemirror/comic-writer-mode';
import {
  ID as WORD_COUNTS,
  create as createWordCounts
} from '../../codemirror/gutters/word-counts';

import {
  create as createPanelCounts
} from '../../codemirror/panel-counts';

import { letteringSnippet } from '../../codemirror/lettering-snippet';
import { letteringBoldCommand } from '../../codemirror/lettering-bold-command';

import '../../codemirror/theme.css';

import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/scrollpastend';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

CodeMirror.commands.letteringBoldCommand = letteringBoldCommand;

export default class CodeMirrorComponent extends Component {
  constructor(props) {
    super(props);

    this.el = React.createRef();
    this.getCharacterNames = this.getCharacterNames.bind(this);
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

    if (valueChanged && !this.cm.getValue()) {
      this.cm.setValue(this.props.value);
    }

    if (statsChanged) {
      this.wordCountsGutter.update(this.props.stats);
      this.panelCounts.update(this.props.stats);
    }
  }

  componentDidMount() {
    const getCharacterNames = this.getCharacterNames;

    this.cm = CodeMirror(this.el.current, {
      mode: MODE,
      theme: THEME,
      value: this.props.value,
      inputStyle: 'contenteditable',
      placeholder: 'Adventure starts here...',
      lineWrapping: true,
      cursorScrollMargin: 100, // Not *exactly* sure why this value works.
      scrollbarStyle: null,
      scrollPastEnd: true,
      spellcheck: true,
      gutters: [WORD_COUNTS],
      extraKeys: {
        Tab(cm) {
          const cursor = cm.getCursor();
          const line = cm.getLine(cursor.line);

          // they hit tab on a blank line
          if (line === '') {
            letteringSnippet(cm, getCharacterNames);
          } else {
            return CodeMirror.Pass;
          }
        },
        'Cmd-B': 'letteringBoldCommand',
        'Ctrl-B': 'letteringBoldCommand',
      }
    });

    this.cm.setSize('100%', '100%');

    this.cm.on('change', (cm, change) => {
      if (change.origin === 'setValue' || change.origin === 'preprocessing') {
        return;
      }

      const oldLines = cm.getValue().split(/\n/);
      const newLines = preprocessLines(oldLines, cm.getCursor().line);

      this.cm.operation(() => {
        newLines.forEach((newLine, index) => {
          const oldLine = oldLines[index] || '';
          if (newLine !== oldLine) {
            const from = { line: index, ch: 0 };
            const to = { line: index, ch: 10000 };

            cm.replaceRange(newLine, from, to, 'preprocessing');
          }
        });
      });

      this.props.onChange({
        value: newLines.join('\n')
      });
    });

    this.wordCountsGutter = createWordCounts(this.cm);
    this.panelCounts = createPanelCounts(this.cm);
  }

  getCharacterNames() {
    return this.props.characters;
  }

  componentWillUnmount() {

  }
}

CodeMirrorComponent.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  stats: PropTypes.array.isRequired,
  characters: PropTypes.arrayOf(PropTypes.string).isRequired
};
