import { useState, useRef, useCallback } from "react";

export function useDragReorder<T>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent) => {
      dragRef.current = index;
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverIndex(index);
    },
    []
  );

  const handleDrop = useCallback(
    (index: number) => (e: React.DragEvent) => {
      e.preventDefault();
      const from = dragRef.current;
      if (from === null || from === index) return;

      const newItems = [...items];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(index, 0, moved);
      onReorder(newItems);

      setDragIndex(null);
      setOverIndex(null);
      dragRef.current = null;
    },
    [items, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  }, []);

  return {
    dragIndex,
    overIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
