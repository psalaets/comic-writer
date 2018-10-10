import { connect } from 'react-redux';

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
  return {
    onSourceChange: source => {
      dispatch(changeSource(source));
      dispatch(saveScript(source));
    }
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;