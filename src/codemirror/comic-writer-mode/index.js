import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import states from './states';

export const NAME = 'comic-writer';

CodeMirror.defineSimpleMode(NAME, states);