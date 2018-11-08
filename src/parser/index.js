const PAGE_REGEX      = /^page (\d+)/i;
const PANEL_REGEX     = /^panel (\d+)/i;
const CAPTION_REGEX   = /^> caption ?(\([^]+\))?: ?([^]+)/i;
const SFX_REGEX       = /^> sfx ?(\([^]+\))?: ?([^]+)/i;
const DIALOGUE_REGEX  = /^> ([^]+) ?(\([^]+\))?: ?([^]+)/;
const METADATA_REGEX  = /^([^]+): ?([^]+)/;
const PARAGRAPH_REGEX = /^[^]+/;

export function parse(source) {
  const lines = lineStream(source);
  const script = parseScript(lines);
  return script;
}

function parseScript(lines) {
  const script = [];

  while (lines.hasMore()) {
    if (lines.nextIsPageStart()) {
      script.push(parsePage(lines));
    } else if (lines.nextIsMetadata()) {
      script.push(parseMetadata(lines));
    } else if (lines.nextIsParagraph()) {
      script.push(parseParagraph(lines));
    }
  }

  return script;
}

function parsePage(lines) {
  if (!lines.nextIsPageStart()) throw new Error('parsing page but next isnt page');

  const page = {
    type: 'page',
    content: []
  };

  const pageStart = lines.consume();
  const [match, number] = PAGE_REGEX.exec(pageStart);

  page.number = Number(number);

  while (lines.hasMore() && !lines.nextIsPageStart()) {
    if (lines.nextIsPanelStart()) {
      page.content.push(parsePanel(lines));
    } else if (lines.nextIsCaption()) {
      page.content.push(parseCaption(lines));
    } else if (lines.nextIsSfx()) {
      page.content.push(parseSfx(lines));
    } else if (lines.nextIsDialogue()) {
      page.content.push(parseDialogue(lines));
    } else if (lines.nextIsParagraph()) {
      page.content.push(parseParagraph(lines));
    }
  }

  return page;
}

function parsePanel(lines) {
  if (!lines.nextIsPanelStart()) throw new Error('parsing panel but next isnt panel');

  const panel = {
    type: 'panel',
    content: []
  };

  const panelStart = lines.consume();
  const [match, number] = PANEL_REGEX.exec(panelStart);

  panel.number = Number(number);

  while (lines.hasMore() && !lines.nextIsPageStart() && !lines.nextIsPanelStart()) {
    if (lines.nextIsCaption()) {
      panel.content.push(parseCaption(lines));
    } else if (lines.nextIsSfx()) {
      panel.content.push(parseSfx(lines));
    } else if (lines.nextIsDialogue()) {
      panel.content.push(parseDialogue(lines));
    } else if (lines.nextIsMetadata()) {
      panel.content.push(parseMetadata(lines));
    } else if (lines.nextIsParagraph()) {
      panel.content.push(parseParagraph(lines));
    }
  }

  return panel;
}

function parseParagraph(lines) {
  return {
    type: 'paragraph',
    content: lines.consume()
  };
}

function parseMetadata(lines) {
  const line = lines.consume();
  const [match, key, value] = METADATA_REGEX.exec(line);

  return {
    type: 'metadata',
    key,
    value
  };
}

function parseDialogue(lines) {
  const line = lines.consume();
  const [match, speaker, modifier, content] = DIALOGUE_REGEX.exec(line);

  return {
    type: 'dialogue',
    speaker,
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseLetteringContent(content)
  };
}

function parseSfx(lines) {
  const line = lines.consume();
  const [match, modifier, content] = SFX_REGEX.exec(line);

  return {
    type: 'sfx',
    modifier: modifier ? modifier.slice(1, -1) : null,
    content
  };
}

function parseCaption(lines) {
  const line = lines.consume();
  const [match, modifier, content] = CAPTION_REGEX.exec(line);

  return {
    type: 'caption',
    modifier: modifier ? modifier.slice(1, -1) : null,
    content: parseLetteringContent(content)
  };
}

function parseLetteringContent(content) {
  const boldRegex = /\*\*([^]+?)\*\*(?!\*)/;
  const parts = [];

  let index = 0;
  let result = null;

  while (result = boldRegex.exec(content.slice(index))) {
    const before = content.slice(index, index + result.index)

    if (before) {
      parts.push({
        type: 'text',
        content: before
      });
    }

    parts.push({
      type: 'lettering-bold',
      content: result[1]
    })

    index += result.index + result[0].length;
  }

  const after = content.slice(index);
  if (after) {
    parts.push({
      type: 'text',
      content: after
    });
  }

  return parts;
}

function indexOfRegex(regex, str, startIndex = 0) {
  const result = regex.exec(str.slice(startIndex));

  if (result) {
    return result.index + startIndex;
  } else {
    return -1;
  }
}

function lineStream(source) {
  const lines = (source || '')
    .split('\n')
    .filter(line => !!line.trim());

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
    nextIsPageStart() {
      return this.hasMore() && PAGE_REGEX.test(this.peek());
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
    }
  };
}