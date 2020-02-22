import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Editor from './Editor';

import { selectors, actions } from '../../editor';

import { EditorChangeEvent } from '../types';
import { RootState } from '../../store/types';

function mapStateToProps(state: RootState) {
  return {
    value: selectors.getSource(state),
    panelCounts: selectors.getPanelCounts(state),
    wordCounts: selectors.getWordCounts(state),
    characters: selectors.getSpeakers(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onChange(event: EditorChangeEvent) {
      dispatch(actions.changeSource(event.value));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
