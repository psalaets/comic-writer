import { createSelector } from 'reselect';
import parse from '../../parser';
import sourceSelector from './source';
import { RootState } from '../types';

export default createSelector(
  sourceSelector,
  (source: string) => parse(source)
);
