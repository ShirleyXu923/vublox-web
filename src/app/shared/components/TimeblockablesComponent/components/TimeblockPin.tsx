import React from 'react';
import './TimeblockPin.scss';

interface TimeblockPinProps {
  hasExtender?: boolean;
}

function TimeblockPin({ hasExtender }: TimeblockPinProps) {
  return (
    <div className="timeblock_pin">
      {hasExtender && <div className="timeblock_pin__extender" />}
      <div className="timeblock_pin__circle" />
      <div className="timeblock_pin__shadow" />
      <div className="timeblock_pin__line" />
    </div>
  );
}

export default TimeblockPin;
