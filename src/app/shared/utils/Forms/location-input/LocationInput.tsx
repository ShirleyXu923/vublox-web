import {
  MapMouseEvent,
  useMarkerRef,
} from '@vis.gl/react-google-maps';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { MapInteractionEvent } from 'mapkit-react';
import React, {
  ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { DropdownItem, DropdownMenu, Spinner } from 'reactstrap';

import 'apple-mapkit-js';

import appConfig from '@config/app';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import GeneralMap from '@shared/components/Maps/GeneralMap';
import { LocationIcon, SearchIcon } from '@shared/icons';
import Input from '@shared/utils/Forms/Input/Input';
import './LocationInput.scss';

interface LocationInputProps {
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: any;
  hideMap?: boolean;
  onAccountSettings?: boolean;
}

function LocationInput({
  handleInputChange, defaultValue, hideMap = false, onAccountSettings = false,
}: LocationInputProps) {
  const i18n = LocaleService.getTranslations('createEvent');
  const [ keyword, setKeyword ] = useState('');
  const [ latitude, setLatitude ] = useState(52.28907290);
  const [ longitude, setLongitude ] = useState(-2.43094180);
  const [ location, setLocation ] = useState<any>();
  const [ searching, setSearching ] = useState(false);
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ showResults, setShowResults ] = useState(false);
  const map = useRef<mapkit.Map>(null);
  const [ markerRef ] = useMarkerRef();
  const [ countryCode, setCountryCode ] = useState<any>(null);

  const loadPlaces = (query: string) => {
    if (!query) {
      setSearching(false);
      return;
    }

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
    setCountryCode(loc?.countryCode);
    setKeyword(loc.name || loc?.formattedAddress);
    setLatitude(loc?.coordinate?.latitude ?? 0);
    setLongitude(loc?.coordinate?.longitude ?? 0);
    setLocation(loc);
    handleInputChange({
      target: {
        name: 'location',
        value: {
          name: loc.name || loc?.formattedAddress,
          address: loc.formattedAddress,
          latitude: loc.coordinate.latitude,
          longitude: loc.coordinate.longitude,
          country_code: loc.countryCode,
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

        setCountryCode(loc.countryCode);

        setLocation(loc);
        handleInputChange({
          target: {
            name: 'location',
            value: loc ? {
              name: loc.name || loc?.formattedAddress,
              address: loc.formattedAddress,
              latitude: coordinate?.latitude,
              longitude: coordinate?.longitude,
            } : null,
          },
        } as any);
        setKeyword(loc?.name || loc?.formattedAddress);
      } else {
        handleError(err);
      }
    });
  };

  const handleMapMouseClick = (event: MapMouseEvent) => {
    const { lat, lng } = event.detail.latLng as any;

    handleChangeLocation({
      latitude: lat,
      longitude: lng,
    });
  };

  const handleAppleMapsClick = (event: MapInteractionEvent) => {
    const coordinates = event.toCoordinates();

    handleChangeLocation({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  };

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
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });

    if (defaultValue) {
      const lat = defaultValue?.latitude as number;
      const lon = defaultValue?.longitude as number;
      setLatitude(+lat);
      setLongitude(+lon);
      handleInputChange({
        target: {
          name: 'location',
          value: {
            name: defaultValue.name,
            address: defaultValue.address,
            latitude: +defaultValue.latitude,
            longitude: +defaultValue.longitude,
          },
        },
      } as any);
      setLocation(defaultValue);
      setKeyword(defaultValue?.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="input-map">
      <div className="position-relative">
        <Input
          label={onAccountSettings ? i18n.label.placeOfBirth : i18n.label.location}
          placeholder={i18n.label.location}
          required={!onAccountSettings}
          leftIcon={onAccountSettings ? <LocationIcon /> : <SearchIcon />}
          leftIconProps={{ className: onAccountSettings ? ' ' : 'pe-0' }}
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
              <div className="text-wrap">
                {s.name}
                <span className="text-muted small">
                &nbsp;{s.formattedAddress}
                </span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </div>

      {(!hideMap && !!location) && (
        <GeneralMap
          countryCode={countryCode}
          latitude={latitude}
          longitude={longitude}
          onClick={handleMapMouseClick}
          onAppleMapsClick={handleAppleMapsClick}
          ref={markerRef}
          editable
          containerStyle={{ height: '500px', borderRadius: '20px', overflow: 'hidden' }}
        />
      )}
    </div>
  );
}

export default LocationInput;
