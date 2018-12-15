import CodeMirror from 'codemirror';

import createModeConfig from './mode-config';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

CodeMirror.defineMode(MODE, createModeConfig);
