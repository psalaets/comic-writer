import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { statsSelector } from '../../store/selectors/stats';
import { cursorSelector } from '../../store/selectors/cursor';

import {
  changeSource,
  saveScript
} from '../../store/actions';

import Writer from './Writer';

function mapStateToProps(state) {
  return {
    cursor: cursorSelector(state),
    source: state.editor.source,
    stats: statsSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  const debouncedSaveScript = debounce(source => dispatch(saveScript(source)), 1000);

  return {
    onSourceChange(event) {
      const {source, cursor} = event;

      dispatch(changeSource(source, cursor));
      debouncedSaveScript(source);
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
