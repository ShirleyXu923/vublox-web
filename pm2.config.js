const config = require('dotenv').config();

module.exports = {
  apps: [
    {
      name: `${config.parsed.NODE_ENV}`,
      script: './server/index.js',
      exec_mode: 'cluster',
      instances: 2,
      // wait for the signal to process
      wait_ready: true,
      // timeout before forcing a reload if app not listening
      listen_timeout: 10000,
      // timeout before sending the SIGKILL
      kill_timeout: 5000,
    },
  ],
};