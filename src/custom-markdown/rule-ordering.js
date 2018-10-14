// These are all negative to put them before all of the simple-markdown default
// rules. Rules are checked by ascending order.

// caption and sfx must be before dialogue, otherwise we'll have characters
// named sfx and caption saying stuff
export const CAPTION = -10;
export const SFX = -9;
export const DIALOGUE = -8;

// metadata should be after all types of lettering
export const METADATA = -7;

export const LETTERING_BOLD = -6;

export const PAGE = -5;
export const PANEL = -4;