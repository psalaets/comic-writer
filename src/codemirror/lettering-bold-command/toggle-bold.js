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
    return {
      start: token.start,
      end: token.end,
      string: token.string,
      isBold: isBold(token)
    };
  });

  const transformedTokens = internalTokens.map(token => {
    if (overlaps(token, selectionStart, selectionEnd)) {
      if (overlapsFully(token, selectionStart, selectionEnd)) {
        if (token.isBold) {
          return nonBoldString(stripBoldMarkers(token.string));
        } else {
          return boldString('**' + token.string + '**');
        }
      } else if (overlapsFront(token, selectionStart, selectionEnd)) {
        const start = selectionStart.ch - token.start;
        const end = selectionEnd.ch - token.start;

        return [
          nonBoldString(stripBoldMarkers(token.string.slice(start, end))),
          boldString('**' + token.string.slice(end))
        ];
      } else if (overlapsEnd(token, selectionStart, selectionEnd)) {
        const start = selectionStart.ch - token.start;
        const end = selectionEnd.ch - token.start;

        return [
          boldString(token.string.slice(0, start) + '**'),
          nonBoldString(stripBoldMarkers(token.string.slice(start)))
        ];
      } else if (overlapsMiddle(token, selectionStart, selectionEnd)) {
        const start = selectionStart.ch - token.start;
        const end = selectionEnd.ch - token.start;

        return [
          boldString(token.string.slice(0, start) + '**'),
          nonBoldString(stripBoldMarkers(token.string.slice(start, end))),
          boldString('**' + token.string.slice(end))
        ];
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

  return reassignPositions(internalTokens[0].start, flattenedTokens);
}

function reassignPositions(start, tokens) {
  return tokens.map(token => {
    token.start = start;
    token.end = token.start + token.string.length;

    start += token.string.length;

    return token;
  });
}

function stripBoldMarkers(string) {
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

function unwrapBold(token) {
  return {
    start: token.start,
    end: token.end - 4,
    string: token.string.slice(2, -2),
    type: LETTERING_CONTENT
  };
}