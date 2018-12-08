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
    wordCounts: wordCounts(state.editor.source)
  };
}

function wordCounts(source) {
  const counts = [];
  const addCount = (type, lineNumber, count) => counts.push({type, lineNumber, count});

  visit(parse(source), {
    enterPage(page) {
      addCount(types.PAGE, page.startingLine, page.dialogueWordCount + page.captionWordCount);
    },
    enterPanel(panel) {
      addCount(types.PANEL, panel.startingLine, panel.dialogueWordCount + panel.captionWordCount);
    },
    enterDialogue(dialogue) {
      addCount(types.DIALOGUE, dialogue.startingLine, dialogue.wordCount);
    },
    enterCaption(caption) {
      addCount(types.CAPTION, caption.startingLine, caption.wordCount);
    }
  });

  return counts;
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
