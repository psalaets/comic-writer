export function letteringBoldCommand(cm) {
  const cursor = cm.getCursor();

  if (cm.somethingSelected()) {
    const selections = cm.listSelections();

    if (selections.length > 0) {
      const selection = normalizeSelection(selections[0]);
      const selectedText = cm.getRange(selection.start, selection.end);

      const letteringTokens = tokensOverlapped(cm, cursor.line, selection)



      if (isAllBold(letteringTokens)) {
        console.log('remove bold');

        const selectedText = letteringTokens
          .map(token => token.selected.string)
          .reduce((all, string) => all + string, '')

        const firstToken = letteringTokens[0];
        const lastToken = letteringTokens[letteringTokens.length - 1];

        const firstIsBold = isBoldLetteringContent(firstToken);
        const lastIsBold = isBoldLetteringContent(lastToken);

        let prefix = '';
        if (firstIsBold && !firstToken.selected.complete) {

        }

        const noBold = selectedText.replace(/\*\*/g, '');

        const start = letteringTokens[0].selected.start;
        const end = letteringTokens[letteringTokens.length - 1].selected.end;

        cm.replaceRange(noBold, {
          line: cursor.line,
          ch: start
        }, {
          line: cursor.line,
          ch: end
        });

      } else if (isAllPlain(letteringTokens)) {
        const selectedText = letteringTokens
          .map(token => token.selected.string)
          .reduce((all, string) => all + string, '');

        const start = letteringTokens[0].selected.start;
        const end = letteringTokens[letteringTokens.length - 1].selected.end;

        cm.replaceRange(`**${selectedText}**`, {
          line: cursor.line,
          ch: start
        }, {
          line: cursor.line,
          ch: end
        });
      } else {
        console.log('remove bold then wrap all in bold');
      }
    }
  } else {
    cm.replaceRange('****', {
      line: cursor.line,
      ch: cursor.ch
    });
    cm.setCursor({
      line: cursor.line,
      ch: cursor.ch + 2
    });
  }
}

// returns object with start and end, start is never to the right of end
function normalizeSelection(selection) {
  const { anchor, head } = selection;

  // on different lines
  if (anchor.line < head.line) {
    return {
      start: anchor,
      end: head
    };
  } else if (head.line < anchor.line) {
    return {
      start: head,
      end: anchor
    };
  }

  // on same line
  if (anchor.ch < head.ch) {
    return {
      start: anchor,
      end: head
    };
  } else if (head.ch < anchor.ch) {
    return {
      start: head,
      end: anchor
    };
  }

  // at same exact spot
  return {
    start: anchor,
    end: head
  };
}

function tokensOverlapped(cm, line, selection) {
  const lineTokens = cm.getLineTokens(line);

  return lineTokens
    .filter(token => {
      return (token.start > selection.start.ch && token.start < selection.end.ch)
        || (token.end > selection.start.ch && token.end <= selection.end.ch)
        || (token.start < selection.start.ch && token.end > selection.end.ch);
    })
    .map(token => {
      return {
        ...token,
        selected: selectedPortion(token, selection)
      };
    })
}

function selectedPortion(token, selection) {
  // selection hangs off front end of token
  if (selection.start.ch <= token.start && selection.end.ch < token.end) {
    return {
      string: token.string.slice(0, selection.end.ch - token.end),
      unselectedRight: token.string.slice(selection.end.ch - token.start),
      unselectedLeft: '',
      start: token.start,
      end: selection.end.ch,
      complete: false
    };
  }

  // selection hangs off back end of token
  if (selection.start.ch > token.start && selection.end.ch >= token.end) {
    return {
      string: token.string.slice(selection.start.ch - token.start),
      unselectedRight: '',
      unselectedLeft: token.string.slice(0, selection.start.ch - token.start),
      start: selection.start.ch,
      end: token.end,
      complete: false
    };
  }

  // selection is contained by token
  if (selection.start.ch > token.start && selection.end.ch < token.end) {
    return {
      string: token.string.slice(selection.start.ch - token.start, selection.end.ch - token.start),
      unselectedRight: token.string.slice(0, selection.start.ch - token.start),
      unselectedLeft: token.string.slice(selection.end.ch - token.start),
      start: selection.start.ch,
      end: selection.end.ch,
      complete: false
    };
  }

  // selection contains entire token
  return {
    string: token.string,
    unselectedRight: '',
    unselectedLeft: '',
    start: token.start,
    end: token.end,
    complete: true
  };
}

function isAllBold(tokens) {
  return tokens.every(isBoldLetteringContent);
}

function isAllPlain(tokens) {
  return tokens.every(isPlainLetteringContent);
}

function isBoldLetteringContent(token) {
  return isLetteringContent(token) && token.type.includes('lettering-bold');
}

function isPlainLetteringContent(token) {
  return isLetteringContent(token) && !token.type.includes('lettering-bold');
}

function isLetteringContent(token) {
  return token.type.includes('lettering-content');
}
