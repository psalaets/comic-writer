import { createSelector } from 'reselect';
import { createArraySelector } from 'reselect-map';

import { RawSpreadChunk } from '../parser/types';
import { parsePreSpreadLines, parseRawSpreadChunk } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import {
  ScriptState,
  WordCount,
  LocatedSpreadChunk
} from './types';
import * as parts from '../comic-part-types';
import * as iterators from './iterator';
import { memoizeResult } from './memoize-result';

function selectScriptState(state: RootState): ScriptState {
  return state.script;
}

export function selectSource(state: RootState): string {
  return selectScriptState(state).source;
}

function selectPreSpreadLines(state: RootState): Array<string> {
  return selectScriptState(state).preSpread;
}

function selectRawSpreadChunks(state: RootState): Array<RawSpreadChunk> {
  return selectScriptState(state).spreads;
}

export const selectParsedSpreadChunks = wrap('selectParsedSpreadChunks', createArraySelector(
  selectRawSpreadChunks,
  rawChunk => parseRawSpreadChunk(rawChunk)
));

export const selectPreSpreadNodes = wrap('selectPreSpreadNodes', createSelector(
  selectPreSpreadLines,
  preSpreadLines => parsePreSpreadLines(preSpreadLines)
));

const selectPreSpreadLineCount = createSelector(
  selectPreSpreadLines,
  lines => lines.length
);

const selectLocatedSpreadChunks = wrap('selectLocatedSpreadChunks', createSelector(
  [selectPreSpreadLineCount, selectParsedSpreadChunks],
  (preSpreadLineCount, parsedChunks): Array<LocatedSpreadChunk> => {
    let lineNumber = preSpreadLineCount;
    let pageNumber = 1;

    return parsedChunks.map(chunk => {
      const spread = chunk.spread;

      // using Object.assign instead of object spread here because I can't
      // figure out how to get rid of the object spread polyfill
      const locatedSpread = Object.assign(
        {
          lineNumber: lineNumber++,
          startPage: pageNumber,
          endPage: pageNumber + (spread.pageCount - 1)
        },
        spread
      );

      // advance page number to next available page
      pageNumber += spread.pageCount;

      const locatedChildren = chunk.children
        .map(child => {
          // using Object.assign instead of object spread here because I can't
          // figure out how to get rid of the object spread polyfill
          return Object.assign({ lineNumber: lineNumber++ }, child);
        });

      return {
        spread: locatedSpread,
        children: locatedChildren
      };
    });
  }
));

const selectLocatedSpreads = wrap('selectLocatedSpreads', createSelector(
  selectLocatedSpreadChunks,
  locatedChunks => {
    return [...iterators.onlySpreads(locatedChunks)];
  }
));

export const selectSpeakers = wrap('selectSpeakers', createSelector(
  selectLocatedSpreads,
  spreads => {
    const speakers = new Set<string>();

    for (const spread of spreads) {
      for (const speaker of spread.speakers) {
        speakers.add(speaker.toUpperCase());
      }
    }

    return [...speakers].sort();
  }
));

export const selectPanelCounts = wrap('selectPanelCounts', createSelector(
  selectLocatedSpreads,
  memoizeResult(spreads => {
    return spreads
      .filter(spread => spread.panelCount > 0)
      .map(spread => ({
        lineNumber: spread.lineNumber,
        count: spread.panelCount
      }));
  }, (oldCounts, newCounts) => {
    if (oldCounts == null) return newCounts == null;

    if (oldCounts.length !== newCounts.length) {
      return false;
    }

    for (let i = 0; i < oldCounts.length; i++) {
      const oldCount = oldCounts[i];
      const newCount = newCounts[i];

      if (oldCount.count !== newCount.count) return false;
      if (oldCount.lineNumber !== newCount.lineNumber) return false;
    }

    return true;
  })
));

export const selectWordCounts = wrap('selectWordCounts', createSelector(
  selectLocatedSpreadChunks,
  memoizeResult(locatedChunks => {
    const wordCounts: Array<WordCount> = [];

    for (const node of iterators.spreadsAndChildren(locatedChunks)) {
      if (node.type === parts.DIALOGUE || node.type === parts.CAPTION) {
        wordCounts.push({
          count: node.wordCount,
          lineNumber: node.lineNumber,
          isSpread: false
        });
      } else if (node.type === parts.PANEL || node.type === parts.SPREAD) {
        wordCounts.push({
          count: node.dialogueWordCount + node.captionWordCount,
          lineNumber: node.lineNumber,
          isSpread: node.type === parts.SPREAD
        });
      }
    }

    return wordCounts;
  }, (oldCounts, newCounts) => {
    if (oldCounts == null) return newCounts == null;

    if (oldCounts.length !== newCounts.length) {
      return false;
    }

    for (let i = 0; i < oldCounts.length; i++) {
      const oldCount = oldCounts[i];
      const newCount = newCounts[i];

      if (oldCount.count !== newCount.count) return false;
      if (oldCount.lineNumber !== newCount.lineNumber) return false;
      if (oldCount.isSpread !== newCount.isSpread) return false;
    }

    return true;
  })
));
