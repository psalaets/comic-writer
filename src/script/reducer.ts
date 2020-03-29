import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
  ScriptState,
} from './types';
import { wrap } from '../perf';
import { LineStream } from '../parser';
import { SpreadLines } from '../parser/types';

const initialState: ScriptState = {
  source: '',
  preSpread: [],
  spreads: []
};

export default wrap('script-reducer', reducer);

function reducer(state = initialState, action: ScriptActionTypes): ScriptState {
  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: // fall thru
    case CHANGE_SOURCE: {
      const lines = LineStream.fromString(action.payload.source);
      const preSpread = lines.consumeUntilSpreadStart();
      const spreads = lines.consumeAllSpreads();

      const updatedSpreads: Array<SpreadLines> = [];

      for (let i = 0; i < Math.max(state.spreads.length, spreads.length); i++) {
        const updated = update(state.spreads[i], spreads[i]);

        if (updated != null) {
          updatedSpreads.push(updated);
        }
      }

      return {
        ...state,
        preSpread: updatePreSpread(state.preSpread, preSpread),
        spreads: updatedSpreads,
        source: action.payload.source
      };
    }
    default:
      return state;
  }
}

function updatePreSpread(oldLines: Array<string>, newLines: Array<string>): Array<string> {
  return allLinesEqual(oldLines, newLines)
    ? oldLines
    : newLines;
}

function update(
  oldSpread: SpreadLines,
  newSpread: SpreadLines
): SpreadLines | null {
  if (oldSpread == null) return newSpread;
  if (newSpread == null) return null;

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
