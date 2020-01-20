import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';

import { SpreadStats } from '../../store/selectors/stat-types';
import { EditorChangeEvent } from './Editor';

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

type Props = {
  value: string;
  editorWidth: number;
  stats: Array<SpreadStats>;
  characters: Array<string>;
  onChange: (event: EditorChangeEvent) => void;
}

type StatsPlugin = {
  update: (stats: Array<SpreadStats>) => void;
}

export default class CodeMirrorComponent extends Component<Props> {
  rootRef = React.createRef<HTMLDivElement>();
  cm: CodeMirror.Editor | null = null;
  wordCounts: StatsPlugin | null = null;
  panelCounts: StatsPlugin | null = null;

  constructor(props: Props) {
    super(props);

    this.getCharacterNames = this.getCharacterNames.bind(this);
  }

  render() {
    const styles = {
      maxWidth: `${this.props.editorWidth + 2}ex`,
    }
    return <div className="c-codemirror" style={styles} ref={this.rootRef} />;
  }

  componentDidUpdate(prevProps: Props) {
    const valueChanged = prevProps.value !== this.props.value;
    const statsChanged = prevProps.stats !== this.props.stats;

    // initial value
    const cm = this.getCodeMirrorInstance();
    if (valueChanged && !cm.getValue()) {
      cm.setValue(this.props.value);
    }

    if (statsChanged) {
      this.updateWordCounts(this.props.stats);
      this.updatePanelCounts(this.props.stats);
    }
  }

  getCodeMirrorInstance(): CodeMirror.Editor {
    if (this.cm == null) {
      throw new Error('cm is not set yet');
    }

    return this.cm;
  }

  updateWordCounts(stats: Array<SpreadStats>): void {
    if (this.wordCounts == null) {
      throw new Error('wordCounts is not initialized yet');
    }

    this.wordCounts.update(stats);
  }

  updatePanelCounts(stats: Array<SpreadStats>): void {
    if (this.panelCounts == null) {
      throw new Error('panelCounts is not initialized yet?');
    }

    this.panelCounts.update(stats);
  }

  getRootElement(): HTMLElement {
    if (this.rootRef.current == null) {
      throw new Error('root ref is not available yet');
    }

    return this.rootRef.current;
  }

  componentDidMount() {
    const getCharacterNames = this.getCharacterNames;

    this.cm = CodeMirror(this.getRootElement(), {
      mode: MODE,
      theme: THEME,
      value: this.props.value,
      inputStyle: 'contenteditable',
      placeholder: 'Adventure starts here...',
      lineWrapping: true,
      cursorScrollMargin: 100, // Not *exactly* sure why this value works.
      scrollbarStyle: "null",
      scrollPastEnd: true,
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
        'Cmd-B': letteringBoldCommand,
        'Ctrl-B': letteringBoldCommand,
      }
    });

    this.cm.setSize('100%', '100%');

    this.cm.on('change', (cm, change) => {
      if (change.origin === 'setValue' || change.origin === 'preprocessing') {
        return;
      }

      const oldLines = cm.getValue().split(/\n/);
      const newLines = preprocessLines(oldLines, cm.getCursor().line);

      this.getCodeMirrorInstance().operation(() => {
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

    this.wordCounts = createWordCounts(this.cm);
    this.panelCounts = createPanelCounts(this.cm);
  }

  getCharacterNames(): Array<string> {
    return this.props.characters;
  }
}
