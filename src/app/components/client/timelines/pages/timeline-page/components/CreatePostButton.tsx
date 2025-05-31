import React from 'react';
import { Link } from 'react-router-dom';

import LocaleService from '@services/LocaleService';
import Add from '@shared/icons/Add';

interface ButtonProps {
  link?: string;
}

function CreatePostButton({ link }: ButtonProps) {
  const i18n = LocaleService.getTranslations('timelinePage');
  return (
    <Link to={`${link}`} className="dropdown-button">
      <Add />
      {i18n.button.createPost}
    </Link>
  );
}

export default CreatePostButton;
