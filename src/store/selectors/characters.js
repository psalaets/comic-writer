import { createSelector } from 'reselect';
import * as types from '../../types';

export default function create(statsSelector) {
  return createSelector(
    statsSelector,
    stats => {
      const allSpeakers = stats
        .filter(stat => stat.type === types.PAGE)
        .reduce((comicSpeakers, page) => {
          return comicSpeakers.concat(page.speakers);
        }, []);

      return [...new Set(allSpeakers)].sort();
    }
  );
}
