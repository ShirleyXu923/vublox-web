/* eslint-disable jsx-a11y/label-has-associated-control */
import { debounce, xor } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DropdownItem,
  FormGroup,
  Input,
} from 'reactstrap';

import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

let loaderPromise: any;

interface OrganizationFilterProps {
  organizations: any[];
  handleSelectOrganizations: (orgs: any[]) => void
}

function OrganizationFilter({ organizations, handleSelectOrganizations }: OrganizationFilterProps) {
  const i18n = useTranslation('home');
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ searching, setSearching ] = useState(false);
  const dispatch = useDispatch<any>();

  const loadData = (refresh = false, query = '') => {
    const promise = refresh ? loaderPromise
      || dispatch(getOrganizationsRequest({ keyword: query })).$promise
      : dispatch(getOrganizationsRequest({ keyword: query })).$promise;
    loaderPromise = promise;
    promise
      .then((res: any) => setSearchResults(res.data.items))
      .catch((e: any) => handleError(e))
      .finally(() => {
        loaderPromise = null;
        setSearching(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query) => {
    loadData(false, query);
  }, 2000), []);

  const onSearch = (value: string) => {
    setSearching(true);
    if (!value) return;

    handleSearch(value);
  };

  const handleSelect = (org: any) => {
    handleSelectOrganizations(xor(organizations, [ org.id ]));
  };

  useEffect(() => {
    loadData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="px-3 mt-2">
        <SearchBar
          iconPlacement="left"
          placeholder={i18n.label.searchOrganizations}
          onSearch={onSearch}
          loading={searching}
          clearable
        />
      </div>

      <div className="my-2">
        {searchResults.map(org => (
          <DropdownItem key={org.id} toggle={false} onClick={() => handleSelect(org)}>
            <FormGroup check>
              <Input
                type="checkbox"
                checked={organizations.includes(org.id)}
                onChange={() => handleSelect(org)}
              />
              <label className="form-check-label">
                {org.name}
              </label>
            </FormGroup>
          </DropdownItem>
        ))}
      </div>
    </div>
  );
}

export default OrganizationFilter;
