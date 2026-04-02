import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("should debounce value updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: "c" });
    act(() => { vi.advanceTimersByTime(100); });

    rerender({ value: "d" });
    expect(result.current).toBe("a");

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe("d");
  });

  it("should use default delay of 500ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });

    act(() => { vi.advanceTimersByTime(400); });
    expect(result.current).toBe(1);

    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe(2);
  });
});
