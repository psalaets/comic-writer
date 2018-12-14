import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { statsSelector } from '../../store/selectors/stats';

import {
  changeSource,
  saveScript
} from '../../store/actions';

import Writer from './Writer';

function mapStateToProps(state) {
  return {
    source: state.editor.source,
    stats: statsSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  const debouncedSaveScript = debounce(source => dispatch(saveScript(source)), 1000);

  return {
    onSourceChange(event) {
      const {source} = event;

      dispatch(changeSource(source));
      debouncedSaveScript(source);
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;
