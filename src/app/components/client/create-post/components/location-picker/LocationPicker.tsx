import {
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { MapInteractionEvent } from 'mapkit-react';
import {
  ChangeEvent, useCallback, useEffect, useRef, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Badge, Button, DropdownItem, DropdownMenu, Label,
} from 'reactstrap';

import 'apple-mapkit-js';

import appConfig from '@config/app';
import { handleError } from '@services/ErrorHandler';
import GeneralMap from '@shared/components/Maps/GeneralMap';
import useGeoCoding from '@shared/hooks/useGeoCoding';
import useTranslation from '@shared/hooks/useTranslation';
import { RouteIcon } from '@shared/icons';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import EnableLocation from '../enable-location/EnableLocation';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultVerified?: boolean;
  code?: string;
}

function LocationPicker({
  latitude: lat, longitude: lng, handleInputChange, defaultVerified, code,
}: LocationPickerProps) {
  const i18n = useTranslation('createPost');
  const [ latitude, setLatitude ] = useState(+lat);
  const [ longitude, setLongitude ] = useState(+lng);
  const [ verified, setVerified ] = useState(defaultVerified || false);
  const [ country, setCountry ] = useState('');
  const map = useRef<mapkit.Map>(null);
  const { countryCode } = useGeoCoding();
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const [ searching, setSearching ] = useState(false);
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ keyword, setKeyword ] = useState('');
  const [ showResults, setShowResults ] = useState(false);

  const handleChangeLocation = (coordinate: any, isVerified = false) => {
    setVerified(isVerified);
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);
    const geocoder = new mapkit.Geocoder();
    const c = new mapkit.Coordinate(coordinate.latitude, coordinate.longitude);
    geocoder.reverseLookup(c, (err, data: mapkit.GeocoderResponse) => {
      if (!err) {
        const { results } = data;
        const loc = results[0];

        setKeyword(loc.name || loc.formattedAddress);

        handleInputChange({
          target: {
            name: 'location',
            value: loc ? {
              name: loc.name || loc.formattedAddress,
              address: loc.formattedAddress,
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              verified: isVerified,
              country_code: loc.countryCode || countryCode,
            } : null,
          },
        } as any);
        setCountry(loc.countryCode);
      } else {
        handleError(err);
      }
    });
  };

  const animate = (l: number, ln: number) => {
    setTimeout(() => {
      map.current?.setCenterAnimated(
        new mapkit.Coordinate(l, ln), true);
    }, 300);
    setTimeout(() => {
      map.current?.setCameraDistanceAnimated(400);
    }, 700);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
      handleChangeLocation(pos.coords, true);
      animate(pos.coords.latitude, pos.coords.longitude);
      setVerified(true);
    });
  };

  const handleMapMouseClick = (event: MapMouseEvent) => {
    const { latLng } = event.detail;

    handleChangeLocation({
      latitude: latLng?.lat,
      longitude: latLng?.lng,
    });
  };

  const handleAppleMapsClick = (event: MapInteractionEvent) => {
    const coordinates = event.toCoordinates();

    if (!coordinates) {
      return;
    }

    setLatitude(coordinates.latitude);
    setLongitude(coordinates.longitude);

    handleChangeLocation({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }, true);
  };

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

  const onSearch = (query: string) => {
    setKeyword(query);
    if (!query) {
      setSearching(false);
      setShowResults(false);
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setShowResults(true);

    handleSearch(query);
  };

  const onSetLocation = (loc: mapkit.Place) => {
    setKeyword(loc?.name || loc?.formattedAddress || '');
    setShowResults(false);
    handleInputChange({
      target: {
        name: 'location',
        value: {
          name: loc?.name || loc?.formattedAddress || '',
          address: loc?.formattedAddress || '',
          latitude: loc?.coordinate?.latitude || 0,
          longitude: loc?.coordinate?.longitude || 0,
          country_code: loc?.countryCode || countryCode,
        },
      },
    } as any);
  };

  useEffect(() => {
    if (!lat && !lng) return;

    setLatitude(+lat);
    setLongitude(+lng);
    animate(+lat, +lng);
    handleChangeLocation({ latitude: +lat, longitude: +lng }, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ lat, lng, code ]);

  useEffect(() => {
    mapkit.init({
      authorizationCallback(done) {
        done(appConfig.appleMapsToken as string);
      },
    });
  }, []);

  return (
    <div className="mb-5">
      {!isXsScreen && (
        <EnableLocation getCurrentLocation={getCurrentLocation} />
      )}

      <div className="w-100 d-flex justify-content-between mb-3 flex-wrap">
        <div>
          <Label className="text-muted text-uppercase d-flex align-items-center">
            {i18n.label.location}
            <span className="text-danger">*</span>
            <Badge pill className="primary2 ms-1">
              {verified ? i18n.label.verified : i18n.label.unverifed}
            </Badge>
          </Label>
          <small className="mt-2 b5">Move pin to adjust</small>
        </div>
        <div className="search_container">
          <SearchBar inputProps={{ value: keyword }} loading={searching} placeholder="Search Location" onSearch={onSearch} />
          {showResults && (
            <DropdownMenu className={classNames('w-100 mt-2', {
              show: showResults && searchResults.length > 0,
            })}
            >
              {searchResults.map((item: any) => (
                <DropdownItem key={item.muid} onClick={() => onSetLocation(item)} toggle={false}>
                  <div className="text-wrap">
                    {item.name}
                    <span className="text-muted small">
                    &nbsp;{item.formattedAddress}
                    </span>
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="map-wrapper">
        <Button
          size="sm"
          color="primary"
          className="btn-current-location"
          onClick={getCurrentLocation}
          disabled={verified}
        >
          <RouteIcon className="me-2" />
          {i18n.button.useCurrentLocation}
        </Button>

        {/* New Google Maps */}
        <GeneralMap
          countryCode={code || country || countryCode}
          latitude={latitude}
          longitude={longitude}
          onClick={handleMapMouseClick}
          onAppleMapsClick={handleAppleMapsClick}
          editable
        />
      </div>
    </div>
  );
}

export default LocationPicker;
