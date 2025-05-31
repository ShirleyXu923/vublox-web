/* eslint-disable no-console */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { isLatestVersion, setLatestVersion } from '@shared/helpers';

import LoadingBlock from '../LoadingBlock';

function CacheBuster({ children }) {
  const [ loading, setLoading ] = useState(false);

  const refreshCacheAndReload = () => {
    window.caches.keys().then(keys => {
      if (keys.length === 0) {
        console.info('No caches found. No need to clear.');
        return;
      }

      console.info('Clearing cache and hard reloading...');
      // Service worker cache should be cleared with caches.delete()
      keys.forEach(name => {
        caches.delete(name);
      });

      // delete browser cache and hard reload
      window.location.reload(true);
    });
  };

  const getVersion = async () => {
    const response = await axios.get('/meta.json').catch(() => {
      console.log('Error fetching metadata');
    });

    setLoading(false);

    if (!response) return null;
    const meta = response.data;

    return meta.timestamp.toString();
  };

  useEffect(() => {
    const didMount = async () => {
      const currentVersion = await getVersion();

      if (!isLatestVersion(currentVersion)) {
        console.log(`We have a new version - ${currentVersion}. Should force refresh`);
        setLatestVersion(currentVersion);
        refreshCacheAndReload();
        return;
      }

      console.log(`You already have the latest version - ${currentVersion}. No cache refresh needed.`);
    };

    didMount();
  }, []);
  if (loading) return <LoadingBlock enabled />;

  return children;
}

CacheBuster.defaultProps = {
  children: null,
};

CacheBuster.propTypes = {
  children: PropTypes.any,
};

export default CacheBuster;
