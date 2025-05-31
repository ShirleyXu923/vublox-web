import Axios, { AxiosRequestConfig } from 'axios';

import appConfig from '@config/app';

import axios from './AxiosConfig';

const { apiUrl } = appConfig;

export const convertToQueryParams = (queryParams: any) => {
  const paramsArray = Object.entries(queryParams).reduce((data: any[], [ key, value ]) => {
    // if value is array
    if (Array.isArray(value)) {
      value.forEach((arrayValue, index) => {
        data.push(`${key}[${index}]=${arrayValue}`);
      });
    } else if (value && typeof value === 'object') {
      Object.keys(value as any).forEach((objKey) => {
        data.push(`${key}[${objKey}]=${(value as any)[objKey]}`);
      });
    } else {
      // if not array just proceed as normal params
      data.push(`${key}=${value}`);
    }

    return data;
  }, []);

  return `?${paramsArray.join('&')}`;
};

const handleError = (error: any) => {
  // if it is manually cancelled
  if (Axios.isCancel(error)) {
    // eslint-disable-next-line no-console
    console.log('Request canceled in ', error.message);
  }
  // if not return the error
  return Promise.reject(error);
};

export const getRequest = (route: string, options: AxiosRequestConfig & {
  queryParams?: any
}) => {
  let queryParams = '';
  if (options && options.queryParams) {
    queryParams = convertToQueryParams(options.queryParams);
    // eslint-disable-next-line no-param-reassign
    delete options.queryParams;
  }

  const url = `${apiUrl}/${route}${queryParams}`;

  const source = Axios.CancelToken.source();
  const promise = axios.get(url, {
    ...options,
    cancelToken: source.token,
  }).catch((error) => handleError(error));

  return {
    $promise: promise,
    cancel: () => source.cancel(url),
  };
};

export const postRequest = (route: string, params: any, options: AxiosRequestConfig) => {
  const source = Axios.CancelToken.source();

  const url = `${apiUrl}/${route}`;

  const promise = axios.post(url, params, {
    ...options,
    cancelToken: source.token,
  }).catch((error) => handleError(error));

  return {
    $promise: promise,
    cancel: () => source.cancel(url),
  };
};

export const deleteRequest = (route: string, options: AxiosRequestConfig) => {
  const source = Axios.CancelToken.source();

  const url = `${apiUrl}/${route}`;

  const promise = axios.delete(url, {
    ...options,
    cancelToken: source.token,
  })
    .catch((error) => handleError(error));

  return {
    $promise: promise,
    cancel: () => source.cancel(url),
  };
};

export const putRequest = (route: string, params: any, options: AxiosRequestConfig) => {
  const source = Axios.CancelToken.source();

  const url = `${apiUrl}/${route}`;

  const promise = axios.put(url, params, {
    ...options,
    cancelToken: source.token,
  }).catch((error) => handleError(error));

  return {
    $promise: promise,
    cancel: () => source.cancel(url),
  };
};

export const patchRequest = (route: string, params: any, options: AxiosRequestConfig) => {
  const source = Axios.CancelToken.source();

  const url = `${apiUrl}/${route}`;

  const promise = axios.patch(url, params, {
    ...options,
    cancelToken: source.token,
  }).catch((error) => handleError(error));

  return {
    $promise: promise,
    cancel: () => source.cancel(url),
  };
};
