// names of the various parts of a comic script

export const SPREAD = 'spread';
export const PANEL = 'panel';
export const PARAGRAPH = 'paragraph';
export const CAPTION = 'caption';
export const DIALOGUE = 'dialogue';
export const SFX = 'sfx';
export const TEXT = 'text';
export const LETTERING_BOLD = 'lettering-bold';
export const METADATA = 'metadata';
export const BLANK = 'blank';

export type COMIC_NODE = typeof SPREAD
  | typeof PANEL
  | typeof PARAGRAPH
  | typeof CAPTION
  | typeof DIALOGUE
  | typeof SFX
  | typeof METADATA
  | typeof BLANK;
