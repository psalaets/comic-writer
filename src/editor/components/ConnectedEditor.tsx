import { connect } from 'react-redux';

import Editor from './Editor';

import { selectors, actions } from '../../script';

import { EditorChangeEvent } from '../types';
import { RootState, ThunkCompatibleDispatch } from '../../store/types';

function mapStateToProps(state: RootState) {
  return {
    value: selectors.getSource(state),
    panelCounts: selectors.getPanelCounts(state),
    wordCounts: selectors.getWordCounts(state),
    characters: selectors.getSpeakers(state),
  };
}

function mapDispatchToProps(dispatch: ThunkCompatibleDispatch) {
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