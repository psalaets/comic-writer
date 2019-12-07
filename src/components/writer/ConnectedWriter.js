import { connect } from 'react-redux';

import statsSelector from '../../store/selectors/stats';
import charactersSelector from '../../store/selectors/characters';
import sourceSelector from '../../store/selectors/source';

import {
  changeSource,
  saveScript
} from '../../store/actions';

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
      const {source, cursorLine} = event;
      dispatch(changeSource(source, cursorLine));
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
