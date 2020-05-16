import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
  ScriptState,
} from './types';
import { wrap } from '../perf';
import { LineStream } from './line-stream';
import { RawSpreadChunk } from '../parser/types';

const initialState: ScriptState = {
  source: '',
  preSpread: [],
  spreads: []
};

export default wrap('script-reducer', reducer);

function reducer(state = initialState, action: ScriptActionTypes): ScriptState {
  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      const lines = LineStream.fromString(action.payload.source);
      return computeNextState(state, lines);
    }
    case CHANGE_SOURCE: {
      const lines = LineStream.fromLines(action.payload.lines);
      return computeNextState(state, lines);
    }
    default:
      return state;
  }
}

function computeNextState(current: ScriptState, lines: LineStream): ScriptState {
  const incomingPreSpread = lines.consumeUntilSpreadStart();
  const incomingSpreads = lines.consumeAllSpreads();

  return {
    ...current,
    preSpread: computeNextPreSpread(current.preSpread, incomingPreSpread),
    spreads: computeNextSpreads(current.spreads, incomingSpreads),
    source: lines.toString()
  };
}

function computeNextPreSpread(current: Array<string>, incoming: Array<string>): Array<string> {
  return allLinesEqual(current, incoming)
    ? current
    : incoming;
}

function computeNextSpreads(current: Array<RawSpreadChunk>, incoming: Array<RawSpreadChunk>): Array<RawSpreadChunk> {
  const nextSpreads: Array<RawSpreadChunk> = [];

  for (let i = 0; i < Math.max(current.length, incoming.length); i++) {
    const nextSpread = pickNextSpread(current[i], incoming[i]);

    if (nextSpread != null) {
      nextSpreads.push(nextSpread);
    }
  }

  return nextSpreads;
}

function pickNextSpread(
  current: RawSpreadChunk,
  incoming: RawSpreadChunk
): RawSpreadChunk | null {
  if (current == null) return incoming;
  if (incoming == null) return null;

  if (current.spread !== incoming.spread) {
    return incoming;
  }

  return allLinesEqual(current.children, incoming.children)
    ? current
    : incoming;
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
