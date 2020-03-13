declare module 'marky' {
  /** High-resolution JavaScript timer based on performance.mark/measure */
  interface Marky {
    /** Begins recording. */
    mark(name: string): void;
    /**
     * Stops recording.
     *
     * @returns the PerformanceEntry (entryType=measure) that was just created
     */
    stop(name: string): PerformanceEntry;
    /** Gets a list of all measures ordered by startTime */
    getEntries(): Array<PerformanceEntry>;
    /**
     * Clear the entries.
     *
     * If the User Timing API is supported, this will delete all the mark and
     * measure entries from the timeline.
     */
    clear(): void;
  }

  const marky: Marky;

  export = marky;
}
