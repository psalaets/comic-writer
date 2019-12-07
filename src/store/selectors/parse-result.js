import { createSelector } from 'reselect';
import parse from '../../parser';
import sourceSelector from './source';

export default createSelector(
  sourceSelector,
  source => parse(source)
);
