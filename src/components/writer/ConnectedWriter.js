import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { statsSelector } from '../../store/selectors/stats';
import createCharactersSelector from '../../store/selectors/characters';

import {
  changeSource,
  saveScript
} from '../../store/actions';

import Writer from './Writer';

const charactersSelector = createCharactersSelector(statsSelector);

function mapStateToProps(state) {
  return {
    source: state.editor.source,
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
