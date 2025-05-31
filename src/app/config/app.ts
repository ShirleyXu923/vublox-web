const appConfig = {
  // prevent redirection if 401 is received
  whitelistUrl: [
    '/client/login',
  ],
  env: process.env.NODE_ENV,
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
  baseUrl: `${process.env.REACT_APP_BASE_URL || 'https://vublox-dev.jlabs.team'}`,
  apiUrl: `${process.env.REACT_APP_API_URL}`,
  appleMapsToken: process.env.REACT_APP_APPLE_MAPS_TOKEN,
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  ipInfoToken: process.env.REACT_APP_IP_INFO_TOKEN,
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
  },
  contactEmail: 'enquiries@vublox.com',
  amap: {
    securityKey: process.env.REACT_APP_AMAP_SECURITY_KEY,
    apiKey: process.env.REACT_APP_AMAP_API_KEY,
  },
};

export default appConfig;
