import { connect } from 'react-redux';

import { changeSource } from '../../store/actions';
import Writer from './Writer';

function mapStateToProps(state) {
  return {
    parseTree: state.parseTree
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSourceChange: source => dispatch(changeSource(source))
  };
}

const ConnectedWriter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Writer);

export default ConnectedWriter;