import { connect } from 'react-redux';
import TopBar from './TopBar';
import { RootState } from '../../store/types';

function mapStateToProps(state: RootState) {
  return {
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
