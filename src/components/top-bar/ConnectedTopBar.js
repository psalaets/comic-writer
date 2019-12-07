import { connect } from 'react-redux';
import TopBar from './TopBar';

import parseResultSelector from '../../store/selectors/parse-result';

function mapStateToProps(state) {
  return {
    parseResult: parseResultSelector(state)
  };
}

function mapDispatchToProps() {
  return {};
}

const ConnectedTopBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);

export default ConnectedTopBar;
