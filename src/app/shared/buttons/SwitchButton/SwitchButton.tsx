import React from 'react';

import './SwitchButton.scss';

interface SwitchButtonProps {
  name?: string;
  onChange: (e: any) => void;
  isActive: boolean;
  activeLabel: string;
  offLabel: string;
}

function SwitchButton({
  name,
  onChange,
  isActive,
  activeLabel,
  offLabel,
}: SwitchButtonProps) {
  const handleStateChange = () => {
    onChange({
      target: {
        name,
        value: !isActive,
      },
    });
  };

  return (
    <div className={`switch-button-container ${!isActive ? 'active' : ''}`} onClick={handleStateChange}>
      {isActive
        ? (
          <React.Fragment>
            <span className="off-label">{offLabel}</span>
            <div className="off-switch" />
          </React.Fragment>
        )
        : (
          <React.Fragment>
            <div className="on-switch" />
            <span className="on-label">{activeLabel}</span>
          </React.Fragment>
        )}
    </div>
  );
}

export default SwitchButton;
