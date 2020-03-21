import * as parts from '../comic-part-types';
import countWords from './count-words';
import * as perf from '../perf';
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

import { LineStream } from './line-stream';

export function parsePreSpread(preSpreadLines: Array<string>): Array<PreSpreadChild> {
  const lines = LineStream.fromLines(preSpreadLines);
  const content: Array<PreSpreadChild> = [];

  while (lines.hasMoreLines()) {
    if (lines.nextIsEmpty()) {
      lines.consume();
    } else if (lines.nextIsMetadata()) {
      content.push(parseMetadata(lines));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines));
    }
  }

  return content;
}

export function parseSpread(spreadLines: Array<string>): Spread {
  const lines = LineStream.fromLines(spreadLines);

  if (!lines.nextIsSpreadStart()) throw new Error('parsing spread but next isnt spread start');

  const spreadStart = lines.consume();
  const matchResult = SPREAD_REGEX.exec(spreadStart) as Array<string>;

  const startPage = Number(matchResult[1]);
  const endPage = matchResult[3] != null ? Number(matchResult[3]) : startPage;
  const pageCount = countPages(startPage, endPage);

  const content = parseSpreadContent(lines);
  const panels = content.filter(node => node.type === parts.PANEL) as Array<Panel>;

  return {
    type: parts.SPREAD,
    content,
    pageCount,
    panelCount: panels.length,
    speakers: panels.reduce<Array<string>>((speakers, panel) => speakers.concat(panel.speakers), []),
    dialogueCount: panels.reduce((total, p) => total + p.dialogueCount, 0),
    captionCount: panels.reduce((total, p) => total + p.captionCount, 0),
    sfxCount: panels.reduce((total, p) => total + p.sfxCount, 0),
    dialogueWordCount: panels.reduce((total, p) => total + p.dialogueWordCount, 0),
    captionWordCount: panels.reduce((total, p) => total + p.captionWordCount, 0)
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

function parseSpreadContent(lines: LineStream): Array<SpreadChild> {
  const content: Array<SpreadChild> = [];

  while (lines.hasMoreLines()) {
    if (lines.nextIsPanelStart()) {
      content.push(parsePanel(lines));
    } else if (lines.nextIsCaption()) {
      content.push(parseCaption(lines));
    } else if (lines.nextIsSfx()) {
      content.push(parseSfx(lines));
    } else if (lines.nextIsDialogue()) {
      content.push(parseDialogue(lines));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines));
    } else if (lines.nextIsEmpty()) {
      lines.consume();
    }
  }

  return content;
}

function parsePanel(lines: LineStream): Panel {
  if (!lines.nextIsPanelStart()) throw new Error('parsing panel but next isnt panel start');

  const lineOffset = lines.lineNumber;
  const panelStart = lines.consume();
  const [, number] = PANEL_REGEX.exec(panelStart) as Array<string>;

  const content = parsePanelContent(lines);

  const dialogues = content.filter(node => node.type === parts.DIALOGUE) as Array<Dialogue>;
  const captions = content.filter(node => node.type === parts.CAPTION) as Array<Caption>;
  const sfxs = content.filter(node => node.type === parts.SFX) as Array<Sfx>;

  return {
    type: parts.PANEL,
    lineOffset,
    content,
    speakers: dialogues.map(d => d.speaker),
    dialogueCount: dialogues.length,
    captionCount: captions.length,
    sfxCount: sfxs.length,
    dialogueWordCount: dialogues.reduce((total, d) => total + d.wordCount, 0),
    captionWordCount: captions.reduce((total, c) => total + c.wordCount, 0)
  };
}

function parsePanelContent(lines: LineStream): Array<PanelChild> {
  const content: Array<PanelChild> = [];

  while (!lines.nextIsPanelEnd()) {
    if (lines.nextIsEmpty()) {
      lines.consume();
    } else if (lines.nextIsCaption()) {
      content.push(parseCaption(lines));
    } else if (lines.nextIsSfx()) {
      content.push(parseSfx(lines));
    } else if (lines.nextIsDialogue()) {
      content.push(parseDialogue(lines));
    } else if (lines.nextIsMetadata()) {
      content.push(parseMetadata(lines));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines));
    }
  }

  return content;
}

function parseCaption(lines: LineStream): Caption {
  const lineOffset = lines.lineNumber;
  const line = lines.consume();
  const [, modifier, content] = CAPTION_REGEX.exec(line) as Array<string>;
  const parseTree = parseLetteringContent(content);

  return {
    lineOffset,
    type: parts.CAPTION,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree)
  };
}

function parseSfx(lines: LineStream): Sfx {
  const lineOffset = lines.lineNumber;
  const line = lines.consume();
  const [, modifier, content] = SFX_REGEX.exec(line) as Array<string>;

  return {
    lineOffset,
    type: parts.SFX,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content,
  };
}

function parseDialogue(lines: LineStream): Dialogue {
  const lineOffset = lines.lineNumber;
  const line = lines.consume();
  const [, speaker, modifier, content] = DIALOGUE_REGEX.exec(line) as Array<string>;

  const parseTree = parseLetteringContent(content);

  return {
    lineOffset,
    type: parts.DIALOGUE,
    speaker,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
  };
}

function parseParagraph(lines: LineStream): Paragraph {
  const lineOffset = lines.lineNumber;

  return {
    lineOffset,
    type: parts.PARAGRAPH,
    content: lines.consume()
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

function parseMetadata(lines: LineStream): Metadata {
  const lineOffset = lines.lineNumber;
  const line = lines.consume();
  const [, name, value] = METADATA_REGEX.exec(line) as Array<string>;

  return {
    lineOffset,
    type: parts.METADATA,
    name,
    value,
  };
}