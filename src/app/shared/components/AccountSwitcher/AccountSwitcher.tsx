import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { RadioIcon, RadioSelectedIcon } from '@shared/icons';
import Avatar from '@shared/utils/Avatar/Avatar';

import './AccountSwitcher.scss';

interface AccountSwitcherProps {
  onChange: (selected: any) => void
}

function AccountSwitcher({ onChange }: AccountSwitcherProps) {
  const user = useSelector((state: IRootState) => state.Auth.user) as any;
  const account = useSelector((state: IRootState) => state.Auth.account) as any;
  const organizations = useSelector((state: IRootState) => state.Organization
    .own_organizations) as any[];
  const dispatch = useDispatch<any>();
  const [ selected, setSelected ] = useState(account);

  const loadData = () => {
    if (!user) return;
    dispatch(getOrganizationsRequest({ owned: true }));
  };

  const handleSelect = (value: any, type: string) => {
    setSelected({ ...value, type });
    onChange({ ...value, type });
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSelect(account, account.type === 'user' ? 'Client' : 'Organization');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ account ]);

  return (
    <UncontrolledDropdown className="account-switcher">
      <DropdownToggle
        caret
        size="sm"
        className="p-2 d-flex align-items-center"
      >
        <Avatar user={selected} size="sm" />
        <span className="ms-2 fw-normal">
          {selected.name || selected.display_name}&nbsp;
        </span>
      </DropdownToggle>
      <DropdownMenu className="shadow-sm">
        <DropdownItem
          className="d-flex align-items-center"
          onClick={() => handleSelect(user, 'Client')}
        >
          {selected.id === user.id
            ? <RadioSelectedIcon /> : <RadioIcon />}
          <Avatar user={user} size="sm" />
          <span className="ms-1 fw-normal">
            {user.display_name}&nbsp;
          </span>
        </DropdownItem>
        {organizations.map((o: any) => (
          <DropdownItem
            key={o.id}
            className="d-flex align-items-center"
            onClick={() => handleSelect(o, 'Organization')}
          >
            {selected.id === o.id
              ? <RadioSelectedIcon /> : <RadioIcon />}
            <Avatar user={o} size="sm" />
            <span className="ms-1 fw-normal">
              {o.name}&nbsp;
            </span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

export default AccountSwitcher;
