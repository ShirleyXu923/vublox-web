/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense, lazy } from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';

import { LoadingBlock } from '@shared/utils';

const PageNotFound = lazy(() => import('./404/PageNotFound'));
// const InternalServer = lazy(() => import('./500/InternalServer'));

function ErrorRouter() {
  return (
    <Suspense fallback={<LoadingBlock enabled />}>
      <Routes>
        <Route path="/404" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default ErrorRouter;
