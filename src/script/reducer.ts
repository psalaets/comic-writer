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

function computeNextState(currentState: ScriptState, lines: LineStream): ScriptState {
  const preSpread = lines.consumeUntilSpreadStart();
  const incomingChunks = lines.consumeAllSpreads();

  const currentChunks = currentState.spreads;
  const nextChunks: Array<RawSpreadChunk> = [];

  for (let i = 0; i < Math.max(currentChunks.length, incomingChunks.length); i++) {
    const updated = updateChunk(currentChunks[i], incomingChunks[i]);

    if (updated != null) {
      nextChunks.push(updated);
    }
  }

  return {
    ...currentState,
    preSpread: updatePreSpread(currentState.preSpread, preSpread),
    spreads: nextChunks,
    source: lines.toString()
  };
}

function updatePreSpread(oldLines: Array<string>, newLines: Array<string>): Array<string> {
  return allLinesEqual(oldLines, newLines)
    ? oldLines
    : newLines;
}

function updateChunk(
  currentChunk: RawSpreadChunk,
  incomingChunk: RawSpreadChunk
): RawSpreadChunk | null {
  if (currentChunk == null) return incomingChunk;
  if (incomingChunk == null) return null;

  if (currentChunk.spread !== incomingChunk.spread) {
    return incomingChunk;
  }

  return allLinesEqual(currentChunk.children, incomingChunk.children)
    ? currentChunk
    : incomingChunk;
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
