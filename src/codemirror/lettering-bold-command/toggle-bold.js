import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

export function toggle(tokens, selectionStart, selectionEnd) {
  const internalTokens = tokens.map(token => {
    if (isBold(token)) {
      return boldInternal(token.string, token.start, token.end);
    } else {
      return nonBoldInternal(token.string, token.start, token.end);
    }
  });

  // if multiple tokens are selected, convert everything to bold
  const selected = internalTokens.filter(token => {
    return overlaps(token, selectionStart, selectionEnd);
  });
  const multipleSelected = selected.length > 1;

  const transformedTokens = internalTokens.map(token => {
    if (overlaps(token, selectionStart, selectionEnd)) {
      if (multipleSelected) {
        return token.toBold(selectionStart.ch, selectionEnd.ch);
      } else {
        return token.toggle(selectionStart.ch, selectionEnd.ch);
      }
    }

    return token;
  });

  const flattenedTokens = transformedTokens.reduce((tokens, curr) => {
    if (Array.isArray(curr)) {
      tokens.push(...curr);
    } else {
      tokens.push(curr);
    }
    return tokens;
  }, []);

  // merge adjacent tokens of same type
  const mergedTokens = flattenedTokens
    .reduce((arr, current) => {
      if (arr.length > 0) {
        const last = arr[arr.length - 1];
        if (current.isBold === last.isBold) {
          if (current.isBold) {
            arr[arr.length - 1] = boldInternal(last.string + current.string);
          } else {
            arr[arr.length - 1] = nonBoldInternal(last.string + current.string);
          }
        } else {
          arr.push(current);
        }
      } else {
        arr.push(current);
      }

      return arr;
    }, []);

  return externalizeTokens(internalTokens[0].start, mergedTokens);
}

function externalizeTokens(start, tokens) {
  let startPosition = start;

  return tokens.map(token => {
    const type = token.isBold
      ? `${LETTERING_BOLD} ${LETTERING_CONTENT}`
      : LETTERING_CONTENT;
    const string = token.isBold
      ? wrapBold(unwrapBold(token.string))
      : token.string;

    const externalToken = {
      start: startPosition,
      end: startPosition + string.length,
      string,
      type
    };

    startPosition += string.length;

    return externalToken;
  });
}

function wrapBold(string) {
  return `**${string}**`;
}

function unwrapBold(string) {
  return string.replace(/\*\*/g, '');
}

function overlaps(token, start, end) {
  return (token.start >= start.ch && token.start < end.ch)
    || (token.end > start.ch && token.end <= end.ch)
    || (token.start < start.ch && token.end > end.ch);
}

function isBold(token) {
  return token.type && token.type.includes(LETTERING_BOLD);
}

function boldInternal(string, start = null, end = null) {
  const token = tokenInternal(string, true, start, end);

  token.toBold = function toBold() {
    return this;
  };

  token.toggle = function toggle(selectionStart, selectionEnd) {
    const parts = string.split(/(\s+)/g);

    let position = start;

    // add start/end to each word
    const chunks = parts
      .map(part => {
        const start = position;
        const end = position + part.length;
        const selected = (start >= selectionStart && start < selectionEnd)
          || (end > selectionStart && end <= selectionEnd)
          || (start < selectionStart && end > selectionEnd);

        const chunk = {
          string: part,
          start,
          end,
          selected,
          whitespace: /^\s+$/.test(part)
        };

        position += part.length;

        return chunk;
      });

    const justCursor = selectionStart === selectionEnd;
    if (justCursor) {
      return [nonBoldInternal(unwrapBold(string))];
    }

    return chunks
      .map(chunk => {
        if (chunk.selected) {
          return nonBoldInternal(unwrapBold(chunk.string));
        } else {
          return boldInternal(chunk.string);
        }
      });
  };

  return token;
}

function nonBoldInternal(string, start = null, end = null) {
  const token = tokenInternal(string, false, start, end);

  token.toBold = function toBold(selectionStart, selectionEnd) {
    return this.toggle(selectionStart, selectionEnd);
  };

  token.toggle = function toggle(selectionStart, selectionEnd) {
    const parts = string.split(/(\s+)/g);

    let position = start;

    // add start/end to each word
    const chunks = parts
      .map(part => {
        const start = position;
        const end = position + part.length;
        const selected = (start >= selectionStart && start < selectionEnd)
          || (end > selectionStart && end <= selectionEnd)
          || (start < selectionStart && end > selectionEnd);

        const chunk = {
          string: part,
          start,
          end,
          selected,
          whitespace: /^\s+$/.test(part)
        };

        position += part.length;

        return chunk;
      });

      return flatMap(chunks, chunk => {
        if (chunk.selected && chunk.whitespace && selectionStart === selectionEnd) {
          // insert 4 stars
          const position = chunk.start - selectionStart;
          return [
            nonBoldInternal(chunk.string.slice(0, position)),
            boldInternal('****'),
            nonBoldInternal(chunk.string.slice(position))
          ];
        } else if (chunk.selected) {
          return boldInternal(chunk.string);
        } else {
          return nonBoldInternal(chunk.string);
        }
      });
  };

  return token;
}

function flatMap(array, fn) {
  return array
    .map(fn)
    .reduce((result, current) => {
      if (Array.isArray(current)) {
        result.push(...current);
      } else {
        result.push(current);
      }

      return result;
    }, []);
}

function tokenInternal(string, isBold, start, end) {
  const token = {
    string,
    isBold
  };

  if (start != null) {
    token.start = start;
  }

  if (end != null) {
    token.end = end;
  }

  return token;
}
