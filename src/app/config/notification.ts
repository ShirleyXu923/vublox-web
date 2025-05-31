const notificationConfig = {
  appId: `${process.env.REACT_APP_PUSHER_APP_ID}`,
  appKey: `${process.env.REACT_APP_PUSHER_APP_KEY}`,
  appSecret: `${process.env.REACT_APP_PUSHER_APP_SECRET}`,
  appCluster: `${process.env.REACT_APP_PUSHER_APP_CLUSTER}`,
};

export default notificationConfig;
