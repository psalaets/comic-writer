import { SpreadChunk } from '../parser/types';

export function* spreadsAndChildren<NodeType, SpreadType>(
  chunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;
    yield* chunk.children;
  }
}

export function* onlySpreads<NodeType, SpreadType>(
  chunks: Array<SpreadChunk<NodeType, SpreadType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;
  }
}
