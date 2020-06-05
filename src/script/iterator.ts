import * as parts from '../comic-part-types';
import { LocatedSpread } from './types';

export function* spreadsAndChildren(spreads: Array<LocatedSpread>) {
  for (const spread of spreads) {
    yield spread;

    for (const child of spread.children) {
      yield child;

      if (child.type === parts.PANEL) {
        yield* child.children;
      }
    }
  }
}
