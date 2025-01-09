export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/getUserInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateProfile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/addProfileImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/removeProfileImage`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

// export const CONTACTS_ROUTES = "/api/contacts";
// export const SEARCH_CONTACT_ROUTES = `${CONTACTS_ROUTES}/search`;

// export const MESSAGES_ROUTES = "api/messages";
// export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
