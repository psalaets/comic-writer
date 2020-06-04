import { SpreadContent } from '../parser/types';
import { PanelCount, WordCount } from '../script/types';

/*
 * Custom deep-equals implementations for various things.
 *
 * We use old school for loops here for speed.
 */

export function strings(a: Array<string>, b: Array<string>): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export function spreadContent(chunkA: SpreadContent, chunkB: SpreadContent): boolean {
  if (chunkA == null) return chunkB == null;
  if (chunkB == null) return chunkA == null;

  if (chunkA.spread !== chunkB.spread) {
    return false;
  }

  return strings(chunkA.children, chunkB.children);
}

export function panelCounts(countsA: Array<PanelCount>, countsB: Array<PanelCount>): boolean {
  if (countsA == null) return countsB == null;
  if (countsB == null) return countsA == null;

  if (countsA.length !== countsB.length) {
    return false;
  }

  for (let i = 0; i < countsA.length; i++) {
    const oldCount = countsA[i];
    const newCount = countsB[i];

    if (oldCount.count !== newCount.count) return false;
    if (oldCount.lineNumber !== newCount.lineNumber) return false;
  }

  return true;
}

export function wordCounts(countsA: Array<WordCount>, countsB: Array<WordCount>): boolean {
  if (countsA == null) return countsB == null;
  if (countsB == null) return countsA == null;

  if (countsA.length !== countsB.length) {
    return false;
  }

  for (let i = 0; i < countsA.length; i++) {
    const countA = countsA[i];
    const countB = countsB[i];

    if (countA.count !== countB.count) return false;
    if (countA.lineNumber !== countB.lineNumber) return false;
    if (countA.isSpread !== countB.isSpread) return false;
  }

  return true;
}
