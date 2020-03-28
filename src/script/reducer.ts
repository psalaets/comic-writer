import {
  CHANGE_SOURCE,
  LOAD_SCRIPT_COMPLETED,
  ScriptActionTypes,
  ScriptState,
  SpreadLines
} from './types';
import { wrap } from '../perf';
import { LineStream } from '../parser';

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

      const spreads: Array<SpreadLines> = [];
      while (lines.hasMoreLines()) {
        spreads.push({
          lines: lines.consumeNextSpread()
        });
      }

      const updatedSpreads: Array<SpreadLines | null> = [];
      for (let i = 0; i < Math.max(state.spreads.length, spreads.length); i++) {
        updatedSpreads.push(update(state.spreads[i], spreads[i]));
      }

      return {
        ...state,
        preSpread: updatePreSpread(state.preSpread, preSpread),
        spreads: updatedSpreads.filter(chunk => chunk != null) as Array<SpreadLines>,
        source: action.payload.source
      };
    }
    default:
      return state;
  }
}

function updatePreSpread(oldLines: Array<string>, newLines: Array<string>): Array<string> {
  if (oldLines.length !== newLines.length) {
    return newLines;
  }

  const allLinesEqual = oldLines
    .every((line, index) => {
      return line === newLines[index];
    });

  return allLinesEqual ? oldLines : newLines;
}

function update(
  oldSpread: SpreadLines,
  newSpread: SpreadLines
): SpreadLines | null {
  if (oldSpread == null) return newSpread;
  if (newSpread == null) return null;

  if (oldSpread.lines.length !== newSpread.lines.length) {
    return newSpread;
  }

  const allLinesEqual = oldSpread.lines
    .every((oldLine, index) => {
      return oldLine === newSpread.lines[index];
    });

  return allLinesEqual ? oldSpread : newSpread;
}
