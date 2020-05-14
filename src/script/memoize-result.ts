/**
 * Memoize the result of a combiner function.
 *
 * This allows us to return a memoized value when inputs to the combiner have
 * changed but the result is the same (as determined by custom logic) as the
 * previous result.
 *
 * @param combiner - Combiner to wrap
 * @param isEqual - Custom logic that defines what "the same" means
 */
export function memoizeResult<CombinerResultType, CombinerArgumentType extends any[]>(
  combiner: (...args: CombinerArgumentType) => CombinerResultType,
  isEqual: (lastResult: CombinerResultType | null, nextResult: CombinerResultType) => boolean
) {
  let lastResult: CombinerResultType;

  return function memoized(...args: CombinerArgumentType): CombinerResultType {
    const nextResult = combiner(...args);

    if (isEqual(lastResult, nextResult)) {
      return lastResult;
    } else {
      lastResult = nextResult;
      return nextResult;
    }
  };
}
