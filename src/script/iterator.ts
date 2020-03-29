import { SpreadChunk } from '../parser/types';

export function* spreadsAndChildren<NodeType, SpreadType>(
  spreadChunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of spreadChunks) {
    yield chunk.spread;

    for (const child of chunk.children) {
      yield child;
    }
  }
}

export function* onlySpreads<NodeType, SpreadType>(
  spreadChunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of spreadChunks) {
    yield chunk.spread;
  }
}
