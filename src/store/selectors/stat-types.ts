import {
  SPREAD,
  PANEL,
  DIALOGUE,
  CAPTION
} from '../../comic-part-names';

export interface SpreadStats {
  type: typeof SPREAD,
  lineNumber: number,
  wordCount: number,
  panelCount: number,
  speakers: string[]
}

export interface PanelStats {
  type: typeof PANEL,
  lineNumber: number,
  wordCount: number
}

export interface DialogueStats {
  type: typeof DIALOGUE,
  lineNumber: number,
  wordCount: number
}

export interface CaptionStats {
  type: typeof CAPTION,
  lineNumber: number,
  wordCount: number
}

export type ComicStats = SpreadStats | PanelStats | DialogueStats | CaptionStats;
