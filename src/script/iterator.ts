import { SpreadChunk } from '../parser/types';

export function* spreadsAndChildren<SpreadType, NodeType>(
  chunks: Array<SpreadChunk<SpreadType, NodeType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;
    yield* chunk.children;
  }
}

export function* onlySpreads<SpreadType, NodeType>(
  chunks: Array<SpreadChunk<SpreadType, NodeType>>
) {
  for (const chunk of chunks) {
    yield chunk.spread;
  }
}
