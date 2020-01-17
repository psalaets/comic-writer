import { createSelector } from 'reselect';
import { SPREAD } from '../../comic-part-names';
import statsSelector from './stats';

import { ComicStats, SpreadStats } from './stat-types';

export default createSelector(
  statsSelector,
  stats => {
    const allSpeakers = stats
      .filter((stat: ComicStats) => stat.type === SPREAD)
      .reduce<string[]>((speakers, stats) => {
        const spreadStats = stats as SpreadStats;
        return speakers.concat(spreadStats.speakers);
      }, []);

    return [...new Set(allSpeakers)].sort();
  }
);
