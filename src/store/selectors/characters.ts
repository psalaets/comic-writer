import { createSelector } from 'reselect';
import { isSpreadStats } from '../../stats/types';
import statsSelector from './stats';

export default createSelector(
  statsSelector,
  stats => {
    const allSpeakers = stats
      .filter(isSpreadStats)
      .reduce < Array<string>>((speakers, spreadStats) => {
        return speakers.concat(spreadStats.speakers);
      }, []);

    return [...new Set(allSpeakers)].sort();
  }
);
