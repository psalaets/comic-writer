import { createSelector } from 'reselect';
import parse from '../../parser';
import { sourceSelector } from './source';

export const parseResultSelector = createSelector(
  sourceSelector,
  source => parse(source)
);
