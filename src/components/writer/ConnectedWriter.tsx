import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import statsSelector from '../../store/selectors/stats';
import charactersSelector from '../../store/selectors/characters';
import sourceSelector from '../../store/selectors/source';
import { changeSource } from '../../store/actions';
import { RootState } from '../../store/types';

import Writer, { SourceChangeEvent } from './Writer';

function mapStateToProps(state: RootState) {
  return {
    source: sourceSelector(state),
    stats: statsSelector(state),
    characters: charactersSelector(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onSourceChange(event: SourceChangeEvent) {
      dispatch(changeSource(event.source));
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
