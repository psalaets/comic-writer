import {
  SPREAD_REGEX,
  PANEL_REGEX,
  CAPTION_REGEX,
  SFX_REGEX,
  DIALOGUE_REGEX,
  METADATA_REGEX,
  PARAGRAPH_REGEX,
} from './regexes';

export function isSpread(line: string): boolean {
  return SPREAD_REGEX.test(line);
}

export function isPanel(line: string): boolean {
  return PANEL_REGEX.test(line);
}

export function isCaption(line: string): boolean {
  return CAPTION_REGEX.test(line);
}

export function isSfx(line: string): boolean {
  return SFX_REGEX.test(line);
}

export function isDialogue(line: string): boolean {
  return DIALOGUE_REGEX.test(line);
}

export function isMetadata(line: string): boolean {
  return METADATA_REGEX.test(line);
}

export function isParagraph(line: string): boolean {
  return PARAGRAPH_REGEX.test(line);
}

export function isBlank(line: string): boolean {
  return line.trim() === '';
}
