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
  preSpreadLines: [],
  spreadLines: []
};

export default wrap('script-reducer', reducer);

function reducer(state = initialState, action: ScriptActionTypes): ScriptState {
  switch (action.type) {
    case LOAD_SCRIPT_COMPLETED: {
      return {
        ...state,
        source: action.payload.source
      };
    }
    case CHANGE_SOURCE: {
      const lines = new LineStream(action.payload.source);
      const preSpread = lines.consumeUntilSpreadStart();

      const chunks: Array<SpreadLines> = [];
      let linesSeen = preSpread.length;

      while (lines.hasMoreLines()) {
        const linesOfSpread = lines.consumeNextSpread();

        chunks.push({
          lines: linesOfSpread,
          fromLine: linesSeen,
          upToLine: linesSeen + linesOfSpread.length
        });

        linesSeen += linesOfSpread.length;
      }

      return {
        ...state,
        preSpreadLines: preSpread,
        spreadLines: chunks,
        source: action.payload.source
      };
    }
    default:
      return state;
  }
}

