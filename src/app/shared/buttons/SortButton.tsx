import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import DropdownIcon from '@shared/icons/DropdownIcon';
import SortIcon from '@shared/icons/SortIcon';

import './SortButton.scss';

interface SortButtonProps {
  label?: string | any;
  // Changes to null so I can pass null during small screen where no icons displayed
  sortIcon?: React.ReactElement | null;
  items?: any[];
  onSelect: (item: any) => void;
}

function SortButton({
  label,
  items,
  sortIcon = <SortIcon />,
  onSelect,
}: SortButtonProps) {
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const updateLabel = (item: any) => {
    onSelect(item);
  };

  return (
    <Dropdown className="filter" isOpen={dropdownOpen} toggle={toggle} direction="down" size="xs">
      <DropdownToggle
        data-toggle="dropdown"
        tag="span"
        className="dropdown"
      >
        <div className="dropdown-button">
          {sortIcon && (
            <div className="sort-icon">
              {sortIcon}
            </div>
          )}
          <span className="b5 text-truncate">{label}</span>
          <div className="dropdown-icon">
            <DropdownIcon />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu>
        {items?.map((item: any) => (
          <DropdownItem
            key={item?.label}
            onClick={() => { updateLabel(item); }}
          >
            <span>{item?.label}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default SortButton;
