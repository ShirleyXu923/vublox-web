import React, { lazy } from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  Route,
  useLocation,
} from 'react-router-dom';

const AuthPage = lazy(() => import('./AuthPage'));
const ForgotPasswordPage = lazy(() => import('./forgot-password/ForgotPasswordPage'));
const SignUpSuccessPage = lazy(() => import('./sign-up-success/SignUpSuccessPage'));
const Verification = lazy(() => import('./verification/Verification'));

function AuthRoute() {
  const isLoggedIn = useSelector(({ Auth }) => !!Auth.accessToken);
  const location = useLocation();

  if (isLoggedIn && location.pathname !== '/verify') {
    return <Navigate to="/world-events" state={{ from: location }} />;
  }

  return <Outlet />;
}

function AuthRouter() {
  return (
    <Route>
      <Route element={<AuthRoute />}>
        <Route
          path="/auth"
          element={<AuthPage />}
        />
        <Route
          path="/sign-up/success"
          element={<SignUpSuccessPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
      </Route>

      <Route
        path="/verify/:token"
        element={<Verification />}
      />
    </Route>
  );
}

AuthRouter.propTypes = {

};

export default AuthRouter;
