import * as types from '../comic-part-types';
import countWords from './count-words';
import { create as createParserState, ParserState } from './state';
import * as perf from '../perf';
import {
  ComicChild,
  Paragraph,
  Metadata,
  Spread,
  SpreadChild,
  Panel,
  PanelChild,
  Dialogue,
  Caption,
  Sfx,
  LetteringContentChunk
} from './types';

const SPREAD_REGEX    = /^pages? (\d+)(-(\d+)?)?/i;
const PANEL_REGEX     = /^panel (\d+)/i;
const CAPTION_REGEX   = /^\tcaption ?(\(.+\))?: ?(.+)/i;
const SFX_REGEX       = /^\tsfx ?(\(.+\))?: ?(.+)/i;
const DIALOGUE_REGEX  = /^\t(.+?) ?(\(.+\))?: ?(.+)/;
const METADATA_REGEX  = /^(.+): ?(.+)/;
const PARAGRAPH_REGEX = /^.+/;

export default function parse(source: string): Array<ComicChild> {
  const lines = new LineStream(source);
  const state = createParserState();

  perf.start('parse-script');

  const parseResult = parseScript(lines, state);

  perf.end('parse-script');

  return parseResult;
}

function parseScript(lines: LineStream, state: ParserState): Array<ComicChild> {
  const script: Array<ComicChild> = [];

  while (lines.hasMoreLines()) {
    if (lines.nextIsSpreadStart()) {
      script.push(parseSpread(lines, state));
    } else if (lines.nextIsPanelStart()) {
      script.push(parsePanel(lines, state));
    } else if (lines.nextIsMetadata()) {
      script.push(parseMetadata(lines, state));
    } else if (lines.nextIsParagraph()) {
      script.push(parseParagraph(lines, state));
    } else if (lines.nextIsEmpty()) {
      lines.consume();
    }
  }

  return script;
}

function parseSpread(lines: LineStream, state: ParserState): Spread {
  if (!lines.nextIsSpreadStart()) throw new Error('parsing spread but next isnt spread start');

  const startingLine = lines.lineNumber;
  const spreadStart = lines.consume();
  const matchResult = SPREAD_REGEX.exec(spreadStart) as Array<string>;

  const startPage = Number(matchResult[1]);
  const endPage = matchResult[3] != null ? Number(matchResult[3]) : startPage;
  const pageCount = countPages(startPage, endPage);

  state.startNewSpread(pageCount);

  const content = parseSpreadContent(lines, state);
  const panels = content.filter(node => node.type === types.PANEL) as Array<Panel>;

  return {
    id: state.currentSpreadLabel,
    type: types.SPREAD,
    label: state.currentSpreadLabel,
    pageCount,
    content,
    panelCount: panels.length,
    speakers: panels.reduce<Array<string>>((speakers, panel) => speakers.concat(panel.speakers), []),
    dialogueCount: panels.reduce<number>((total, p) => total + p.dialogueCount, 0),
    captionCount: panels.reduce<number>((total, p) => total + p.captionCount, 0),
    sfxCount: panels.reduce<number>((total, p) => total + p.sfxCount, 0),
    dialogueWordCount: panels.reduce<number>((total, p) => total + p.dialogueWordCount, 0),
    captionWordCount: panels.reduce<number>((total, p) => total + p.captionWordCount, 0),
    startingLine
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

function parseSpreadContent(
  lines: LineStream,
  state: ParserState
): Array<SpreadChild> {
  const content: Array<SpreadChild> = [];

  while (!lines.nextIsSpreadEnd()) {
    if (lines.nextIsPanelStart()) {
      content.push(parsePanel(lines, state));
    } else if (lines.nextIsCaption()) {
      content.push(parseCaption(lines, state));
    } else if (lines.nextIsSfx()) {
      content.push(parseSfx(lines, state));
    } else if (lines.nextIsDialogue()) {
      content.push(parseDialogue(lines, state));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines, state));
    } else if (lines.nextIsEmpty()) {
      lines.consume();
    }
  }

  return content;
}

function parsePanel(lines: LineStream, state: ParserState): Panel {
  if (!lines.nextIsPanelStart()) throw new Error('parsing panel but next isnt panel start');

  state.startNewPanel();

  const startingLine = lines.lineNumber;
  const panelStart = lines.consume();
  const [, number] = PANEL_REGEX.exec(panelStart) as Array<string>;

  const content = parsePanelContent(lines, state);

  const dialogues = content.filter(node => node.type === types.DIALOGUE) as Array<Dialogue>;
  const captions = content.filter(node => node.type === types.CAPTION) as Array<Caption>;
  const sfxs = content.filter(node => node.type === types.SFX) as Array<Sfx>;

  return {
    id: state.currentPanelId,
    type: types.PANEL,
    number: Number(number),
    content,
    speakers: dialogues.map(d => d.speaker),
    dialogueCount: dialogues.length,
    captionCount: captions.length,
    sfxCount: sfxs.length,
    dialogueWordCount: dialogues.reduce((total, d) => total + d.wordCount, 0),
    captionWordCount: captions.reduce((total, c) => total + c.wordCount, 0),
    startingLine
  };
}

