import React, { useRef, useEffect } from 'react';

// specific use of the generic hook
export function useNeedsScrollCallback<TargetType extends HTMLElement>(cb: (needsScroll: boolean) => void) {
  return useIntersectionObserverCallback<TargetType>({
    callback: entries => cb(entries[0].intersectionRatio < 1),
    rootMargin: '-70px 0px -70px 0px',
    threshold: [1]
  })
}

interface HookOptions {
  /**
   * Invoked when target's intersection with root crosses 1 or more thresholds.
   */
  callback: (entries: Array<IntersectionObserverEntry>) => void;
  /**
   * Ref of the scrollable element. Must be an ancestor of the target.
   *
   * Passing null or not setting this means monitor intersections with viewport.
   */
  root?: React.RefObject<HTMLElement> | null;
  /**
   * Margin added to root's intersection box for intersect checking purposes.
   * Similar to the css margin value. Negative pixel margin values go inwards.
   */
  rootMargin?: string;
  /**
   * Invoke callback when the intersection % crosses this threshold.
   */
  threshold?: number | Array<number>;
}

/**
 * Set up a callback with an intersection observer for an element.
 *
 * @type TargetType - Type of the target element
 * @param options
 * @returns Ref to associate with the target element
 */
export function useIntersectionObserverCallback<TargetType extends HTMLElement>(options: HookOptions): React.RefObject<TargetType> {
  const ref = useRef<TargetType>(null);

  useEffect(() => {
    // keeping this in a variable so it can be cleaned up, as per react warning
    const refCurrent = ref.current;

    const observer = new IntersectionObserver(
      entries => options.callback(entries),
      {
        root: options.root?.current,
        rootMargin: options.rootMargin,
        threshold: options.threshold
      }
    );

    if (ref.current){
      observer.observe(ref.current);
    } else {
      throw new Error('Component rendered but ref doesn\'t have an element, did you forget to set the ref? e.g. <div ref={ref}>');
    }

    return () => {
      observer.unobserve(refCurrent!);
    }
  }, [ref, options]);

  return ref;
}
