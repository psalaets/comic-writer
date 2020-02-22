import React, { Component } from 'react';

import CodeMirror from 'codemirror';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/scrollpastend';

import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';
import './theme.css';

import { EditorChangeEvent } from '../../types';
import { PanelCount, WordCount } from '../../../script/types';

import { preprocessLines } from './preprocessor';
import { MODE, THEME } from './mode';
import {
  ID as WORD_COUNTS,
  create as createWordCounts
} from './gutters/word-counts';
import { create as createPanelCounts } from './line-widgets/panel-counts';
import { letteringSnippet } from './lettering-snippet';
import { letteringBoldCommand } from './lettering-bold-command';

type Props = {
  value: string,
  editorWidth: number,
  panelCounts: Array<PanelCount>,
  wordCounts: Array<WordCount>,
  characters: Array<string>,
  onChange: (event: EditorChangeEvent) => void
}

type PanelCountsPlugin = {
  update: (counts: Array<PanelCount>) => void;
}

type WordCountsPlugin = {
  update: (counts: Array<WordCount>) => void;
}

export default class CodeMirrorComponent extends Component<Props> {
  rootRef = React.createRef<HTMLDivElement>();
  cm: CodeMirror.Editor | null = null;
  wordCounts: WordCountsPlugin | null = null;
  panelCounts: PanelCountsPlugin | null = null;

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
    const panelCountsChanged = prevProps.panelCounts !== this.props.panelCounts;
    const wordCountsChanged = prevProps.wordCounts !== this.props.wordCounts;

    // initial value
    const cm = this.getCodeMirrorInstance();
    if (valueChanged && !cm.getValue()) {
      cm.setValue(this.props.value);
    }

    if (panelCountsChanged) {
      this.updatePanelCounts(this.props.panelCounts);
    }

    if (wordCountsChanged) {
      this.updateWordCounts(this.props.wordCounts);
    }
  }

  getCodeMirrorInstance(): CodeMirror.Editor {
    if (this.cm == null) {
      throw new Error('cm is not set yet');
    }

    return this.cm;
  }

  updateWordCounts(counts: Array<WordCount>): void {
    if (this.wordCounts == null) {
      throw new Error('wordCounts is not initialized yet');
    }

    this.wordCounts.update(counts);
  }

  updatePanelCounts(counts: Array<PanelCount>): void {
    if (this.panelCounts == null) {
      throw new Error('panelCounts is not initialized yet?');
    }

    this.panelCounts.update(counts);
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
