'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for keyboard input management.
 * Includes `resetKeys()` which requires any held keys to be released
 * before they can trigger movement again.
 */
export function useKeyboard(active: boolean = true) {
  const pressedKeys = useRef<Record<string, boolean>>({});
  const mustReleaseKeys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!active) {
      pressedKeys.current = {};
      mustReleaseKeys.current = {};
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const key = e.key;
      const lower = key.toLowerCase();
      const code = e.code;

      // If the key was marked as needing release (e.g. from a scene transition or flower pickup),
      // ignore held down / repeat keydown until the physical key has been released!
      if (!mustReleaseKeys.current[key] && !mustReleaseKeys.current[lower] && !mustReleaseKeys.current[code]) {
        pressedKeys.current[key] = true;
        pressedKeys.current[lower] = true;
        pressedKeys.current[code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key;
      const lower = key.toLowerCase();
      const code = e.code;

      pressedKeys.current[key] = false;
      pressedKeys.current[lower] = false;
      pressedKeys.current[code] = false;

      // Key was released, so now it is allowed to be pressed again
      mustReleaseKeys.current[key] = false;
      mustReleaseKeys.current[lower] = false;
      mustReleaseKeys.current[code] = false;
    };

    const handleBlur = () => {
      pressedKeys.current = {};
      mustReleaseKeys.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [active]);

  const isPressed = useCallback(
    (key: string) => !!pressedKeys.current[key],
    [],
  );

  const isAnyPressed = useCallback(
    (...keys: string[]) => keys.some((k) => !!pressedKeys.current[k]),
    [],
  );

  /**
   * Immediately halts movement and requires the player to physically release
   * and re-press the key to move again.
   */
  const resetKeys = useCallback(() => {
    for (const key in pressedKeys.current) {
      if (pressedKeys.current[key]) {
        mustReleaseKeys.current[key] = true;
      }
    }
    pressedKeys.current = {};
  }, []);

  return { pressedKeys, isPressed, isAnyPressed, resetKeys };
}
