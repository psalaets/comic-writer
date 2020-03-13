declare module 'marky' {
  /** Begins recording. */
  export function mark(name: string): void;
  /**
   * Stops recording.
   *
   * @returns the PerformanceEntry (entryType=measure) that was just created
   */
  export function stop(name: string): PerformanceEntry;

  /** Gets a list of all measures ordered by startTime */
  export function getEntries(): Array<PerformanceEntry>;

  /**
   * Clear the entries.
   *
   * If the User Timing API is supported, this will delete all the mark and
   * measure entries from the timeline.
   */
  export function clear(): void;
}
