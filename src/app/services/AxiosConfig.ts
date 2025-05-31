import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Path } from 'path-parser';

import { store } from '@app/store';
import appConfig from '@config/app';
import { clearUserTokenAction } from '@reducers/auth/AuthActionConfig';

const { whitelistUrl } = appConfig;

const configuredAxios = axios.create();

configuredAxios.defaults.headers.common = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

configuredAxios.interceptors.request.use(
  async (config) => {
    const c = config;
    const state = store.getState();
    const { accessToken } = state.Auth;
    const headers: AxiosRequestHeaders = c.headers || {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // temp
    headers['x-client-name'] = 'vublox';

    c.headers = headers;
    return c;
  },
  (error) => Promise.reject(error),
);

function interceptSuccess(response: AxiosResponse) {
  // success interception logic here
  return response;
}

function isWhiteListed(url = '') {
  const pathname = url.split('/api')[1];
  return whitelistUrl.some((path) => new Path(path).test(pathname));
}

function interceptError(err: AxiosError) {
  const { response } = err;
  // connection refuse
  if (!response) {
    // eslint-disable-next-line no-console
    console.log('response', response);
  } else if (response.status === 401) { // unauthorized
    // remove the saved token and user data then proceed
    // on redirecting to root page (or login)
    // refresh the page and redirect to root page
    if (!isWhiteListed(response.config.url)) {
      store.dispatch(clearUserTokenAction());
      window.location.href = '/auth';
    }
  }

  return Promise.reject(err);
}

// interceptors
configuredAxios.interceptors.response.use(interceptSuccess, interceptError);

export default configuredAxios;
