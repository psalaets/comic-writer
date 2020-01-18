import { createSelector } from 'reselect';
import { ComicStats, SpreadStats, isSpreadStats } from './stat-types';
import statsSelector from './stats';

export default createSelector(
  statsSelector,
  stats => {
    const allSpeakers = stats
      .filter(isSpreadStats)
      .reduce<string[]>((speakers, spreadStats) => {
        return speakers.concat(spreadStats.speakers);
      }, []);

    return [...new Set(allSpeakers)].sort();
  }
);
