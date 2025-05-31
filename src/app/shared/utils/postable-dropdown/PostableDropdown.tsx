import { debounce, isEqual } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Badge,
  Button,
  DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, TabContent, TabPane,
  UncontrolledDropdown,
} from 'reactstrap';
import { v4 as uuid } from 'uuid';

import { getEventsRequest } from '@reducers/event/EventAction';
import { getLocationsRequest } from '@reducers/location/LocationAction';
import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { getTimelinesRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import { dateToCalendar, dateToTimeWithSeconds } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, CloseIcon } from '@shared/icons';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import PostableResults from './components/PostableResults';

import './PostableDropdown.scss';

interface PostableDropdownProps {
  onSelect: (item: any) => void;
  value?: any;
  location?: any;
}

function PostableDropdown({ onSelect, value, location }: PostableDropdownProps) {
  const i18n = useTranslation('createPost');
  const dispatch = useDispatch<any>();
  const [ results, setResults ] = useState({
    events: [],
    locations: [],
    organizations: [],
    timelines: [],
    custom_locations: [],
  });
  const [ selectedTab, setSelectedTab ] = useState<'Event' | 'Location' | 'Organization' | 'Timeline'>('Event');
  const [ selected, setSelected ] = useState<any>();
  const [ loading, setLoading ] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [ searchKey, setSearchKey ] = useState('');

  const handleSelect = (item: any, type: any) => {
    const i = {
      ...item,
      type,
    };

    setSelected(i);
    onSelect(i);
  };

  const handleSearch = async (query: string, loc: any = null) => {
    try {
      const params: any = {
        keyword: query,
      };
      if (loc) {
        params.latitude = loc.latitude;
        params.longitude = loc.longitude;
      }

      const [ events, locations, organizations, timelines ] = await Promise.all([
        dispatch(getEventsRequest(params)).$promise,
        dispatch(getLocationsRequest(params)).$promise,
        dispatch(getOrganizationsRequest(params)).$promise,
        dispatch(getTimelinesRequest(params)).$promise,
      ]);

      const s = new mapkit.Search();
      s.search(query, (err, d) => {
        if (!err) {
          const places: any = d.places.map((place: any) => {
            const p = {
              id: uuid(),
              name: place.name,
              address: place.formattedAddress,
              country_code: place.countryCode,
              latitude: +place.coordinate.latitude,
              longitude: +place.coordinate.longitude,
            };

            return p;
          });

          setResults({
            custom_locations: places,
            events: events?.data?.items?.filter((event: any) => event.type !== 'upcoming') || [],
            locations: locations?.data?.items || [],
            organizations: organizations?.data?.items || [],
            timelines: timelines?.data?.items || [],
          });
        } else {
          setResults({
            custom_locations: [],
            events: events?.data?.items?.filter((event: any) => event.type !== 'upcoming') || [],
            locations: locations?.data?.items || [],
            organizations: organizations?.data?.items || [],
            timelines: timelines?.data?.items || [],
          });
        }
      });

      setResults({
        ...results,
        events: events?.data?.items?.filter((event: any) => event.type !== 'upcoming') || [],
        locations: locations?.data?.items || [],
        organizations: organizations?.data?.items || [],
        timelines: timelines?.data?.items || [],
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(debounce((query: string, loc) => {
    handleSearch(query, loc);
  }, 3000), []);

  const onSearch = (v: string) => {
    setLoading(true);
    loadData(v, location);
    setSearchKey(v);
  };

  useEffect(() => {
    loadData(searchKey, location);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location, searchKey ]);

  useEffect(() => {
    if (value && !isEqual(value, selected)) {
      setSelected(value);
    }
  }, [ value, selected ]);

  return (
    <div>
      <UncontrolledDropdown className="postable-dropdown" direction="down" inNavbar>
        <DropdownToggle caret={false} className="fw-normal d-flex align-items-center justify-content-between w-100 dropdown-toggle">
          {selected ? (
            <div className="d-flex align-items-center justify-content-between w-100 position-relative">
              <div className="details text-start">
                <div className="text-uppercase text-placeholder mb-2 fw-normal caption3">
                  {i18n.label.postable}
                </div>
                <div className="d-flex align-items-center mb-1">
                  <Badge pill className="primary2 me-2">{(i18n.label as any)[selected.type]}</Badge>
                  <h6 className="fw-bold mb-0 text-truncate">{selected.name}</h6>
                </div>

                {selected.type === 'event' && (
                  <div className="description">{selected.description}</div>
                )}

                {selected.type === 'organization' && (
                  <div className="description">
                    {`${selected.followers_count || 0} ${LocaleService.getPluralizedTranslation(i18n.label.follower, selected.followers_count || 0, false)} • Est. ${dateToCalendar(selected.started_at)} ${selected.location?.name ? `• ${selected.location?.name}` : ''}`}
                  </div>
                )}

                <small className="text-placeholder text-wrap">
                  {selected.type === 'event'
                    && `${dateToCalendar(selected?.started_at)}, ${dateToTimeWithSeconds(selected?.started_at)} (${moment.tz(selected?.timezone).zoneAbbr()})`}
                  {selected.address || selected.location?.address}
                </small>
              </div>

              <div className="d-flex align-items-center">
                <Button
                  className="btn-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(undefined);
                    onSelect(undefined);
                  }}
                >
                  <CloseIcon fill="var(--bs-danger)" height={16} width={16} />
                </Button>

                <div className="divider" />

                <CaretDownIcon className="caret-down" />
              </div>
            </div>
          ) : (
            <div className="text-placeholder label">
              <SearchBar
                onSearch={onSearch}
                iconPlacement="left"
                loading={loading}
                placeholder={i18n.label.postable}
              />
              <CaretDownIcon className="caret-down" />
            </div>
          )}
        </DropdownToggle>
        <DropdownMenu className="w-100 p-3">
          <div className="d-flex justify-content-between">
            <Nav pills>
              <NavItem onClick={() => setSelectedTab('Event')}>
                <NavLink href="#" active={selectedTab === 'Event'}>
                  {i18n.label.events}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setSelectedTab('Organization')}>
                <NavLink href="#" active={selectedTab === 'Organization'}>
                  {i18n.label.organizations}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setSelectedTab('Timeline')}>
                <NavLink href="#" active={selectedTab === 'Timeline'}>
                  {i18n.label.timelines}
                </NavLink>
              </NavItem>
              <NavItem onClick={() => setSelectedTab('Location')}>
                <NavLink href="#" active={selectedTab === 'Location'}>
                  {i18n.label.locations}
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={selectedTab}>
            <TabPane tabId="Event">
              <PostableResults
                type="event"
                onSelect={handleSelect}
                items={results?.events || []}
              />
            </TabPane>
            <TabPane tabId="Location">
              <PostableResults
                type="location"
                onSelect={handleSelect}
                items={results?.locations || []}
                customItems={results?.custom_locations || []}
                keyword={searchKey}
                loading={loading}
              />
            </TabPane>
            <TabPane tabId="Organization">
              <PostableResults
                type="organization"
                onSelect={handleSelect}
                items={results?.organizations || []}
              />
            </TabPane>
            <TabPane tabId="Timeline">
              <PostableResults
                type="timeline"
                onSelect={handleSelect}
                items={results?.timelines || []}
              />
            </TabPane>
          </TabContent>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

export default PostableDropdown;
