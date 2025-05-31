import { sampleSize } from 'lodash';

/* eslint-disable global-require */
const ads = {
  banners: {
    banner1: require('./banner-1.png'),
    banner2: require('./banner-2.png'),
    banner3: require('./banner-3.png'),
    banner4: require('./banner-4.png'),
  },
  ads: {
    ad1: require('./ad-1.png'),
    ad2: require('./ad-2.png'),
    ad3: require('./ad-3.png'),
  },
};

export default ads;

export const randomBanners = (count = 1) => sampleSize(Object.values(ads.banners), count);

export const randomAds = (count = 1) => sampleSize(Object.values(ads.banners), count);
