import { connect } from 'react-redux';

import Editor from './Editor';
import { wrap } from '../../perf';
import { selectors, actions } from '../../script';

import { EditorChangeEvent } from '../types';
import { RootState, ThunkCompatibleDispatch } from '../../store/types';

const mapStateToProps = wrap('Editor [mapStateToProps]', (state: RootState) => {
  return {
    value: selectors.selectSource(state),
    panelCounts: selectors.selectPanelCounts(state),
    wordCounts: selectors.selectWordCounts(state),
    characters: selectors.selectSpeakers(state),
  };
});

function mapDispatchToProps(dispatch: ThunkCompatibleDispatch) {
  return {
    onChange(event: EditorChangeEvent) {
      dispatch(actions.changeSource(event.value, event.changedLines));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
