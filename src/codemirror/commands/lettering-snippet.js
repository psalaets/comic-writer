export const ID = 'letteringSnippet';

export function install(CodeMirror) {
  if (ID in CodeMirror.commands) {
    throw new Error(`CodeMirror already has a command called ${ID}`);
  }

  CodeMirror.commands[ID] = letteringSnippetCommand;
};

function letteringSnippetCommand(cm) {

};