/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect, useRef } from 'react';

export default function useDeepEffect(fn, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) => _.isEqual(obj, deps[index]),
    );

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return fn();
    }
  }, deps);
}
