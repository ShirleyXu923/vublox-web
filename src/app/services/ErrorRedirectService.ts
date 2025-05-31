export const forbiddenAccess = (redirect = false) => {
  const redirectTo = '/errors/403';
  if (redirect) {
    window.location.href = redirectTo;
    return false;
  }
  return redirectTo;
};

export const notFoundAccess = (redirect = false) => {
  const redirectTo = '/errors/404';
  if (redirect) {
    window.location.href = redirectTo;
    return false;
  }
  return redirectTo;
};
