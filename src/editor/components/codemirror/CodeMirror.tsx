import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import CodeMirror from 'codemirror';

import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/scroll/scrollpastend';

import 'codemirror/lib/codemirror.css';
import './CodeMirror.css';
import './theme.css';

import { EditorChangeEvent, EditorScrollEvent } from '../../types';
import { PanelCount, WordCount } from '../../../script/types';

import * as perf from '../../../perf';

import { createPreprocessor } from './preprocessor';
import { MODE, THEME } from './mode';
import {
  ID as WORD_COUNTS,
  create as createWordCounts
} from './gutters/word-counts';
import { create as createPanelCounts } from './panel-counts';
import { create as letteringSnippetCommand } from './lettering-snippet-command';
import { letteringBoldCommand } from './lettering-bold-command';
import { NO_TARGET_LINE } from '../../constants';

// The line this many pixels below viewport top is considered the "current" line
const TARGET_LINE_SCROLL_OFFSET = 90;

type Props = {
  value: string,
  editorWidth: number,
  /** When this changes, editor scrolls to the line */
  targetLine: number,
  panelCounts: Array<PanelCount>,
  wordCounts: Array<WordCount>,
  characters: Array<string>,
  onChange: (event: EditorChangeEvent) => void,
  onScroll: (event: EditorScrollEvent) => void,
}

export default class CodeMirrorComponent extends Component<Props> {
  rootRef = React.createRef<HTMLDivElement>();
  cm: CodeMirror.Editor | null = null;
  updateWordCounts = createWordCounts();
  updatePanelCounts = createPanelCounts();
  preprocessLines = createPreprocessor();

  render() {
    const styles = {
      maxWidth: `${this.props.editorWidth + 2}ex`,
    }
    return <div className="c-codemirror" style={styles} ref={this.rootRef} />;
  }

  componentDidUpdate(prevProps: Props) {
    const valueChanged = prevProps.value !== this.props.value;

    const cm = this.getCodeMirrorInstance();

    // set initial value
    if (valueChanged && !cm.getValue()) {
      cm.setValue(this.props.value);
    }

    if (this.props.targetLine !== prevProps.targetLine && this.props.targetLine !== NO_TARGET_LINE) {
      // scroll so target line is near the top
      const coords = cm.charCoords({ line: this.props.targetLine, ch: 0 }, 'local');
      cm.scrollTo(null, coords.bottom - TARGET_LINE_SCROLL_OFFSET);
    }

    if (this.props.panelCounts !== prevProps.panelCounts) {
      this.updatePanelCounts(cm, this.props.panelCounts);
    }

    if (this.props.wordCounts !== prevProps.wordCounts) {
      this.updateWordCounts(cm, this.props.wordCounts);
    }
  }

  getCodeMirrorInstance(): CodeMirror.Editor {
    if (this.cm == null) {
      throw new Error('cm is not set yet');
    }

    return this.cm;
  }

  getRootElement(): HTMLElement {
    if (this.rootRef.current == null) {
      throw new Error('root ref is not available yet');
    }

    return this.rootRef.current;
  }

  componentDidMount() {
    const getCharacterNames = () => this.props.characters;

    this.cm = CodeMirror(this.getRootElement(), {
      mode: MODE,
      theme: THEME,
      value: this.props.value,
      inputStyle: 'contenteditable',
      placeholder: 'Adventure starts here...',
      lineWrapping: true,
      scrollbarStyle: "null",
      scrollPastEnd: true,
      tabSize: 8,
      gutters: [WORD_COUNTS],
      extraKeys: {
        Tab: letteringSnippetCommand(getCharacterNames),
        'Shift-Tab'() {
          // no-op to prevent the CodeMirror default action: reverse indent
        },
        'Cmd-B': letteringBoldCommand,
        'Ctrl-B': letteringBoldCommand,
      }
    });

    this.cm.setSize('100%', '100%');

    this.cm.on('change', (cm, change) => {
      // This event listener is only for handling user changes, so ignore
      // changes from initial value being set and from the script preprocessor.
      if (change.origin === 'setValue' || change.origin === 'preprocessing') {
        return;
      }

      perf.start('change-event');

      // Grab cursor position *before* preprocessing because cursor might need
      // to be put back to its original position.
      const cursor = cm.getCursor();

      // preprocess script lines
      const oldLines = cm.getValue().split(/\n/);
      const newLines = this.preprocessLines(
        oldLines,
        cursor.line,
        change.from.line,
        change.to.line
      );

      // Even though this doesn't use newLines, this bailout needs to be after
      // the preprocessor has seen the oldLines because the preprocessor is
      // stateful. If it doesnt see every change, the next time it runs things
      // will be weird.
      if (change.origin === 'undo' || change.origin === 'redo') {
        this.emitUndoRedoChange(oldLines);

        perf.end('change-event');
        return;
      }

      perf.start('apply-preprocessing-changes');

      // apply changes from preprocessor, if any
      this.getCodeMirrorInstance().operation(() => {
        let cursorLineLengthDelta = 0;

        // Apply changes from the bottom up to make things work nicer with the
        // weird way we replaceRange many times and debounce undo/redo changes.
        const length = Math.max(oldLines.length, newLines.length);
        for (let index = length - 1; index >= 0; index--) {
          const newLine = newLines[index] || '';
          const oldLine = oldLines[index] || '';

          if (newLine !== oldLine) {
            const from = { line: index, ch: 0 };
            const to = { line: index, ch: oldLine.length };

            cm.replaceRange(newLine, from, to, 'preprocessing');

            if (index === cursor.line) {
              cursorLineLengthDelta = newLine.length - oldLine.length;
            }
          }
        }

        // Line replacements may cause cursor to move so put it back
        if (!cm.somethingSelected()) {
          cm.setCursor({
            line: cursor.line,
            ch: cursor.ch + Math.max(cursorLineLengthDelta, 0)
          });
        }
      });

      perf.end('apply-preprocessing-changes');

      // Only the preprocessed script lines go to the outside world
      this.emitChange(newLines);

      perf.end('change-event');
    });

    this.cm.on('scroll', cm => {
      this.emitScroll(cm);
    });
  }

  emitScroll = throttle((cm: CodeMirror.Editor) => {
    const scrollInfo = cm.getScrollInfo();

    this.props.onScroll({
      topLine: cm.lineAtHeight(scrollInfo.top + TARGET_LINE_SCROLL_OFFSET, 'local')
    });
  }, 100);

  /**
   * Emit a change event that happened because of an undo or redo by the user.
   *
   * ## More detail
   *
   * When applying changes from the script preprocessor, an update from one run
   * of the preprocessor is actually an operation containing n updates to the
   * CodeMirror Editor (1 update per line changed by preprocessor).
   *
   * Because of that, a single undo will trigger n change events from CM. So
   * undo and redo change event use this special method so we don't spam the
   * reducers/selectors with change events.
   *
   * Since undo/redo is relatively rare, this isn't 100% vital. If this causes
   * issues later it can probably be removed without too much harm.
   */
  emitUndoRedoChange = debounce(lines => {
    this.emitChange(lines);
  }, 100);

  /**
   * Emit a change event that happened due to an edit by the user.
   */
  emitChange(lines: Array<string>): void {
    this.props.onChange({
      lines
    });
  }
}
