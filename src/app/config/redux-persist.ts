import storage from 'redux-persist/lib/storage';

const reduxPersistConfig = {
  auth: {
    key: 'Auth',
    storage,
    whitelist: [ 'accessToken', 'user' ],
  },
  app: {
    key: 'App',
    storage,
    whitelist: [ 'showAdultTooltip' ],
  },
};

export default reduxPersistConfig;
