import wordcount from 'wordcount';

export default function countWords(tree) {
  let text = joinText(tree);
  // words with apostrophes count as one word
  text = text.replace('\'', '');
  return wordcount(text);
}

function joinText(thing) {
  if (Array.isArray(thing)) {
    return thing.reduce((joined, current) => joined + joinText(current), '');
  } else if (thing && typeof thing === 'object') {
    return joinText(thing.content);
  } else if (typeof thing === 'string') {
    return thing;
  } else {
    throw new Error(`Can't join text of ${thing}`);
  }
}