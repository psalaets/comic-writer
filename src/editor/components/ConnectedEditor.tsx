import { connect } from 'react-redux';

import Editor from './Editor';
import { wrap } from '../../perf';
import { selectors, actions } from '../../script';

import { EditorChangeEvent } from '../types';
import { RootState, ThunkCompatibleDispatch } from '../../store/types';

const mapStateToProps = wrap('Editor [mapStateToProps]', function makeMapState() {
  let initialValue: string | null = null;

  return function mapState(state: RootState) {
    if (!initialValue) {
      initialValue = selectors.selectSource(state);
    }

    return {
      value: initialValue,
      panelCounts: selectors.selectPanelCounts(state),
      wordCounts: selectors.selectWordCounts(state),
      characters: selectors.selectSpeakers(state),
    };
  }
});

function mapDispatchToProps(dispatch: ThunkCompatibleDispatch) {
  return {
    onChange(event: EditorChangeEvent) {
      dispatch(actions.changeSource(event.lines));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
