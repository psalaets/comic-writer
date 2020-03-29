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
