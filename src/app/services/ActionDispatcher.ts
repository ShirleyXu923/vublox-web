import { AxiosRequestConfig } from 'axios';

import { AppDispatch } from '@app/store';

import {
  getRequest, postRequest, deleteRequest, putRequest, patchRequest,
} from './RequestService';

const generateGetAction = (
  action: any,
  url: string,
  options: AxiosRequestConfig & { queryParams?:any } = {},
  params = {},
) => (dispatch: AppDispatch) => {
  const queryParams = options.queryParams || params;
  const request = getRequest(url, options);
  request.$promise
    .then((response) => dispatch({
      type: action,
      payload: response.data,
      params: queryParams,
    }))
    .catch(() => {});
  return request;
};

const generatePostAction = (
  action: any,
  url: string,
  params = {},
  options: AxiosRequestConfig = {},
) => (dispatch: AppDispatch) => {
  const request = postRequest(url, params, options);
  request.$promise
    .then((response) => dispatch({ type: action, payload: response.data, params }))
    .catch(() => {});

  return request;
};

const generateDeleteAction = (
  action: any,
  url: string, params = {},
) => (dispatch: AppDispatch) => {
  const request = deleteRequest(url, params);
  request.$promise
    .then((response) => dispatch({ type: action, payload: response.data, params }))
    .catch(() => {});
  return request;
};

const generatePutAction = (
  action: any,
  url: string,
  params = {},
  options: AxiosRequestConfig = {},
) => (dispatch: AppDispatch) => {
  const request = putRequest(url, params, options);
  request.$promise
    .then((response) => dispatch({ type: action, payload: response.data, params }))
    .catch(() => {});

  return request;
};

const generatePatchAction = (
  action: any,
  url: string,
  params = {},
  options:AxiosRequestConfig = {}) => (dispatch: AppDispatch) => {
  const request = patchRequest(url, params, options);
  request.$promise
    .then((response) => dispatch({ type: action, payload: response.data, params }))
    .catch(() => {});

  return request;
};

const generateAction = (action: any, payload: any = {}) => (dispatch: AppDispatch) => dispatch({
  type: action, payload,
});

export {
  generateGetAction,
  generatePostAction,
  generateDeleteAction,
  generatePutAction,
  generatePatchAction,
  generateAction,
};
