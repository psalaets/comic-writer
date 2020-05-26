import { observable, computed, action } from 'mobx';

import {
  ComicNode,
  RawSpreadChunk,
  ParsedSpreadChunk,
} from '../parser/types';
import { LineStream } from './line-stream';
import { parsePreSpreadLines, parseRawSpreadChunk } from '../parser';
import * as iterators from './iterator';
import * as parts from '../comic-part-types';

import {
  LocatedSpreadChunk,
  LocatedSpread,
  PanelCount,
  WordCount
} from './types';

export const scriptStore = observable({
  source: '',
  preSpread: [] as Array<string>,
  spreads: [] as Array<RawSpreadChunk>,

  // private
  _spreadParser: createMemoizedMapper<RawSpreadChunk, ParsedSpreadChunk>(
    rawChunk => parseRawSpreadChunk(rawChunk)
  ),

  // computed values
  get parsedSpreadChunks(): Array<ParsedSpreadChunk> {
    return this._spreadParser(this.spreads);
  },

  get preSpreadNodes(): Array<ComicNode> {
    return parsePreSpreadLines(this.preSpread);
  },

  get preSpreadLineCount(): number {
    return this.preSpread.length;
  },

  get locatedSpreadChunks(): Array<LocatedSpreadChunk> {
    let lineNumber = this.preSpreadLineCount;
    let pageNumber = 1;

    return this.parsedSpreadChunks.map(chunk => {
      const spread = chunk.spread;

      // using Object.assign instead of object spread here because I can't
      // figure out how to get rid of the object spread polyfill and the
      // polyfill is slow
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
          // figure out how to get rid of the object spread polyfill and the
          // polyfill is slow
          return Object.assign({ lineNumber: lineNumber++ }, child);
        });

      return {
        spread: locatedSpread,
        children: locatedChildren
      };
    });
  },

  get locatedSpreads(): Array<LocatedSpread> {
    return [...iterators.onlySpreads(this.locatedSpreadChunks)];
  },

  get speakers(): Array<string> {
    const speakers = new Set<string>();

    for (const spread of this.locatedSpreads) {
      for (const speaker of spread.speakers) {
        speakers.add(speaker.toUpperCase());
      }
    }

    return [...speakers].sort();
  },

  get panelCounts(): Array<PanelCount> {
    return this.locatedSpreads
      .map(spread => ({
        lineNumber: spread.lineNumber,
        count: spread.panelCount
      }));
  },

  get wordCounts(): Array<WordCount> {
    const wordCounts: Array<WordCount> = [];

    for (const node of iterators.spreadsAndChildren(this.locatedSpreadChunks)) {
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
  },

  // actions
  updateScript(script: Array<string> | string): void {
    const lines = Array.isArray(script)
      ? LineStream.fromLines(script)
      : LineStream.fromString(script);

    const incomingPreSpread = lines.consumeUntilSpreadStart();
    const incomingSpreads = lines.consumeAllSpreads();

    this.source = lines.toString();
    this._updatePreSpread(this.preSpread, incomingPreSpread);
    this._updateSpreads(this.spreads, incomingSpreads);
  },

  // private helpers
  _updatePreSpread(current: Array<string>, incoming: Array<string>): void {
    this.preSpread = allLinesEqual(current, incoming)
      ? current
      : incoming;
  },

  _updateSpreads(current: Array<RawSpreadChunk>, incoming: Array<RawSpreadChunk>): void {
    let changes = 0;
    const nextSpreads: Array<RawSpreadChunk> = [];

    for (let i = 0; i < incoming.length; i++) {
      const currentSpread = current[i];
      const incomingSpread = incoming[i];

      if (deepEquals(currentSpread, incomingSpread)) {
        nextSpreads.push(currentSpread);
      } else {
        nextSpreads.push(incomingSpread);
        changes += 1;
      }
    }

    if (changes > 0) {
      this.spreads = nextSpreads;
    }
  }
}, {
  source: observable,
  preSpread: observable.ref,
  spreads: observable.ref,

  parsedSpreadChunks: computed,
  preSpreadNodes: computed,
  preSpreadLineCount: computed,
  locatedSpreadChunks: computed,
  locatedSpreads: computed,
  speakers: computed.struct,
  panelCounts: computed.struct,
  wordCounts: computed.struct,

  updateScript: action
});

function createMemoizedMapper<InputType, ResultType>(update: (i: InputType) => ResultType) {
  let lastInputs: Array<InputType> = [];
  let lastResults: Array<ResultType> = [];

  return function memoizedMapper(inputs: Array<InputType>): Array<ResultType> {
    const nextResults: Array<ResultType> = [];

    for (let i = 0; i < inputs.length; i++) {
      const currentInput = inputs[i];
      const lastInput = lastInputs[i];

      const nextResult = currentInput === lastInput
        ? lastResults[i]
        : update(currentInput);

      nextResults.push(nextResult);
    }

    lastInputs = inputs;
    lastResults = nextResults;

    return nextResults;
  };
}

function deepEquals(
  current: RawSpreadChunk,
  incoming: RawSpreadChunk
): boolean {
  if (current == null) return incoming == null;
  if (incoming == null) return current == null;

  if (current.spread !== incoming.spread) {
    return false;
  }

  return allLinesEqual(current.children, incoming.children);
}

function allLinesEqual(oldLines: Array<string>, newLines: Array<string>): boolean {
  if (oldLines.length !== newLines.length) {
    return false;
  }

  // using old school for loop here for speed
  for (let i = 0; i < oldLines.length; i++) {
    if (oldLines[i] !== newLines[i]) {
      return false;
    }
  }

  return true;
}
