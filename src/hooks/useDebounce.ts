import { useRef, useCallback, useEffect } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return debouncedFn;
}

export function useAutosave(saveFn: () => Promise<void>, delay: number = 1000) {
  const debouncedSave = useDebounce(saveFn, delay);
  return debouncedSave;
}
