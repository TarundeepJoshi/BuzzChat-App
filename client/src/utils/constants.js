export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/getUserInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateProfile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/addProfileImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/removeProfileImage`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const CHECK_AUTH_ROUTE = `${AUTH_ROUTES}/checkAuth`;

export const CONTACTS_ROUTES = "/api/contacts";
export const SEARCH_CONTACT_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/getContactsForDMList`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/getAllContacts`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "api/channels";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/createChannel`;
export const GET_USER_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/getUserChannels`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTES}/getChannelMessages`;