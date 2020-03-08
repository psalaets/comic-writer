// state shape

export interface EditorState {

}

// component related

export interface EditorChangeEvent {
  /** New contents of the editor */
  value: string;
  /** Line numbers (1-based) that were changed, in ascending order. */
  changedLines: Array<number>
}
