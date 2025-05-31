import classNames from 'classnames';
import { debounce } from 'lodash';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Dropdown, DropdownItem, DropdownMenu } from 'reactstrap';

import appConfig from '@config/app';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import SearchBar, { SearchBarRef } from '@shared/utils/SearchBar/SearchBar';

import './LocationFilter.scss';

interface LocationFilterProps {
  handleSetLocation: (coords: any) => void;
  className?: string | undefined
  end?: boolean
  defaultValue?: string
}

function LocationFilter({
  handleSetLocation, className, end, defaultValue,
}: LocationFilterProps) {
  const i18n = useTranslation('home');
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ showResults, setShowResults ] = useState(false);
  const [ searching, setSearching ] = useState(false);

  const ref = useRef<SearchBarRef>(null);

  const loadPlaces = (query: string) => {
    const search = new mapkit.Search();
    search.search(query, (err, d) => {
      setSearching(false);
      if (!err) {
        setSearchResults(d.places);
      } else {
        handleError(err);
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query) => {
    loadPlaces(query);
  }, 2000), []);

  const onSearch = (value: string) => {
    setSearching(true);
    setShowResults(true);
    if (!value) return;

    handleSearch(value);
  };

  const onSetLocation = (loc: mapkit.Place) => {
    handleSetLocation({
      latitude: loc.coordinate.latitude,
      longitude: loc.coordinate.longitude,
      name: loc.name,
    });
    setShowResults(false);
    if (ref.current) {
      ref.current.setValue(loc.name);
    }
  };

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });
  }, []);

  useEffect(() => {
    if (defaultValue) {
      if (ref.current) {
        ref.current.setValue(defaultValue);
      }
    }
  }, [ defaultValue ]);

  return (
    <Dropdown className={`location-filter position-relative ${className || ''}`}>
      <SearchBar
        ref={ref}
        iconPlacement="left"
        placeholder={i18n.label.searchLocation}
        onSearch={onSearch}
        inputProps={{
          onBlur: () => setTimeout(() => {
            setShowResults(false);
          }, 150),
        }}
        loading={searching}
        clearable
      />

      <DropdownMenu
        className={classNames('w-100 mt-3', {
          'dropdown-submenu': true,
          show: showResults && searchResults.length > 0,
        })}
        end={end}
      >
        {searchResults.map(s => (
          <DropdownItem
            key={s.muid}
            onClick={() => onSetLocation(s)}
            toggle={false}
            className="d-block"
          >
            {s.name}
            <small className="text-muted">
&nbsp;{s.formattedAddress}
            </small>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default LocationFilter;
