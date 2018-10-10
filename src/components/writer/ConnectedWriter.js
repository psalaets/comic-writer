import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import {
  changeSource,
  saveScript
} from '../../store/actions';
import Writer from './Writer';

function mapStateToProps(state) {
  return {
    source: state.source,
    parseTree: state.parseTree
  };
}

function mapDispatchToProps(dispatch) {
  const debouncedSaveScript = debounce(source => dispatch(saveScript(source)), 1000);

  return {
    onSourceChange: source => {
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