import {
  useState, useEffect, useRef, RefObject, MouseEvent,
} from 'react';

export default function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  initialState = false,
): {
    ref: RefObject<T>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
  } {
  const [ isOpen, setIsOpen ] = useState(initialState);
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (
        ref.current
        && event.target instanceof Node
        && !ref.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ isOpen ]);

  const toggle = () => setIsOpen(prev => !prev);

  return {
    ref,
    isOpen,
    setIsOpen,
    toggle,
  };
}
