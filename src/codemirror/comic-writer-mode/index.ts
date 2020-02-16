import CodeMirror from 'codemirror';

import createMode from './mode';

export const MODE = 'comic-writer';
export const THEME = 'comic-writer-light';

/**
 * Register the comic-writer mode with CodeMirror.
 *
 * A mode is a tokenizer for the syntax being typed into CodeMirror. It enables
 * syntax highlighting, token type identification and maybe other stuff.
 *
 * https://codemirror.net/doc/manual.html#modeapi
 */
CodeMirror.defineMode(MODE, createMode);
