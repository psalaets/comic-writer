import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import states from './states';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineSimpleMode(MODE, states);