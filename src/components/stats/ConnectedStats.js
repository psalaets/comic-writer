import { connect } from 'react-redux';

import statsSelector from '../../store/selectors/stats';

import PageCount from './PageCount'
import DialougeLength from './DialougeLength'
import PageHistogram from './PageHistogram'

function mapStateToProps(state) {
  return {
    stats: statsSelector(state).sort((a, b) => a.lineNumber - b.lineNumber)
  };
}

const ConnectedStats = {
  PageCount: connect(mapStateToProps)(PageCount),
  DialougeLength: connect(mapStateToProps)(DialougeLength),
  PageHistogram: connect(mapStateToProps)(PageHistogram)
};

export default ConnectedStats
