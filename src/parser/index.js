import * as types from '../types';
import countWords from './count-words';
import { create as createParserState } from './state';

const SPREAD_REGEX    = /^pages? (\d+)(-(\d+)?)?/i;
const PANEL_REGEX     = /^panel (\d+)/i;
const CAPTION_REGEX   = /^\tcaption ?(\(.+\))?: ?(.+)/i;
const SFX_REGEX       = /^\tsfx ?(\(.+\))?: ?(.+)/i;
const DIALOGUE_REGEX  = /^\t(.+?) ?(\(.+\))?: ?(.+)/;
const METADATA_REGEX  = /^(.+): ?(.+)/;
const PARAGRAPH_REGEX = /^.+/;

export default function parse(source) {
  const lines = lineStream(source);
  const state = createParserState();

  return parseScript(lines, state);
}

function parseScript(lines, state) {
  const script = [];

  while (lines.hasMore()) {
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

function parseSpread(lines, state) {
  if (!lines.nextIsSpreadStart()) throw new Error('parsing spread but next isnt spread start');

  const spreadStart = lines.consume();
  const matchResult = SPREAD_REGEX.exec(spreadStart);

  const startPage = Number(matchResult[1]);
  const endPage = matchResult[3] != null ? Number(matchResult[3]) : startPage;
  const pageCount = countPages(startPage, endPage);

  state.startNewSpread(pageCount);

  const startingLine = lines.lineNumber;
  const content = parseSpreadContent(lines, state);

  const panels = content.filter(node => node.type === types.PANEL);

  return {
    id: state.currentSpreadLabel,
    type: types.SPREAD,
    label: state.currentSpreadLabel,
    pageCount,
    content,
    panelCount: panels.length,
    speakers: panels.reduce((speakers, panel) => speakers.concat(panel.speakers), []),
    dialogueCount: panels.reduce((total, p) => total + p.dialogueCount, 0),
    captionCount: panels.reduce((total, p) => total + p.captionCount, 0),
    sfxCount: panels.reduce((total, p) => total + p.sfxCount, 0),
    dialogueWordCount: panels.reduce((total, p) => total + p.dialogueWordCount, 0),
    captionWordCount: panels.reduce((total, p) => total + p.captionWordCount, 0),
    startingLine
  };
}

function countPages(startPage, endPage) {
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

function parseSpreadContent(lines, state) {
  const content = [];

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

function parsePanel(lines, state) {
  if (!lines.nextIsPanelStart()) throw new Error('parsing panel but next isnt panel start');

  state.startNewPanel();

  const panelStart = lines.consume();
  const number = PANEL_REGEX.exec(panelStart)[1];
  const startingLine = lines.lineNumber;

  const content = parsePanelContent(lines, state);

  const dialogues = content.filter(node => node.type === types.DIALOGUE);
  const captions = content.filter(node => node.type === types.CAPTION);
  const sfxs = content.filter(node => node.type === types.SFX);

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

function parsePanelContent(lines, state) {
  const content = [];

  while (!lines.nextIsPanelEnd()) {
    if (lines.nextIsCaption()) {
      content.push(parseCaption(lines, state));
    } else if (lines.nextIsSfx()) {
      content.push(parseSfx(lines, state));
    } else if (lines.nextIsDialogue()) {
      content.push(parseDialogue(lines, state));
    } else if (lines.nextIsMetadata()) {
      content.push(parseMetadata(lines, state));
    } else if (lines.nextIsParagraph()) {
      content.push(parseParagraph(lines, state));
    } else if (lines.nextIsEmpty()) {
      lines.consume();
    }
  }

  return content;
}

function parseParagraph(lines, state) {
  state.startNewParagraph();

  return {
    id: state.currentParagraphId,
    type: types.PARAGRAPH,
    content: lines.consume(),
    startingLine: lines.lineNumber,
  };
}

function parseMetadata(lines, state) {
  const line = lines.consume();
  const [, name, value] = METADATA_REGEX.exec(line);

  state.startNewMetadata();

  return {
    id: state.currentMetadataId,
    type: types.METADATA,
    name,
    value,
    startingLine: lines.lineNumber,
  };
}

function parseDialogue(lines, state) {
  state.startNewLettering();

  const line = lines.consume();
  const [, speaker, modifier, content] = DIALOGUE_REGEX.exec(line);
  const startingLine = lines.lineNumber;

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

function parseSfx(lines, state) {
  state.startNewLettering();

  const line = lines.consume();
  const [, modifier, content] = SFX_REGEX.exec(line);

  return {
    id: state.currentLetteringId,
    type: types.SFX,
    number: state.currentLetteringNumber,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content,
    startingLine: lines.lineNumber,
  };
}

function parseCaption(lines, state) {
  state.startNewLettering();

  const line = lines.consume();
  const [, modifier, content] = CAPTION_REGEX.exec(line);
  const parseTree = parseLetteringContent(content);

  return {
    id: state.currentLetteringId,
    type: types.CAPTION,
    number: state.currentLetteringNumber,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseTree,
    wordCount: countWords(parseTree),
    startingLine: lines.lineNumber,
  };
}

function parseLetteringContent(content, state) {
  const boldRegex = /\*\*(.+?)\*\*(?!\*)/;
  const parts = [];

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

function lineStream(source) {
  const lines = (source || '')
    .split('\n');

  let currentLine = 0;

  return {
    nextIsSfx() {
      return this.hasMore() && SFX_REGEX.test(this.peek());
    },
    nextIsCaption() {
      return this.hasMore() && CAPTION_REGEX.test(this.peek());
    },
    nextIsDialogue() {
      return this.hasMore() && DIALOGUE_REGEX.test(this.peek());
    },
    nextIsMetadata() {
      return this.hasMore() && METADATA_REGEX.test(this.peek());
    },
    nextIsParagraph() {
      return this.hasMore() && PARAGRAPH_REGEX.test(this.peek());
    },
    nextIsPanelStart() {
      return this.hasMore() && PANEL_REGEX.test(this.peek());
    },
    nextIsSpreadStart() {
      return this.hasMore() && SPREAD_REGEX.test(this.peek());
    },
    nextIsSpreadEnd() {
      return !this.hasMore() || this.nextIsSpreadStart();
    },
    nextIsPanelEnd() {
      return !this.hasMore() || this.nextIsSpreadStart() || this.nextIsPanelStart();
    },
    nextIsEmpty() {
      return this.hasMore() && this.peek().trim() === '';
    },
    consume() {
      const line = this.peek();
      currentLine += 1;
      return line;
    },
    peek() {
      return lines[currentLine];
    },
    hasMore() {
      return currentLine < lines.length;
    },
    get lineNumber() {
      return currentLine;
    }
  };
}
