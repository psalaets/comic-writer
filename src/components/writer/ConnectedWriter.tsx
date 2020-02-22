import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { selectors, actions } from '../../editor';
import { RootState } from '../../store/types';

import Writer, { SourceChangeEvent } from './Writer';

function mapStateToProps(state: RootState) {
  return {
    source: selectors.getSource(state),
    panelCounts: selectors.getPanelCounts(state),
    wordCounts: selectors.getWordCounts(state),
    characters: selectors.getSpeakers(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSourceChange(event: SourceChangeEvent) {
      dispatch(actions.changeSource(event.source));
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
