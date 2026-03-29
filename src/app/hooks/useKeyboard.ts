import { useEffect } from 'react';

interface UseKeyboardProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onUp: () => void;
  onSpace: () => void;
  onSpaceUp: () => void;
  onPause: () => void;
  enabled: boolean;
}

export function useKeyboard({
  onLeft,
  onRight,
  onDown,
  onUp,
  onSpace,
  onSpaceUp,
  onPause,
  enabled,
}: UseKeyboardProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onUp();
          break;
        case ' ':
          e.preventDefault();
          onSpace();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          onPause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        onSpaceUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, onLeft, onRight, onDown, onUp, onSpace, onSpaceUp, onPause]);
}