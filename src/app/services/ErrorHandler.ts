import { toast } from 'react-toastify';

import LocaleService from '@services/LocaleService';

const translations = LocaleService.getTranslations('general.error');

const errorResponse: {
  [key: number]: any
} = {
  401: translations.invalid_credentials,
  429: translations.throttle,
  422: translations.validation,
  500: translations.internal_server,
};

const parseErrorResponse = (response: any) => {
  // default message
  let message = translations.default;
  // means no internet or couldn't establish connection
  if (!response) {
    message = translations.establish_connection;
  // } else if (response.status === 422) {
  //   // validation error
  //   // temp: get the first error
  //   const { errors } = response.data;
  //   // eslint-disable-next-line prefer-destructuring
  //   message = {
  //     message: Object.values(errors)[0][0],
  //     title: translations.validation.title,
  //   };
  } else if (response.status === 400) {
    // eslint-disable-next-line prefer-destructuring
    message = {
      message: response.data.message,
      title: translations.invalid_request.title,
    };
  } else if (errorResponse[response.status]) {
    // if status code is defined in error response object
    message = errorResponse[response.status];
  }

  return message;
};

export const handleError = (err: any, navigate?: any) => {
  const { response } = err;

  if (response?.status === 404 && navigate) {
    navigate('/errors/404');
    return;
  }

  const { message } = parseErrorResponse(response);
  // implement display of error here
  toast.error(message);
};

// eslint-disable-next-line no-console
export const logError = (error: any) => console.log('error in request', error);
