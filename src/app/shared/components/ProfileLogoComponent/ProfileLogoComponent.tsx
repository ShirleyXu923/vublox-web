import './ProfileLogoComponent.scss';

import React from 'react';

interface ProfileLogoComponentProps {
  image: string;
  name: string;
}

function ProfileLogoComponent({ image, name }: ProfileLogoComponentProps) {
  const getInitials = () => {
    let initials = '';
    const nameArray = name.split(' ');

    if (nameArray.length > 1) {
      initials = `${nameArray?.[0]?.[0] || ''}${nameArray?.[1]?.[0] || ''}`;
    } else {
      initials = nameArray?.[0]?.[0];
    }

    return initials;
  };

  return (
    <div className="profile-logo-component">
      {image
        ? (
          <img src={image} className="image" alt={name} />
        )
        : (
          <div className="profile_name">
            <span className="name page-title-text">{getInitials()}</span>
          </div>
        )}
    </div>
  );
}

export default ProfileLogoComponent;
