import * as parts from '../comic-part-types';
import countWords from './count-words';
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

// flyweight pattern: reuse this to represent every blank line
const BLANK_LINE: BlankLine = {
  type: parts.BLANK
};

interface LetteringNumbering {
  nextLetteringNumber(): number;
}

export function parseSpreadLines(lines: Array<string>): Array<ComicNode> {
  const numbering = {
    letteringNumber: 1,
    nextLetteringNumber(): number {
      return this.letteringNumber++;
    }
  };

  return lines.map(line => parseSpreadLine(line, numbering));
}

function parseSpreadLine(line: string, numbering: LetteringNumbering): ComicNode {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isCaption(line)) return parseCaption(line, numbering);
  if (classifiers.isSfx(line)) return parseSfx(line, numbering);
  // dialogue has to be checked after sfx/caption, otherwise we get balloons
  // where the speaker is "caption" and "sfx"
  if (classifiers.isDialogue(line)) return parseDialogue(line, numbering);

  if (classifiers.isPanel(line)) return parsePanel(line);
  if (classifiers.isSpread(line)) return parseSpread(line);

  if (classifiers.isMetadata(line)) return parseMetadata(line);

  // any non-blank line can be a paragraph so it goes last
  return parseParagraph(line);
}

export function parsePreSpreadLines(lines: Array<string>): Array<ComicNode> {
  return lines.map(line => parsePreSpreadLine(line));
}

function parsePreSpreadLine(line: string): ComicNode {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isMetadata(line)) return parseMetadata(line);

  // any non-blank line can be a paragraph so it goes last
  return parseParagraph(line);
}

function parseSpread(line: string): Spread {
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

function parsePanel(line: string): Panel {
  const [, number] = PANEL_REGEX.exec(line) as Array<string>;

  return {
    type: parts.PANEL,
    number: Number(number)
  };
}

function parseMetadata(line: string): Metadata {
  const [, name, value] = METADATA_REGEX.exec(line) as Array<string>;

  return {
    type: parts.METADATA,
    name,
    value,
  };
}

function parseParagraph(line: string): Paragraph {
  return {
    type: parts.PARAGRAPH,
    content: line
  };
}

function parseDialogue(line: string, numbering: LetteringNumbering): Dialogue {
  const [, speaker, modifier, content] = DIALOGUE_REGEX.exec(line) as Array<string>;

  const parseTree = parseLetteringContent(content);

  return {
    type: parts.DIALOGUE,
    number: numbering.nextLetteringNumber(),
    speaker,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
  };
}

function parseCaption(line: string, numbering: LetteringNumbering): Caption {
  const [, modifier, content] = CAPTION_REGEX.exec(line) as Array<string>;
  const parseTree = parseLetteringContent(content);

  return {
    type: parts.CAPTION,
    number: numbering.nextLetteringNumber(),
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree)
  };
}

function parseSfx(line: string, numbering: LetteringNumbering): Sfx {
  const [, modifier, content] = SFX_REGEX.exec(line) as Array<string>;

  return {
    type: parts.SFX,
    number: numbering.nextLetteringNumber(),
    modifier: modifier ? modifier.slice(1, -1) : null,
    content,
  };
}

function parseLetteringContent(content: string): Array<LetteringContentChunk> {
  const chunks: Array<LetteringContentChunk> = [];

  let index = 0;
  let result = null;

  // eslint-disable-next-line no-cond-assign
  while (result = LETTERING_BOLD_REGEX.exec(content.slice(index))) {
    const before = content.slice(index, index + result.index)

    if (before) {
      chunks.push({
        type: parts.TEXT,
        content: before
      });
    }

    chunks.push({
      type: parts.LETTERING_BOLD,
      content: result[1]
    })

    index += result.index + result[0].length;
  }

  const after = content.slice(index);
  if (after) {
    chunks.push({
      type: parts.TEXT,
      content: after
    });
  }

  return chunks;
}
