import * as Sentry from '@sentry/react';
import * as firebase from 'firebase/app';
import React, { Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { v4 as uuidv4 } from 'uuid';

import appConfig from '@config/app';
import firebaseConfig from '@config/firebase';
import { stringEscape } from '@shared/helpers';
import useCurrentLocation from '@shared/hooks/useCurrentLocation';
import { LoadingBlock } from '@shared/utils';
import CacheBuster from '@shared/utils/CacheBuster';

import { AppProvider } from './AppContext';
import { store, persistor } from './store';

import 'react-datepicker/dist/react-datepicker.css';

(window as any)._AMapSecurityConfig = {
  securityJsCode: appConfig.amap.securityKey,
};

const urlPropagate = new RegExp(`^${stringEscape(appConfig.apiUrl)}`);

firebase.initializeApp(firebaseConfig);

Sentry.init({
  dsn: appConfig.sentry.dsn,
  environment: appConfig.env,
  normalizeDepth: 10,
  enabled: (appConfig.env as any) !== 'local',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [ 'localhost', urlPropagate ],
  // Session Replay
  // This sets the sample rate at 10%. You may want to change it to
  // 100% while in development and then sample at a lower rate in production.
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate
  // to 100% when sampling sessions where errors occur.
  replaysOnErrorSampleRate: 1.0,
});

const LazyAppRouter = lazy(() => import('@app/AppRouter'));
function App() {
  useCurrentLocation(true);
  useEffect(() => {
    const deviceUuid = localStorage.getItem('DEVICE_UUID');

    if (!deviceUuid) {
      try {
        localStorage.setItem('DEVICE_UUID', uuidv4());
      } catch (error) {
        //
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CacheBuster>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<LoadingBlock />}>
            <AppProvider>
              <LazyAppRouter />
            </AppProvider>
          </Suspense>
        </PersistGate>
      </Provider>
    </CacheBuster>
  );
}

export default App;
