// save cookie function
export const saveToken = (token) => {
  // save token in cookie
  document.cookie = `token=${token};path=/;max-age=86400;SameSite=Strict;`;
};
// get cookie function
export const getToken = () => {
  // get token from cookie
  const token = document.cookie.split("=")[1];
  return token;
};
// remove cookie function
export const removeToken = () => {
  // remove token from cookie
  document.cookie = "token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
