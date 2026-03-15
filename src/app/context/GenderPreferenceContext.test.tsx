import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  GenderPreferenceProvider,
  useGenderPreference,
} from "./GenderPreferenceContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GenderPreferenceProvider>{children}</GenderPreferenceProvider>
);

function mockLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get length() { return store.size; },
    key: vi.fn((index: number) => [...store.keys()][index] ?? null),
  };
}

describe("GenderPreferenceContext", () => {
  let storage: ReturnType<typeof mockLocalStorage>;

  beforeEach(() => {
    storage = mockLocalStorage();
    vi.stubGlobal("localStorage", storage);
  });

  it("defaults to null when localStorage is empty", () => {
    const { result } = renderHook(() => useGenderPreference(), { wrapper });
    expect(result.current.gender).toBeNull();
  });

  it("reads 'female' from localStorage on mount", () => {
    storage.setItem("listopad-gender-preference", "female");
    const { result } = renderHook(() => useGenderPreference(), { wrapper });
    expect(result.current.gender).toBe("female");
  });

  it("reads 'male' from localStorage on mount", () => {
    storage.setItem("listopad-gender-preference", "male");
    const { result } = renderHook(() => useGenderPreference(), { wrapper });
    expect(result.current.gender).toBe("male");
  });

  it("ignores invalid stored value", () => {
    storage.setItem("listopad-gender-preference", "invalid");
    const { result } = renderHook(() => useGenderPreference(), { wrapper });
    expect(result.current.gender).toBeNull();
  });

  it("setGender updates value and writes localStorage", () => {
    const { result } = renderHook(() => useGenderPreference(), { wrapper });

    act(() => {
      result.current.setGender("male");
    });

    expect(result.current.gender).toBe("male");
    expect(storage.setItem).toHaveBeenCalledWith("listopad-gender-preference", "male");
  });

  it("setGender(null) removes from localStorage", () => {
    storage.setItem("listopad-gender-preference", "female");
    const { result } = renderHook(() => useGenderPreference(), { wrapper });

    act(() => {
      result.current.setGender(null);
    });

    expect(result.current.gender).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith("listopad-gender-preference");
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useGenderPreference());
    }).toThrow("useGenderPreference must be used within a GenderPreferenceProvider");
  });
});
