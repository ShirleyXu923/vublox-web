import classNames from 'classnames';
import { debounce } from 'lodash';
import {
  Map, MapType, Marker,
} from 'mapkit-react';
import React, {
  ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { DropdownItem, DropdownMenu, Spinner } from 'reactstrap';

import 'apple-mapkit-js';

import appConfig from '@config/app';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { SearchIcon } from '@shared/icons';
import Input from '@shared/utils/Forms/Input/Input';

interface LocationSearchbarProps {
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
}

function LocationSearchbar({ handleInputChange, defaultValue }: LocationSearchbarProps) {
  const i18n = LocaleService.getTranslations('createEvent');
  const [ keyword, setKeyword ] = useState('');
  const [ latitude, setLatitude ] = useState(0);
  const [ longitude, setLongitude ] = useState(0);
  const [ location, setLocation ] = useState<any>();
  const [ searching, setSearching ] = useState(false);
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ showResults, setShowResults ] = useState(false);
  const map = useRef<mapkit.Map>(null);

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

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearching(true);
    setShowResults(true);
    setKeyword(e.target.value);
    if (!keyword) return;

    handleSearch(e.target.value);
  };

  const onSetLocation = (loc: mapkit.Place) => {
    setKeyword(loc.name);
    setLatitude(loc?.coordinate?.latitude ?? 0);
    setLongitude(loc?.coordinate?.longitude ?? 0);
    setLocation(loc);
    handleInputChange({
      target: {
        name: 'location',
        value: {
          name: loc.name || loc.formattedAddress,
          address: loc.formattedAddress,
          latitude: loc.coordinate.latitude,
          longitude: loc.coordinate.longitude,
        },
      },
    } as any);
  };

  const handleChangeLocation = (coordinate: any) => {
    setLatitude(coordinate?.latitude);
    setLongitude(coordinate?.longitude);
    const geocoder = new mapkit.Geocoder();
    const c = new mapkit.Coordinate(coordinate?.latitude, coordinate?.longitude);
    geocoder.reverseLookup(c, (err, data: mapkit.GeocoderResponse) => {
      if (!err) {
        const { results } = data;
        const loc = results[0];

        setLocation(loc);
        handleInputChange({
          target: {
            name: 'location',
            value: loc ? {
              name: loc.name,
              address: loc.formattedAddress,
              latitude: loc?.coordinate?.latitude,
              longitude: loc?.coordinate?.longitude,
            } : null,
          },
        } as any);
      } else {
        handleError(err);
      }
    });
  };

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      map.current?.setCenterAnimated(
        new mapkit.Coordinate(
          location?.coordinate?.latitude, location?.coordinate?.longitude), true);
    }, 300);
    setTimeout(() => {
      map.current?.setCameraDistanceAnimated(400);
    }, 700);
  }, [ location ]);

  useEffect(() => {
    if (defaultValue) {
      const lat = defaultValue?.latitude as number;
      const lon = defaultValue?.longitude as number;
      handleChangeLocation({
        latitude: lat,
        longitude: lon,
      });
      setKeyword(defaultValue?.address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="position-relative">
        <Input
          label={i18n.label.location}
          placeholder={i18n.label.location}
          required
          leftIcon={(<SearchIcon />)}
          leftIconProps={{ className: 'pe-0' }}
          onChange={onSearch}
          rightIcon={searching && <Spinner size="sm" />}
          value={keyword}
          onBlur={() => setTimeout(() => {
            setShowResults(false);
          }, 150)}
        />
        <DropdownMenu className={classNames('w-100 mt-3', {
          show: showResults && searchResults.length > 0,
        })}
        >
          {searchResults.map(s => (
            <DropdownItem key={s.muid} onClick={() => onSetLocation(s)} toggle={false}>
              {s.name}
              <small className="text-muted">
                &nbsp;{s.formattedAddress}
              </small>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </div>

      {!!location && (
        <div style={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}>
          <Map
            ref={map}
            token={appConfig.appleMapsToken as string}
            mapType={MapType.Hybrid}
          >
            <Marker
              latitude={latitude}
              longitude={longitude}
              title={i18n.button.marker}
              draggable
              enabled
              onDragEnd={coordinate => {
                handleChangeLocation(coordinate);
              }}
            />
          </Map>
        </div>
      )}
    </div>
  );
}

export default LocationSearchbar;
