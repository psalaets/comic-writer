import token from './token';

export default function create(cmConfig) {
  return {
    startState() {
      return {
        isInCaptionText: false,
        isInDialogueText: false
      };
    },
    indent: () => 0,
    token
  };
}