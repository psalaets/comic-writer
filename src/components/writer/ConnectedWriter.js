import { connect } from 'react-redux';
import debounce from 'lodash';

import customParser from '../../parser';

import {
  changeSource,
  saveScript
} from '../../store/actions';
import Writer from './Writer';

function mapStateToProps(state) {
  return {
    cursor: state.editor.cursor,
    source: state.editor.source,
    parseTree: customParser(state.editor.source)
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
