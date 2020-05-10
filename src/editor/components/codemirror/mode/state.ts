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
    return copied;
  }

  reset() {
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
