import { start, end } from './measure';

/**
 * Wrap a function with perf timing.
 *
 * @param name Name to log in the timeline.
 * @param fn Function to wrap
 */
export function wrap<T, A extends any[]>(
  name: string,
  fn: (...a: A) => T
): ((...a: A) => T) {
  return function perfWrapper(...a: A) {
    start(name);
    const result = fn(...a);
    end(name);
    return result;
  };
}
