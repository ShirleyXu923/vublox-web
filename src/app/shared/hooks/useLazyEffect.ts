import * as React from 'react';

const useLazyEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const initializeRef = React.useRef<boolean>(false);

  React.useEffect((...args) => {
    if (initializeRef.current) {
      effect(...args);
    } else {
      initializeRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useLazyEffect;
