import { connect } from 'react-redux';
import TopBar from './TopBar';
import { RootState } from '../../store/types';

import parseResultSelector from '../../store/selectors/parse-result';

function mapStateToProps(state: RootState) {
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
