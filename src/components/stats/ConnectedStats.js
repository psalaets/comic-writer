import { connect } from 'react-redux';

import { statsSelector } from '../../store/selectors/stats';

import Stats from './Stats';

function mapStateToProps(state) {
  return {
    stats: statsSelector(state).sort((a, b) => a.lineNumber - b.lineNumber)
  };
}

const ConnectedStats = connect(
  mapStateToProps
)(Stats);

export default ConnectedStats;