function parsePanelContent(
  lines: LineStream,
  state: ParserState
): Array<PanelChild> {
  const content: Array<PanelChild> = [];

  while (!lines.nextIsPanelEnd()) {
    if (lines.nextIsEmpty()) {
      lines.consume();
    } else if (lines.nextIsCaption()) {
      content.push(parseCaption(lines, state));
    } else if (lines.nextIsSfx()) {
      content.push(parseSfx(lines, state));
    } else if (lines.nextIsDialogue()) {
      content.push(parseDialogue(lines, state));
    } else if (lines.nextIsMetadata()) {
      content.push(parseMetadata(lines, state));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines, state));
    }
  }

  return content;
}

function parseParagraph(lines: LineStream, state: ParserState): Paragraph {
  state.startNewParagraph();

  const startingLine = lines.lineNumber;

  return {
    id: state.currentParagraphId,
    type: types.PARAGRAPH,
    content: lines.consume(),
    startingLine
  };
}

function parseMetadata(lines: LineStream, state: ParserState): Metadata {
  state.startNewMetadata();

  const startingLine = lines.lineNumber;
  const line = lines.consume();
  const [, name, value] = METADATA_REGEX.exec(line) as Array<string>;

  return {
    id: state.currentMetadataId,
    type: types.METADATA,
    name,
    value,
    startingLine
  };
}

function parseDialogue(lines: LineStream, state: ParserState): Dialogue {
  state.startNewLettering();

  const startingLine = lines.lineNumber;
  const line = lines.consume();
  const [, speaker, modifier, content] = DIALOGUE_REGEX.exec(line) as Array<string>;

  const parseTree = parseLetteringContent(content);

  return {
    id: state.currentLetteringId,
    type: types.DIALOGUE,
    number: state.currentLetteringNumber,
    speaker,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
    startingLine,
  };
}

function parseSfx(lines: LineStream, state: ParserState): Sfx {
  state.startNewLettering();

  const startingLine = lines.lineNumber;
  const line = lines.consume();
  const [, modifier, content] = SFX_REGEX.exec(line) as Array<string>;

  return {
    id: state.currentLetteringId,
    type: types.SFX,
    number: state.currentLetteringNumber,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content,
    startingLine
  };
}

function parseCaption(lines: LineStream, state: ParserState): Caption {
  state.startNewLettering();

  const startingLine = lines.lineNumber;
  const line = lines.consume();
  const [, modifier, content] = CAPTION_REGEX.exec(line) as Array<string>;
  const parseTree = parseLetteringContent(content);

  return {
    id: state.currentLetteringId,
    type: types.CAPTION,
    number: state.currentLetteringNumber,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
    startingLine
  };
}

function parseLetteringContent(content: string): Array<LetteringContentChunk> {
  const boldRegex = /\*\*(.+?)\*\*(?!\*)/;
  const parts: Array<LetteringContentChunk> = [];

  let index = 0;
  let result = null;

  // eslint-disable-next-line no-cond-assign
  while (result = boldRegex.exec(content.slice(index))) {
    const before = content.slice(index, index + result.index)

    if (before) {
      parts.push({
        type: types.TEXT,
        content: before
      });
    }

    parts.push({
      type: types.LETTERING_BOLD,
      content: result[1]
    })

    index += result.index + result[0].length;
  }

  const after = content.slice(index);
  if (after) {
    parts.push({
      type: types.TEXT,
      content: after
    });
  }

  return parts;
}

class LineStream {
  lines: Array<string>;
  currentLine: number;

  constructor(source: string) {
    this.currentLine = 0;
    this.lines = (source || '')
      .split('\n');
  }

  get lineNumber() {
    return this.currentLine;
  }

  nextIsSfx(): boolean {
    return this.hasMoreLines() && SFX_REGEX.test(this.peek());
  }

  nextIsCaption(): boolean {
    return this.hasMoreLines() && CAPTION_REGEX.test(this.peek());
  }

  nextIsDialogue(): boolean {
    return this.hasMoreLines() && DIALOGUE_REGEX.test(this.peek());
  }

  nextIsMetadata(): boolean {
    return this.hasMoreLines() && METADATA_REGEX.test(this.peek());
  }

  nextIsParagraph(): boolean {
    return this.hasMoreLines() && PARAGRAPH_REGEX.test(this.peek());
  }

  nextIsPanelStart(): boolean {
    return this.hasMoreLines() && PANEL_REGEX.test(this.peek());
  }

  nextIsSpreadStart(): boolean {
    return this.hasMoreLines() && SPREAD_REGEX.test(this.peek());
  }

  nextIsSpreadEnd(): boolean {
    return !this.hasMoreLines() || this.nextIsSpreadStart();
  }

  nextIsPanelEnd(): boolean {
    return !this.hasMoreLines() || this.nextIsSpreadStart() || this.nextIsPanelStart();
  }

  nextIsEmpty(): boolean {
    return this.hasMoreLines() && this.peek().trim() === '';
  }

  consume(): string {
    const line = this.peek();
    this.currentLine += 1;
    return line;
  }

  peek(): string {
    return this.lines[this.currentLine];
  }

  hasMoreLines(): boolean {
    return this.currentLine < this.lines.length;
  }
}
