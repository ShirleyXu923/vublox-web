import classNames from 'classnames';

import './Avatar.scss';

function Avatar({
  user, size, className, svg,
}: {
  user: any;
  size?: 'sm' | 'md' | 'lg';
  svg?: React.ReactElement<SVGElement>;
  className?: string }) {
  const getInitials = () => {
    if (user?.name) {
      const names = user?.name?.split(' ');
      if (names.length > 1) {
        return `${names[0]?.charAt(0)}${names[1]?.charAt(0)}`;
      }

      return names[0]?.charAt(0);
    }

    if (user?.title) {
      const names = user?.title?.split(' ');
      if (names.length > 1) {
        return `${names[0]?.charAt(0)}${names[1]?.charAt(0)}`;
      }

      return names[0]?.charAt(0);
    }

    if (user?.display_name) {
      const names = user?.display_name?.split(' ');
      if (names.length > 1) {
        return `${names[0]?.charAt(0)}${names[1]?.charAt(0)}`;
      }

      return names[0]?.charAt(0);
    }

    if (user?.first_name && user?.last_name) {
      return `${user?.first_name?.charAt(0) ?? ''}${user?.last_name?.charAt(0) ?? ''}`;
    }

    return '';
  };

  return (
    <div className={`account-avatar ${size ?? ''} ${className ?? ''} ${svg && 'hasSVG'}`}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {svg ? (
        <div className="svg-container">
          {svg}
        </div>
      ) : user?.image ? (
        <img src={user?.logo?.sm || user?.image?.sm} alt="Profile" loading="lazy" />
      ) : (
        <span className={classNames({
          'text-uppercase fw-bold': true,
          small: size === 'sm',
        })}
        >
          {getInitials()}
        </span>
      )}
    </div>
  );
}

export default Avatar;
