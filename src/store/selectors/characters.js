import { createSelector } from 'reselect';
import * as types from '../../types';

export default function create(statsSelector) {
  return createSelector(
    statsSelector,
    stats => {
      const allSpeakers = stats
        .filter(stat => stat.type === types.SPREAD)
        .reduce((speakers, spread) => {
          return speakers.concat(spread.speakers);
        }, []);

      return [...new Set(allSpeakers)].sort();
    }
  );
}
