import CodeMirror from 'codemirror';

import createMode from './mode';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, createMode);
