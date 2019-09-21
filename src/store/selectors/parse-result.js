import { createSelector } from 'reselect';
import parse from '../../parser';

const sourceSelector = state => state.editor.source;

export const parseResultSelector = createSelector(
  sourceSelector,
  source => parse(source)
);
