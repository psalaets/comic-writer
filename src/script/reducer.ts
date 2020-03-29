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
  const spreads = lines.consumeAllSpreads();

  const updatedSpreads: Array<RawSpreadChunk> = [];

  for (let i = 0; i < Math.max(currentState.spreads.length, spreads.length); i++) {
    const updated = update(currentState.spreads[i], spreads[i]);

    if (updated != null) {
      updatedSpreads.push(updated);
    }
  }

  return {
    ...currentState,
    preSpread: updatePreSpread(currentState.preSpread, preSpread),
    spreads: updatedSpreads,
    source: lines.toString()
  };
}

function updatePreSpread(oldLines: Array<string>, newLines: Array<string>): Array<string> {
  return allLinesEqual(oldLines, newLines)
    ? oldLines
    : newLines;
}

function update(
  oldSpread: RawSpreadChunk,
  newSpread: RawSpreadChunk
): RawSpreadChunk | null {
  if (oldSpread == null) return newSpread;
  if (newSpread == null) return null;

  if (oldSpread.spread !== newSpread.spread) {
    return newSpread;
  }

  return allLinesEqual(oldSpread.children, newSpread.children)
    ? oldSpread
    : newSpread;
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
