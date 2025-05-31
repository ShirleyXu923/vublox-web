import { useEffect, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface UseNavigationWarningOptions {
  /**
   * Whether to prevent navigation (when true, navigation attempts will show warning)
   */
  isActive: boolean;

  /**
   * Optional callback to run when user confirms they want to leave anyway
   * Called before the navigation occurs
   */
  onContinueNavigation?: (navigationType: 'back' | 'refresh' | 'blocker' | null) => void;
}

/**
 * Hook to prevent navigation when a process is active and show a warning modal
 * when user attempts to navigate away
 */
const useNavigationWarning = ({
  isActive,
  onContinueNavigation,
}: UseNavigationWarningOptions) => {
  const [ showWarningModal, setShowWarningModal ] = useState(false);
  const [ navigationType, setNavigationType ] = useState<'back' | 'refresh' | 'blocker' | null>(null);
  const popStateHandlerRef = useRef<((e: PopStateEvent) => void) | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | undefined => {
      if (isActive && !isNavigatingRef.current) {
        setNavigationType('refresh');
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };

    const handlePopState = (e: PopStateEvent): void => {
      if (isActive && !isNavigatingRef.current && e.state) {
        e.preventDefault();
        window.history.pushState(null, document.title, window.location.href);
        setNavigationType('back');
        setShowWarningModal(true);
      }
    };

    // Store the handler in the ref
    popStateHandlerRef.current = handlePopState;

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Push a new state to ensure popstate works correctly
    if (isActive && !isNavigatingRef.current) {
      window.history.pushState(null, document.title, window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [ isActive ]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isActive
      && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === 'blocked' && isActive) {
      setShowWarningModal(true);
      setNavigationType('blocker');
    }
  }, [ blocker, isActive ]);

  const handleContinueNavigation = () => {
    setShowWarningModal(false);

    if (onContinueNavigation) {
      onContinueNavigation(navigationType);
    }

    isNavigatingRef.current = true;

    if (navigationType === 'back') {
      if (popStateHandlerRef.current) {
        window.removeEventListener('popstate', popStateHandlerRef.current);
      }
      try {
        // First try going back 2 steps to account for the extra history entry we added
        window.history.go(-2);
      } catch (e) {
        try {
          // Fallback to going back 1 step
          window.history.go(-1);
        } catch (e2) {
          // Silent fail
        }
      }
    } else if (navigationType === 'refresh') {
      window.location.reload();
    }

    if (navigationType === 'blocker') {
      blocker?.proceed?.();
    }

    setNavigationType(null);
  };

  const closeWarningModal = () => {
    setShowWarningModal(false);
    setNavigationType(null);

    if (navigationType === 'blocker') {
      blocker?.reset?.();
    }
  };

  return {
    showWarningModal,
    closeWarningModal,
    handleContinueNavigation,
  };
};

export default useNavigationWarning;
