export function wrapSelection(
  line: string,
  selectionStart: number,
  selectionEnd: number,
  front: string,
  back: string
): string {
  const beforeSelected = line.slice(0, selectionStart);
  const selected       = line.slice(selectionStart, selectionEnd);
  const afterSelected  = line.slice(selectionEnd);

  return [
    beforeSelected,
    front,
    selected,
    back,
    afterSelected
  ].join('');
}
