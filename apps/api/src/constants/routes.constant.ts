export const PARAM = {
  PROVIDER: 'provider',
  CODE: 'code',
  STATE: 'state',
};

export const ROUTS_PATH = {
  AUTH: {
    UPDATE_TOKEN: 'auth.update',
    EMAIL_CONFIRMATION: '/auth/email-confirmation',
    PASSWORD_RECOVERY: '/auth/password-recovery',
    PROVIDER_CALLBACK: '/oauth/callback/',
    PROVIDER_CONNECT_PARAM: '/oauth/connect/:' + PARAM.PROVIDER,
    PROVIDER_CALLBACK_PARAM: '/oauth/callback/:' + PARAM.PROVIDER,
  },
};
