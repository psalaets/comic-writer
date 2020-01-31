import { createSelector } from 'reselect';

import parseResultSelector from './parse-result';
import { extractStats } from '../../stats';

export default createSelector(
  parseResultSelector,
  parseResult => extractStats(parseResult)
);
