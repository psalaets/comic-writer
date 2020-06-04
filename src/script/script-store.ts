import debounce from 'lodash/debounce';
import {
  observable,
  computed,
  action,
  runInAction,
} from 'mobx';

import localstorage from '../localstorage';

import {
  PreSpread,
  SpreadContent,
  Spread,
  SpreadChild,
} from '../parser/types';
import { LineStream } from './line-stream';
import { parsePreSpreadLines, parseSpreadContent } from '../parser';
import * as iterators from './iterator';
import * as parts from '../comic-part-types';

import {
  LocatedSpread,
  PanelCount,
  WordCount,
  LocatedSpreadChild
} from './types';
import * as deepEquals from './deep-equals';

const SCRIPT_STORAGE_KEY = 'comic-writer.script';

export type ScriptStore = ReturnType<typeof createStore>;

export function createStore() {
  const store = observable({
    initialValue: '',
    source: '',
    preSpread: [] as Array<string>,
    spreads: [] as Array<SpreadContent>,

    // private
    _spreadParser: createMemoizedMapper<SpreadContent, Spread<SpreadChild>>(
      rawChunk => parseSpreadContent(rawChunk)
    ),

    // computed values
    get parsedSpreads(): Array<Spread<SpreadChild>> {
      return this._spreadParser(this.spreads);
    },

    get preSpreadNodes(): Array<PreSpread> {
      return parsePreSpreadLines(this.preSpread);
    },

    get preSpreadLineCount(): number {
      return this.preSpread.length;
    },

    get locatedSpreads(): Array<LocatedSpread> {
      // This function uses Object.assign instead of object spread because the
      // object spread polyfill is slow and I can't figure out how to disable it

      let lineNumber = this.preSpreadLineCount;
      let pageNumber = 1;

      return this.parsedSpreads.map(spread => {
        // create located spread
        const locatedSpread = Object.assign(
          {
            lineNumber: lineNumber++,
            startPage: pageNumber,
            endPage: pageNumber + (spread.pageCount - 1),
            label: labelSpread(pageNumber, pageNumber + (spread.pageCount - 1)),
          },
          spread,
          {
            children: [] as Array<LocatedSpreadChild>
          }
        );

        // advance page number to next available page
        pageNumber += spread.pageCount;

        locatedSpread.children = spread.children
          .map(child => {
            if (child.type === parts.PANEL) {
              // create located panel
              return Object.assign(
                {
                  lineNumber: lineNumber++,
                  label: labelPanel(child.number)
                },
                child,
                {
                  // create located panel children
                  children: child.children.map(panelChild => {
                    return Object.assign({ lineNumber: lineNumber++ }, panelChild);
                  })
                }
              );
            } else {
              // create located spread children (every child type except panel)
              return Object.assign({ lineNumber: lineNumber++ }, child);
            }
          });

        return locatedSpread;
      });
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

      for (const node of iterators.spreadsAndChildren(this.locatedSpreads)) {
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

      this._updateSource(lines.toString());
      this._updatePreSpread(this.preSpread, incomingPreSpread);
      this._updateSpreads(this.spreads, incomingSpreads);
    },

    loadScript() {
      return localstorage.get<string>(SCRIPT_STORAGE_KEY)
        .then(source => {
          runInAction(() => {
            if (source != null) {
              this.updateScript(source);
            }
          });
        });
    },

    // private helpers
    _updateSource(incoming: string): void {
      if (!this.source) {
        this.initialValue = incoming;
      }

      this.source = incoming;
      this._saveScript(incoming);
    },

    _saveScript: debounce((source: string) => {
      return localstorage.set<string>(SCRIPT_STORAGE_KEY, source);
    }, 1000),

    _updatePreSpread(current: Array<string>, incoming: Array<string>): void {
      this.preSpread = deepEquals.strings(current, incoming)
        ? current
        : incoming;
    },

    _updateSpreads(current: Array<SpreadContent>, incoming: Array<SpreadContent>): void {
      let changes = 0;
      const nextSpreads: Array<SpreadContent> = [];

      const length = Math.max(current.length, incoming.length);
      for (let i = 0; i < length; i++) {
        const currentSpread = current[i];
        const incomingSpread = incoming[i];

        let nextSpread;

        if (deepEquals.spreadContent(currentSpread, incomingSpread)) {
          nextSpread = currentSpread;
        } else {
          nextSpread = incomingSpread;
          changes += 1;
        }

        if (nextSpread) {
          nextSpreads.push(nextSpread);
        }
      }

      if (changes > 0) {
        this.spreads = nextSpreads;
      }
    }
  }, {
    source: observable,
    initialValue: observable,
    preSpread: observable.ref,
    spreads: observable.ref,

    parsedSpreads: computed,
    preSpreadNodes: computed,
    preSpreadLineCount: computed,
    locatedSpreads: computed,
    speakers: computed({
      equals: deepEquals.strings
    }),
    panelCounts: computed({
      equals: deepEquals.panelCounts,
    }),
    wordCounts: computed({
      equals: deepEquals.wordCounts
    }),

    updateScript: action,
    loadScript: action,
  });

  return store;
}

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

function labelSpread(startPage: number, endPage: number): string {
  return startPage === endPage
    ? `Page ${startPage}`
    : `Pages ${startPage}-${endPage}`;
}

function labelPanel(number: number): string {
  return `Panel ${number}`;
}
