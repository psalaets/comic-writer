import {
  LETTERING_CONTENT,
  LETTERING_BOLD,
} from '../comic-writer-mode/token';

/*
token:

start
end
string
type - space separated class names


bold
not
bold not
not bold
not bold not
bold not bold

*/

export function toggle(tokens, selectionStart, selectionEnd) {
  const internalTokens = tokens.map(token => {
    if (isBold(token)) {
      return boldInternal(token.string, token.start, token.end);
    } else {
      return nonBoldInternal(token.string, token.start, token.end);
    }
  });

  const transformedTokens = internalTokens.map(token => {

    if (overlaps(token, selectionStart, selectionEnd)) {
      if (token.isBold) {
        return nonBoldInternal(unwrapBold(token.string));
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

function contains(token, ch) {
  return token.start <= ch && token.end >= ch;
}

function overlapsFully(token, start, end) {
  return token.start === start.ch && token.end === end.ch;
}

function overlapsMiddle(token, start, end) {
  return token.start < start.ch && end.ch < token.end;
}

function overlapsFront(token, start, end) {
  return token.start === start.ch && end.ch < token.end;
}

function overlapsEnd(token, start, end) {
  return token.start < start.ch && end.ch === token.end;
}

function overlaps(token, start, end) {
  return (token.start >= start.ch && token.start < end.ch)
    || (token.end > start.ch && token.end <= end.ch)
    || (token.start < start.ch && token.end > end.ch);
}

function justCursor(selectionStart, selectionEnd) {
  return selectionStart.ch === selectionEnd.ch;
}

function isBold(token) {
  return token.type && token.type.includes(LETTERING_BOLD);
}

function boldInternal(string, start = null, end = null) {
  const token = tokenInternal(string, true, start, end);

  token.toggle = function toggle(start, end) {

  };

  return token;
}

function nonBoldInternal(string, start = null, end = null) {
  const token = tokenInternal(string, false, start, end);

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
          selected
        };

        position += part.length;

        return chunk;
      });

      return chunks
        .map(chunk => {
          if (chunk.selected) {
            return boldInternal(chunk.string);
          } else {
            return nonBoldInternal(chunk.string);
          }
        });
  };

  return token;
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

function boldString(string) {
  return {
    string,
    type: `${LETTERING_BOLD} ${LETTERING_CONTENT}`
  };
}

function nonBoldString(string) {
  return {
    string,
    type: LETTERING_CONTENT
  };
}
