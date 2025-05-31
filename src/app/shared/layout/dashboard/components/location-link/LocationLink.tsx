import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import './LocationLink.scss';

function LocationLink({ location, className }: {
  location: {
    id: string;
    address: string;
    slug: string;
  } | undefined;
  className?: string | undefined
}) {
  return location?.address ? (
    <Link to={`/locations/${location.slug}`} className={classNames('location-link', className)}>
      {location?.address}
    </Link>
  ) : null;
}

export default LocationLink;
