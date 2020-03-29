// state shape

export interface EditorState {

}

// component related

export interface EditorChangeEvent {
  /** New contents of the editor */
  lines: Array<string>;
}
