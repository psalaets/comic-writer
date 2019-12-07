import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { statsSelector } from '../../store/selectors/stats';
import charactersSelector from '../../store/selectors/characters';
import { sourceSelector } from '../../store/selectors/source';

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
  const debouncedSaveScript = debounce(source => dispatch(saveScript(source)), 1000);

  return {
    onSourceChange(event) {
      const {source, cursorLine} = event;

      dispatch(changeSource(source, cursorLine));
      debouncedSaveScript(source);
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
