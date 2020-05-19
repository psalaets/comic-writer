import { LineWidget, LineHandle } from 'codemirror';

/**
 * The type returned from `cm.lineInfo(line: number | LineHandle)`
 *
 * (CodeMirror typings don't have a named type for this yet so this will have
 * to suffice)
 */
export interface LineInfo {
  line: number;
  handle: LineHandle;
  text: string;
  /** Object mapping gutter IDs to marker elements. */
  gutterMarkers: {
    [id: string]: any
  };
  textClass: string;
  bgClass: string;
  wrapClass: string;
  /** Array of line widgets attached to this line. */
  widgets: Array<LineWidget>;
}
