import { connect } from 'react-redux';
import { debounce } from 'lodash';

import parse from '../../parser';
import visit from '../../parser/visit';
import * as types from '../../types';

import {
  changeSource,
  saveScript
} from '../../store/actions';
import Writer from './Writer';

function mapStateToProps(state) {
  return {
    cursor: state.editor.cursor,
    source: state.editor.source,
    stats: parseStats(state.editor.source)
  };
}

function parseStats(source) {
  const stats = [];
  let panelsSeen = 0;

  visit(parse(source), {
    enterPage(page) {
      panelsSeen = 0;
    },
    exitPage(page) {
      stats.push({
        type: types.PAGE,
        lineNumber: page.startingLine,
        wordCount: page.dialogueWordCount + page.captionWordCount,
        panelCount: panelsSeen
      });
    },
    enterPanel(panel) {
      panelsSeen += 1;

      stats.push({
        type: types.PANEL,
        lineNumber: panel.startingLine,
        wordCount: panel.dialogueWordCount + panel.captionWordCount
      });
    },
    enterDialogue(dialogue) {
      stats.push({
        type: types.DIALOGUE,
        lineNumber: dialogue.startingLine,
        wordCount: dialogue.wordCount
      });
    },
    enterCaption(caption) {
      stats.push({
        type: types.CAPTION,
        lineNumber: caption.startingLine,
        wordCount: caption.wordCount
      });
    }
  });

  return stats;
}

function mapDispatchToProps(dispatch) {
  const debouncedSaveScript = debounce(source => dispatch(saveScript(source)), 1000);

  return {
    onSourceChange(event) {
      const {source, cursor} = event;

      dispatch(changeSource(source, cursor));
      debouncedSaveScript(source);
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
