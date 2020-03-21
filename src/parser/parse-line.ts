import * as parts from '../comic-part-types';
import * as classifiers from './line-classifiers';
import {
  Spread,
  Panel,
  Paragraph,
  Metadata,
  Dialogue,
  Caption,
  Sfx,
  SpreadChild,
  PanelChild,
  LetteringContentChunk,
  PreSpreadChild,
  BlankLine,
  ComicNode
} from './types';

import {
  SPREAD_REGEX,
  PANEL_REGEX,
  CAPTION_REGEX,
  SFX_REGEX,
  DIALOGUE_REGEX,
  METADATA_REGEX,
  LETTERING_BOLD_REGEX
} from './regexes';

// flyweight pattern: reuse this to represent every blank line seen
const BLANK_LINE: BlankLine = {
  type: parts.BLANK
};

export function parseLine(line: string): ComicNode {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isSpread(line)) return parseSpread(line);

  // last: paragraph
}

function parseSpread(line: string): any {
  const matchResult = SPREAD_REGEX.exec(line) as Array<string>;

  const startPage = Number(matchResult[1]);
  const endPage = matchResult[3] != null ? Number(matchResult[3]) : startPage;
  const pageCount = countPages(startPage, endPage);

  return {
    type: parts.SPREAD,
    pageCount
  };
}

function countPages(startPage: number, endPage?: number): number {
  if (endPage == null) {
    return 1;
  } else if (startPage < endPage) {
    return (endPage - startPage) + 1;
  } else if (startPage > endPage) {
    return 2;
  } else { // startPage === endPage
    return 1;
  }
}
