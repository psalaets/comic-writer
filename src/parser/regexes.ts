/**
 * Matches spread lines.
 *
 * Has up to 3 capture groups
 * - Starting page number
 * - Ignored - 2nd group should be ignored for now
 * - Ending page number, if any
 */
export const SPREAD_REGEX = /^pages? (\d+)(-(\d+)?)?/i;
/**
 * Matches panel lines.
 *
 * Has 1 capture group
 * - Panel number
 */
export const PANEL_REGEX = /^panel (\d+)/i;
/**
 * Matches a caption line.
 *
 * Has up to 2 capture groups
 * - Modifier, if any
 * - The caption text
 */
export const CAPTION_REGEX = /^\tcaption ?(\(.+\))?: ?(.+)/i;
/**
 * Matches an sfx line.
 *
 * Has up to 2 capture groups
 * - Modifier, if any
 * - The sfx text
 */
export const SFX_REGEX = /^\tsfx ?(\(.+\))?: ?(.+)/i;
/**
 * Matches a dialogue line.
 *
 * Has up to 3 capture groups
 * - Speaker
 * - Modifier, if any
 * - The dialogue text
 */
export const DIALOGUE_REGEX = /^\t(.+?) ?(\(.+\))?: ?(.+)/;
/**
 * Matches a metadata line.
 *
 * Has 2 capture groups
 * - Name
 * - Value
 */
export const METADATA_REGEX = /^(.+): ?(.+)/;
/**
 * Matches a paragraph line. This matches everything except blank lines so it
 * should be checked only after all other more interesting matches have failed.
 *
 * No capture groups.
 */
export const PARAGRAPH_REGEX = /^.+/;
/**
 * Matches a bold section in lettering text.
 *
 * Has 1 capture group
 * - The bold text
 */
export const LETTERING_BOLD_REGEX = /\*\*(.+?)\*\*(?!\*)/;
