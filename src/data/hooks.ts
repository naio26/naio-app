import { DependencyList, useEffect, useState } from 'react';

/** Loads something from api.ts and re-renders when it arrives. */
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList): T | undefined {
  const [data, setData] = useState<T>();
  useEffect(() => {
    let alive = true;
    load().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
