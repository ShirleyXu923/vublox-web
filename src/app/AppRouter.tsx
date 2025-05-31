import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useTracking } from 'react-tracking';

import AuthRouter from '@components/auth/AuthRouter';
import ClientRouter from '@components/client/ClientRouter';
import ErrorRouter from '@components/error/ErrorRouter';
import { savePageViewRequest } from '@reducers/app/AppAction';
import { getUserDetailsRequest } from '@reducers/auth/AuthAction';
import useAppTheme from '@shared/hooks/useAppTheme';
import LoadingBlock from '@shared/utils/LoadingBlock';
import { NotificationContainer } from '@shared/utils/Notification';

import { ShareWrapper } from './providers/share-provider/ShareWrapper';

import 'react-toastify/dist/ReactToastify.css';

function Wrapper() {
  const location = useLocation();
  const dispatch = useDispatch<any>();
  const { Track } = useTracking(
    {},
    {
      dispatch: data => {
        dispatch(savePageViewRequest(data)).$promise
          .catch(() => {});
      },
    },
  );

  useLayoutEffect(() => {
    if (location.hash) return;
    document.documentElement.scrollTo(0, 0);
  }, [ location.pathname, location.hash ]);

  return (
    <Track>
      <Outlet />
    </Track>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Wrapper />}>
      {AuthRouter()}
      {ClientRouter()}

      <Route
        path="/errors/*"
        element={<ErrorRouter />}
      />

      <Route path="*" element={<Navigate to="/errors/404" replace />} />
    </Route>,
  ),
);

function AppRouter() {
  const dispatch = useDispatch<any>();
  const { initializeTheme, theme } = useAppTheme();

  const [ loading, setLoading ] = useState(false);

  const isLoggedIn = useSelector(({ Auth }) => !!Auth.accessToken);

  // component did mount
  useEffect(() => {
    const onMount = async () => {
      initializeTheme();

      if (isLoggedIn) {
        await dispatch(getUserDetailsRequest()).$promise;
      }
      setLoading(false);
    };

    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingBlock enabled />;

  return (
    <div className="h-100">
      <NotificationContainer />
      <ShareWrapper>
        <RouterProvider router={router} />
      </ShareWrapper>
      <ToastContainer
        position="bottom-right"
        theme={theme}
        autoClose={3000}
      />
    </div>
  );
}

export default AppRouter;
