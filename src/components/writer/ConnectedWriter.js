import { connect } from 'react-redux';

import statsSelector from '../../store/selectors/stats';
import charactersSelector from '../../store/selectors/characters';
import sourceSelector from '../../store/selectors/source';
import { changeSource } from '../../store/actions';

import Writer from './Writer';

function mapStateToProps(state) {
  return {
    source: sourceSelector(state),
    stats: statsSelector(state),
    characters: charactersSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSourceChange(event) {
      dispatch(changeSource(event.source));
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
