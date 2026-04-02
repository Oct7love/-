import { useEffect, useRef } from "react";
import { useDebounce } from "./use-debounce";

export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  options: { delay?: number; enabled?: boolean } = {}
) {
  const { delay = 2000, enabled = true } = options;
  const debouncedData = useDebounce(data, delay);
  const isFirstRender = useRef(true);
  const isSaving = useRef(false);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled || isSaving.current) return;

    isSaving.current = true;
    onSaveRef.current(debouncedData).finally(() => {
      isSaving.current = false;
    });
  }, [debouncedData, enabled]);
}
