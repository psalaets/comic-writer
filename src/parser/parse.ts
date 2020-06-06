import * as perf from '../perf';
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
  PreSpread,
  SpreadChild,
  PanelChild,
  SpreadContent,
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

export const parseSpreadContent = perf.wrap('parseSpreadContent', parse);

function parse(content: SpreadContent): Spread<SpreadChild> {
  const spreadLine = content.spread;
  const childLines = content.children;

  const children = parseSpreadChildren(childLines);

  return parseSpread(spreadLine, children);
}

function parseSpreadChildren(lines: Array<string>): Array<SpreadChild> {
  const numbering = createLetteringNumberer();

  const spreadChildren: Array<SpreadChild> = [];
  let currentPanel: Panel<PanelChild> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const parsed = parseSpreadChild(lines[i], numbering);

    if (parsed.type === parts.PANEL) {
      currentPanel = parsed;
      spreadChildren.push(parsed);
    } else {
      if (currentPanel) {
        currentPanel.children.push(parsed);
      } else {
        spreadChildren.push(parsed);
      }
    }
  }

  return applyPanelRollups(spreadChildren);
}

function* createLetteringNumberer() {
  let number = 1;
  while (true) {
    yield number++;
  }
}

function applyPanelRollups(children: Array<SpreadChild>): Array<SpreadChild> {
  children.forEach(spreadChild => {
    if (spreadChild.type === parts.PANEL) {
      const panel = spreadChild;

      panel.children.forEach(panelChild => {
        switch (panelChild.type) {
          case parts.CAPTION: {
            panel.captionCount += 1;
            panel.captionWordCount += panelChild.wordCount;
            break;
          }
          case parts.DIALOGUE: {
            panel.dialogueCount += 1;
            panel.dialogueWordCount += panelChild.wordCount;
            panel.speakers.push(panelChild.speaker);
            break;
          }
          case parts.SFX: {
            panel.sfxCount += 1;
            break;
          }
        }
      });
    }
  });

  return children;
}

function parseSpreadChild(line: string, numbering: Generator<number>): SpreadChild {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isCaption(line)) return parseCaption(line, numbering);
  if (classifiers.isSfx(line)) return parseSfx(line, numbering);
  // dialogue has to be checked after sfx/caption, otherwise we get balloons
  // where the speaker is "caption" and "sfx"
  if (classifiers.isDialogue(line)) return parseDialogue(line, numbering);

  if (classifiers.isPanel(line)) return parsePanel(line);

  // any non-blank line can be a paragraph so it goes last
  return parseParagraph(line);
}

export function parsePreSpreadLines(lines: Array<string>): Array<PreSpread> {
  return lines.map(line => parsePreSpreadLine(line));
}

function parsePreSpreadLine(line: string): PreSpread {
  // scripts are about 1/2 blank lines so this should be first
  if (classifiers.isBlank(line)) return BLANK_LINE;

  if (classifiers.isMetadata(line)) return parseMetadata(line);

  // any non-blank line can be a paragraph so it goes last
  return parseParagraph(line);
}

export function parseSpread(line: string, children: Array<SpreadChild>): Spread<SpreadChild> {
  const matchResult = SPREAD_REGEX.exec(line) as Array<string>;

  const startPage = Number(matchResult[1]);
  const endPage = matchResult[3] != null ? Number(matchResult[3]) : startPage;
  const pageCount = countPages(startPage, endPage);

  return applySpreadRollups({
    type: parts.SPREAD,
    pageCount,
    children,

    // these start with default values, they're populated when applying rollups
    panelCount: 0,
    speakers: [],
    dialogueCount: 0,
    captionCount: 0,
    sfxCount: 0,
    dialogueWordCount: 0,
    captionWordCount: 0
  });
}

function applySpreadRollups(spread: Spread<SpreadChild>): Spread<SpreadChild> {
  return spread.children.reduce((spread, child) => {
    switch (child.type) {
      case parts.PANEL:
        spread.panelCount        += 1;
        spread.captionCount      += child.captionCount;
        spread.captionWordCount  += child.captionWordCount;
        spread.dialogueCount     += child.dialogueCount;
        spread.dialogueWordCount += child.dialogueWordCount;
        spread.sfxCount          += child.sfxCount;
        spread.speakers.push(...child.speakers);
        break;
      case parts.DIALOGUE:
        spread.dialogueCount     += 1;
        spread.dialogueWordCount += child.wordCount;
        break;
      case parts.CAPTION:
        spread.captionCount      += 1;
        spread.captionWordCount  += child.wordCount;
        break;
    }

    return spread;
  }, spread);
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

export function parsePanel(line: string): Panel<PanelChild> {
  const [, number] = PANEL_REGEX.exec(line) as Array<string>;

  return {
    type: parts.PANEL,
    number: Number(number),

    // these start with default values, they'll be populated later
    children: [],
    speakers: [],
    dialogueCount: 0,
    captionCount: 0,
    sfxCount: 0,
    dialogueWordCount: 0,
    captionWordCount: 0,
  };
}

export function parseMetadata(line: string): Metadata {
  const [, name, value] = METADATA_REGEX.exec(line) as Array<string>;

  return {
    type: parts.METADATA,
    name,
    value,
  };
}

export function parseParagraph(line: string): Paragraph {
  return {
    type: parts.PARAGRAPH,
    content: line
  };
}

export function parseDialogue(line: string, numbering: Generator<number>): Dialogue {
  const [, speaker, modifier, content] = DIALOGUE_REGEX.exec(line) as Array<string>;

  const parseTree = parseLetteringContent(content);

  return {
    type: parts.DIALOGUE,
    number: numbering.next().value,
    speaker,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
  };
}

export function parseCaption(line: string, numbering: Generator<number>): Caption {
  const [, modifier, content] = CAPTION_REGEX.exec(line) as Array<string>;
  const parseTree = parseLetteringContent(content);

  return {
    type: parts.CAPTION,
    number: numbering.next().value,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree)
  };
}

export function parseSfx(line: string, numbering: Generator<number>): Sfx {
  const [, modifier, content] = SFX_REGEX.exec(line) as Array<string>;

  return {
    type: parts.SFX,
    number: numbering.next().value,
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
