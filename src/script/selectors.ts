import { createSelector } from 'reselect';
import { createArraySelector } from 'reselect-map';

import { Dialogue, RawSpreadChunk } from '../parser/types';
import { parsePreSpreadLines, parseSpreadLines as parseRawSpreadChunk } from '../parser';

import { wrap } from '../perf';

import { RootState } from '../store/types';
import {
  ScriptState,
  PanelCount,
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

const selectDialogues = wrap('selectDialogues', createSelector(
  selectParsedSpreadChunks,
  parsedChunks => {
    const dialogues: Array<Dialogue> = [];

    for (const node of iterators.spreadsAndChildren(parsedChunks)) {
      if (node.type === parts.DIALOGUE) {
        dialogues.push(node);
      }
    }

    return dialogues;
  }
));

export const selectSpeakers = wrap('selectSpeakers', createSelector(
  selectDialogues,
  dialogues => {
    const speakers = dialogues
      .map(dialogue => dialogue.speaker.toUpperCase());

    return dedupe(speakers).sort();
  }
));


function dedupe(speakers: Array<string>): Array<string> {
  return [...new Set(speakers)];
}

export const selectPanelCounts = createSelector(
  selectLocatedSpreadChunks,
  memoizeResult(locatedChunks => {
    const newCounts: Array<PanelCount> = [];

    for (const spread of iterators.onlySpreads(locatedChunks)) {
      if (spread.panelCount > 0) {
        newCounts.push({
          lineNumber: spread.lineNumber,
          count: spread.panelCount
        });
      }
    }

    return newCounts;
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
);

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
