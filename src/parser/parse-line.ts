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
  LetteringContentChunk,
  BlankLine,
  ComicNode,
  SpreadChild
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
  const children = panelRollups(parseSpreadChildren(lines.slice(1)));
  const spread = spreadRollups(parseSpread(lines[0]), children);

  return [spread, ...children];
}

function spreadRollups(spread: Spread, children: Array<SpreadChild>): Spread {
  return children.reduce((spread, child) => {
    if (child.type === parts.PANEL) {
      spread.panelCount += 1;
      spread.captionCount += child.captionCount;
      spread.captionWordCount += child.captionCount;
      spread.dialogueCount += child.dialogueCount;
      spread.dialogueWordCount += child.dialogueWordCount;
      spread.speakers.push(...child.speakers);
      spread.sfxCount += child.sfxCount;
    }
    return spread;
  }, spread);
}

function parseSpreadChildren(lines: Array<string>): Array<SpreadChild> {
  let letteringNumber = 1;

  const numbering = {
    nextLetteringNumber(): number {
      return letteringNumber++;
    }
  };

  return lines
    .map(line => parseSpreadChild(line, numbering));
}

function panelRollups(children: Array<SpreadChild>): Array<SpreadChild> {
  let lastPanel: Panel;

  children.forEach(child => {
    switch (child.type) {
      case parts.PANEL: {
        lastPanel = child;
        break;
      }
      case parts.CAPTION: {
        if (lastPanel) {
          lastPanel.captionCount += 1;
          lastPanel.captionWordCount += child.wordCount;
        }
        break;
      }
      case parts.DIALOGUE: {
        if (lastPanel) {
          lastPanel.dialogueCount += 1;
          lastPanel.dialogueWordCount += child.wordCount;
          lastPanel.speakers.push(child.speaker);
        }
        break;
      }
      case parts.SFX: {
        if (lastPanel) {
          lastPanel.sfxCount += 1;
        }
        break;
      }
    }
  });

  return children;
}

function parseSpreadChild(line: string, numbering: LetteringNumbering): SpreadChild {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isCaption(line)) return parseCaption(line, numbering);
  if (classifiers.isSfx(line)) return parseSfx(line, numbering);
  // dialogue has to be checked after sfx/caption, otherwise we get balloons
  // where the speaker is "caption" and "sfx"
  if (classifiers.isDialogue(line)) return parseDialogue(line, numbering);

  if (classifiers.isPanel(line)) return parsePanel(line);

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
    pageCount,

    // these start with default values, rollups need to be done later
    panelCount: 0,
    speakers: [],
    dialogueCount: 0,
    captionCount: 0,
    sfxCount: 0,
    dialogueWordCount: 0,
    captionWordCount: 0
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
    number: Number(number),

    // these start with default values, rollups need to be done later
    speakers: [],
    dialogueCount: 0,
    captionCount: 0,
    sfxCount: 0,
    dialogueWordCount: 0,
    captionWordCount: 0,
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
