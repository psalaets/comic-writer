import wordcount from 'wordcount';

type TextChunk = string | { content: string };
type Joinable = TextChunk | Array<TextChunk>;

export default function countWords(tree: Joinable) {
  let text = joinText(tree);
  // words with apostrophes count as one word
  text = text.replace('\'', '');
  return wordcount(text);
}

function joinText(thing : Joinable): string {
  if (Array.isArray(thing)) {
    return thing.reduce<string>((joined, current) => joined + joinText(current), '');
  } else if (thing && typeof thing === 'object') {
    return joinText(thing.content);
  } else if (typeof thing === 'string') {
    return thing;
  } else {
    throw new Error(`Can't join text of ${thing}`);
  }
}