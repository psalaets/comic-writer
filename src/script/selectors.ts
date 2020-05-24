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

export const selectPreSpreadNodes = createSelector(
  selectPreSpreadLines,
  wrap('preSpreadNodesCombiner', function preSpreadNodesCombiner(preSpreadLines) {
    return parsePreSpreadLines(preSpreadLines);
  })
);

const selectPreSpreadLineCount = createSelector(
  selectPreSpreadLines,
  lines => lines.length
);

const selectLocatedSpreadChunks = createSelector(
  [selectPreSpreadLineCount, selectParsedSpreadChunks],
  wrap('locatedSpreadChunksCombiner', function locatedSpreadChunksCombiner(preSpreadLineCount, parsedChunks): Array<LocatedSpreadChunk> {
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
  })
);

const selectLocatedSpreads = createSelector(
  selectLocatedSpreadChunks,
  wrap('locatedSpreadsCombiner', function locatedSpreadsCombiner(locatedChunks) {
    return [...iterators.onlySpreads(locatedChunks)];
  })
);

export const selectSpeakers = createSelector(
  selectLocatedSpreads,
  memoizeResult(wrap('speakersCombiner', function speakersCombiner(spreads) {
    const speakers = new Set<string>();

    for (const spread of spreads) {
      for (const speaker of spread.speakers) {
        speakers.add(speaker.toUpperCase());
      }
    }

    return [...speakers].sort();
  }), (oldSpeakers, newSpeakers) => {
    if (oldSpeakers == null) return false;
    if (oldSpeakers.length !== newSpeakers.length) return false;

    for (let i = 0; i < oldSpeakers.length; i++) {
      if (oldSpeakers[i] !== newSpeakers[i]) {
        return false;
      }
    }

    return true;
  })
);

export const selectPanelCounts = createSelector(
  selectLocatedSpreads,
  memoizeResult(wrap('panelCountsCombiner', function panelCountsCombiner(spreads) {
    return spreads
      .map(spread => ({
        lineNumber: spread.lineNumber,
        count: spread.panelCount
      }));
  }), (oldCounts, newCounts) => {
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
);

export const selectWordCounts = createSelector(
  selectLocatedSpreadChunks,
  memoizeResult(wrap('wordCountsCombiner', function wordCountsCombiner(locatedChunks) {
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
  }), (oldCounts, newCounts) => {
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
);
