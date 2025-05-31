import { useDispatch, useSelector } from 'react-redux';

import LogoDark from '@assets/img/vublox-logo-dark.png';
import LogoLight from '@assets/img/vublox-logo-light.png';
import darkMapStyle from '@assets/maps/dark.json';
import lightMapStyle from '@assets/maps/light.json';
import { setThemeDispatch, setTimelineSizeDispatch } from '@reducers/app/AppAction';

const useAppTheme = () => {
  const theme = useSelector(({ App }) => App.theme || 'dark');
  const timelineSize = useSelector(({ App }) => App.timeline || { left: '58.33%', right: '41.67%' });
  const dispatch = useDispatch<any>();

  const setTheme = (newTheme: string) => {
    dispatch(setThemeDispatch(newTheme));
    if (newTheme === 'light' || newTheme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      document.body.className = '';
    } else {
      document.body.className = `theme-${newTheme}`;
    }
  };

  const setTimelineSize = (size: { left: string; right: string }) => {
    dispatch(setTimelineSizeDispatch(size));
  };

  const initializeTheme = () => {
    setTheme(theme);
  };

  return {
    theme,
    setTheme,
    initializeTheme,
    logo: theme === 'light' ? LogoLight : LogoDark,
    mapStyle: theme === 'light' ? lightMapStyle : darkMapStyle,
    timelineSize,
    setTimelineSize,
  };
};

export default useAppTheme;
