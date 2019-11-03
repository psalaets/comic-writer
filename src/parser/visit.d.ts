import * as parse from './index';

export = visit;

declare function visit(nodes: string, visitor: visit.Visitor): void;

declare namespace visit {
  interface Visitor {
    enterSpread?: (spread: parse.Spread) => void,
    exitSpread?: (spread: parse.Spread) => void,

    enterPanel?: (panel: parse.Panel) => void,
    exitPanel?: (panel: parse.Panel) => void,

    enterDialogue?: (dialogue: parse.Dialogue) => void,
    exitDialogue?: (dialogue: parse.Dialogue) => void,

    enterCaption?: (caption: parse.Caption) => void,
    exitCaption?: (caption: parse.Caption) => void,

    enterSfx?: (sfx: parse.Sfx) => void,
    exitSfx?: (sfx: parse.Sfx) => void,

    enterMetadata?: (metadata: parse.Metadata) => void,
    exitMetadata?: (metadata: parse.Metadata) => void,

    enterParagraph?: (paragraph: parse.Paragraph) => void,
    exitParagraph?: (paragraph: parse.Paragraph) => void,
  }
}
