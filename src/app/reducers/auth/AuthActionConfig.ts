/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const loginAction = createAction('VUBLOX_AUTH_LOGIN');
export const logoutAction = createAction('VUBLOX_AUTH_LOGOUT');
export const clearUserTokenAction = createAction('VUBLOX_USER_CLEAR_TOKEN');
export const registerAction = createAction('VUBLOX_AUTH_REGISTER');
export const getUserDetailsAction = createAction('VUBLOX_AUTH_GET_USER_DETAILS');
export const verifyEmailAction = createAction('VUBLOX_AUTH_VERIFY_EMAIL');
export const resendVerificationAction = createAction('VUBLOX_AUTH_RESEND_VERIFICATION');

// Image Data
export const updateImageAction = createAction('VUBLOX_AUTH_UPDATE_IMAGE');

// Profile Timeline Data
export const getProfileTimelineAction = createAction('VUBLOX_GET_PROFILE_TIMELINE');

// social
export const externalLoginAction = createAction('VUBLOX_AUTH_LOGIN_EXTERNAL');

// forgot password
export const sendVerificationCodeAction = createAction('VUBLOX_AUTH_SEND_VERIFICATION_CODE');
export const verifyCodeAction = createAction('VUBLOX_AUTH_VERIFY_CODE');
export const changePasswordAction = createAction('VUBLOX_AUTH_CHANGE_PASSWORD');
export const verifyUserEmailAction = createAction('VUBLOX_AUTH_VERIFY_USER_EMAIL');

// security settings
export const changeNewPasswordAction = createAction('VUBLOX_AUTH_CHANGE_NEW_PASSWORD');
export const updateSettingsAction = createAction('VUBLOX_AUTH_UPDATE_SETTINGS');
export const updateClientSettingsAction = createAction('VUBLOX_AUTH_UPDATE_CLIENT_SETTINGS');
export const deleteAccountAction = createAction('VUBLOX_AUTH_DELETE_ACCOUNT');

export const changeAccountAction = createAction('VUBLOX_AUTH_CHANGE_ACCOUNT');

// Notifications
export const addNotificationAction = createAction('VUBLOX_AUTH_ADD_NOTIFICATIONS');
export const getNotificationsAction = createAction('VUBLOX_AUTH_GET_NOTIFICATIONS');
export const readNotificationAction = createAction('VUBLOX_AUTH_READ_NOTIFICATION');
export const deleteNotificationsAction = createAction('VUBLOX_AUTH_DELETE_NOTIFICATIONS');
