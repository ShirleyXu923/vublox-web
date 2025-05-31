/* eslint-disable import/prefer-default-export */

export const isEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

export const normalizeMobile = (mobile: string) => {
  let normalizedMobile = mobile;
  if (mobile.startsWith('0')) {
    normalizedMobile = normalizedMobile.replace('0', '');
  } else if (mobile.startsWith('63')) {
    normalizedMobile = normalizedMobile.replace('63', '');
  } else if (mobile.startsWith('+63')) {
    normalizedMobile = normalizedMobile.replace('+63', '');
  }
  return normalizedMobile;
};
