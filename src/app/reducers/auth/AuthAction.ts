import { osName } from 'react-device-detect';

import {
  generatePostAction, generateGetAction, generateAction,
  generatePatchAction,
  generatePutAction,
  generateDeleteAction,
} from '@services/ActionDispatcher';

import {
  loginAction,
  logoutAction,
  clearUserTokenAction,
  getUserDetailsAction,
  registerAction,
  resendVerificationAction,
  verifyEmailAction,
  sendVerificationCodeAction,
  verifyCodeAction,
  changePasswordAction,
  changeNewPasswordAction,
  changeAccountAction,
  externalLoginAction,
  updateImageAction,
  getProfileTimelineAction,
  verifyUserEmailAction,
  updateSettingsAction,
  deleteAccountAction,
  updateClientSettingsAction,
  getNotificationsAction,
  readNotificationAction,
  deleteNotificationsAction,
  addNotificationAction,
} from './AuthActionConfig';

const deviceData = () => ({
  device_uuid: localStorage.getItem('DEVICE_UUID'),
  device_os: osName,
  ip_address: localStorage.getItem('IP_ADDRESS'),
});

const clearUserTokenRequest = () => generateAction(
  clearUserTokenAction,
);
const changeAccountRequest = (account: any) => generateAction(changeAccountAction, account);

// action request dispatchers
const loginRequest = (data: any) => generatePostAction(
  // action name
  loginAction,
  // url
  'login',
  { ...data, ...deviceData() },
);

const externalLoginRequest = (data: any) => generatePostAction(
  // action name
  externalLoginAction,
  // url
  'login/external',
  { ...data, ...deviceData() },
);

const logoutRequest = () => generateGetAction(
  // action name
  logoutAction,
  // url
  'logout',
  { queryParams: deviceData() },
);

const getUserDetailsRequest = () => generateGetAction(
  // action name
  getUserDetailsAction,
  // url
  'me',
  { queryParams: deviceData() },
);

const getProfileTimelineRequest = (queryParams: any) => generateGetAction(
  // action name
  getProfileTimelineAction,
  // url
  `users/profile/${queryParams.id}/timeline`,
  // params
  { queryParams },
);

const registerRequest = (data: any) => generatePostAction(
  // action name
  registerAction,
  // url
  'register',
  { ...data, ...deviceData() },
);

const verifyEmailRequest = (data: any) => generatePostAction(
  // action name
  verifyEmailAction,
  // url
  'verify-email',
  { ...data, ...deviceData() },
);

const resendVerificationRequest = (data: any) => generatePostAction(
  // action name
  resendVerificationAction,
  // url
  'resend-verification',
  { ...data, ...deviceData() },
);

const sendVerificationCodeRequest = (data: any) => generatePostAction(
  // action name
  sendVerificationCodeAction,
  // url
  'code/send',
  data,
);

const verifyCodeRequest = (data: any) => generatePostAction(
  // action name
  verifyCodeAction,
  // url
  'code/verify',
  data,
);

const changePasswordRequest = (data: any) => generatePostAction(
  // action name
  changePasswordAction,
  // url
  'change-forgot-password',
  data,
);

// under security settings
const changeNewPasswordRequest = (data: any) => generatePostAction(
  // action name
  changeNewPasswordAction,
  // url
  'users/change-password',
  data,
);

const updateImageRequest = (data: any) => generatePostAction(
  // action name
  updateImageAction,
  // url
  'users/upload',
  data,
);

const verifyUserEmailRequest = () => generatePostAction(
  // action name
  verifyUserEmailAction,
  // url
  'users/verify',
);

const updateSettingsRequest = (data: any) => generatePatchAction(
  // action name
  updateSettingsAction,
  // url
  'users/settings',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
);

const addNotificationRequest = (data: any) => generatePostAction(
  // action name
  addNotificationAction,
  // url
  'notifications',
  data,
);

const updateClientSettingsRequest = (data: any) => generatePatchAction(
  // action name
  updateClientSettingsAction,
  // url
  'settings',
  data,
);

const deleteAccountRequest = (data: any) => generatePostAction(
  // action name
  deleteAccountAction,
  // url
  'users/delete',
  data,
);

const getNotificationsRequest = () => generateGetAction(
  // action name
  getNotificationsAction,
  // url
  'notifications',
);

const readNotificationRequest = (code: string) => generatePutAction(
  // action name
  readNotificationAction,
  // url
  `notifications/${code}`,
);

const deleteNotificationsRequest = () => generateDeleteAction(
  // action name
  deleteNotificationsAction,
  // url
  'notifications',
);

// register actions here
export {
  // normal dispatch
  clearUserTokenRequest,
  changeAccountRequest,

  // async (request) dispatch
  loginRequest,
  logoutRequest,
  registerRequest,
  getProfileTimelineRequest,
  getUserDetailsRequest,
  verifyUserEmailRequest,
  verifyEmailRequest,
  resendVerificationRequest,
  externalLoginRequest,
  sendVerificationCodeRequest,
  verifyCodeRequest,
  changePasswordRequest,
  changeNewPasswordRequest,
  updateImageRequest,
  updateSettingsRequest,
  updateClientSettingsRequest,
  addNotificationRequest,
  deleteAccountRequest,
  getNotificationsRequest,
  readNotificationRequest,
  deleteNotificationsRequest,
};
