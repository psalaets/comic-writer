import { SpreadChunk } from '../parser/types';

export function* spreadsAndChildren<NodeType, SpreadType>(
  chunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;

    for (const child of chunk.children) {
      yield child;
    }
  }
}

export function* onlySpreads<NodeType, SpreadType>(
  chunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;
  }
}
