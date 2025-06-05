import classNames from 'classnames';
import React, { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';

import './PasswordStrengthFeedback.scss';
import CheckIcon from '@shared/icons/CheckIcon';

interface IPasswordStrengthFeedback {
  password?: string;
}

const scoreWords = [
  'Very Weak',
  'Weak',
  'Fair',
  'Good',
  'Strong',
];

function PasswordStrengthFeedback({ password = '' }: IPasswordStrengthFeedback) {
  const [ passwordScore, setPasswordScore ] = useState(0);

  const handleChangePasswordScore = (score: number) => {
    setPasswordScore(score);
  };

  const isValidLength = password.length >= 8;
  const isValidCase = /[A-Z]/.test(password);
  const isValidNumber = /[0-9]/.test(password);
  const isValidChar = /[!@#$%^&*()_+]/.test(password);

  return (
    <div className="password-strength-feedback">
      <PasswordStrengthBar
        password={password}
        minLength={7}
        shortScoreWord=""
        scoreWordClassName="d-none"
        className="password-strength-bar"
        barColors={[ 'var(--bs-gray-200)', 'var(--bs-danger)', 'var(--bs-warning)', 'var(--bs-teal)', 'var(--bs-green)' ]}
        onChangeScore={handleChangePasswordScore}
      />
      <div className="mt-3">
        Password Strength:&nbsp;
        <span className={classNames({
          [`password-score-${passwordScore}`]: true,
        })}
        >
          {scoreWords[passwordScore]}
        </span>
      </div>
      <div className="mt-3">
        <div className={classNames({
          'text-muted': !isValidLength,
          'text-success': isValidLength,
          'mb-2': true,
        })}
        >
          <CheckIcon className="me-2" fill={!isValidLength ? '' : 'var(--bs-success)'} />
          At least 8 characters
        </div>
        <div className={classNames({
          'text-muted': !isValidCase,
          'text-success': isValidCase,
          'mb-2': true,
        })}
        >
          <CheckIcon className="me-2" fill={!isValidCase ? '' : 'var(--bs-success)'} />
          At least 1 upper case letter (A-Z)
        </div>
        <div className={classNames({
          'text-muted': !isValidNumber,
          'text-success': isValidNumber,
          'mb-2': true,
        })}
        >
          <CheckIcon className="me-2" fill={!isValidNumber ? '' : 'var(--bs-success)'} />
          At least 1 number (0-9)
        </div>
        <div className={classNames({
          'text-muted': !isValidChar,
          'text-success': isValidChar,
          'mb-2': true,
        })}
        >
          <CheckIcon className="me-2" fill={!isValidChar ? '' : 'var(--bs-success)'} />
          At least 1 special character (!@#$%^&*()_+)
        </div>
      </div>
    </div>
  );
}

export default PasswordStrengthFeedback;
