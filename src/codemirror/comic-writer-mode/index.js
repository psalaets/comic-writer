import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';
import states from './states';

CodeMirror.defineSimpleMode('comic-writer', states);