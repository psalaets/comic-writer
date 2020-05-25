export class State {
  isInCaptionText: boolean;
  isInDialogueText: boolean;
  inLettering: boolean;
  subjectDone: boolean;
  allowsBoldInContent: boolean;
  modifierDone: boolean;
  inModifier: boolean;
  contentDone: boolean;
  inContent: boolean;
  pagesSeen: number;

  constructor() {
    this.isInCaptionText = false;
    this.isInDialogueText = false;
    this.inLettering = false;
    this.subjectDone = false;
    this.allowsBoldInContent = false;
    this.modifierDone = false;
    this.inModifier = false;
    this.contentDone = false;
    this.inContent = false;
    this.pagesSeen = 0;
  }

  copy() {
    const copied = new State();
    copied.isInCaptionText     = this.isInCaptionText;
    copied.isInDialogueText    = this.isInDialogueText;
    copied.inLettering         = this.inLettering;
    copied.subjectDone         = this.subjectDone;
    copied.allowsBoldInContent = this.allowsBoldInContent;
    copied.modifierDone        = this.modifierDone;
    copied.inModifier          = this.inModifier;
    copied.contentDone         = this.contentDone;
    copied.inContent           = this.inContent;
    copied.pagesSeen           = this.pagesSeen;
    return copied;
  }

  resetLineState() {
    this.isInCaptionText = false;
    this.isInDialogueText = false;
    this.inLettering = false;
    this.subjectDone = false;
    this.allowsBoldInContent = false;
    this.modifierDone = false;
    this.inModifier = false;
    this.contentDone = false;
    this.inContent = false;
  }
}
