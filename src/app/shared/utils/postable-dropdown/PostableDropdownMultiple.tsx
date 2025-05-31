import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledDropdown,
} from 'reactstrap';
import { v4 as uuid } from 'uuid';

import { getEventsRequest } from '@reducers/event/EventAction';
import { getLocationsRequest } from '@reducers/location/LocationAction';
import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { getTimelinesRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon } from '@shared/icons';

import EventOptionItem from './components/EventOptionItem';
import LocationOptionItem from './components/LocationOptionItem';
import OrganizationOptionItem from './components/OrganizationOptionItem';
import PostableResults from './components/PostableResults';
import TimelineOptionItem from './components/TimelineOptionItem';
import SearchBar from '../SearchBar/SearchBar';

type PostableDropdownMultipleProps = {
  postables: any;
  onSelect: (item: any, type: string) => void;
  onRemove: (id: string) => void;
};

function PostableDropdownMultiple({
  postables,
  onSelect,
  onRemove,
}: PostableDropdownMultipleProps) {
  const i18n = useTranslation('createPost');
  const dispatch = useDispatch<any>();
  const [ items, setItems ] = useState<any>(postables);
  const [ results, setResults ] = useState({
    events: [],
    locations: [],
    organizations: [],
    timelines: [],
    custom_locations: [],
  });
  const [ selectedTab, setSelectedTab ] = useState<'Event' | 'Location' | 'Organization' | 'Timeline'>('Event');
  const [ loading, setLoading ] = useState(false);
  const [ searchKey, setSearchKey ] = useState('');

  const handleSearch = async (query: string) => {
    try {
      const params = {
        keyword: query,
      };

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
  const loadData = useCallback(debounce((query: string) => {
    handleSearch(query);
  }, 3000), []);

  const onSearch = (v: string) => {
    setLoading(true);
    loadData(v);
    setSearchKey(v);
  };

  useEffect(() => {
    setItems(postables);
  }, [ postables ]);

  return (
    <div>
      <UncontrolledDropdown className="postable-dropdown" direction="down">
        <DropdownToggle caret={false} className="fw-normal d-flex align-items-center justify-content-between w-100 dropdown-toggle">
          <div className="text-placeholder label">
            <div>
              {i18n.label.postable}
            </div>
            <CaretDownIcon className="caret-down" />
          </div>
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
              <NavItem className="ml-auto search-item">
                <SearchBar
                  onSearch={onSearch}
                  iconPlacement="left"
                  loading={loading}
                  placeholder={i18n.label[`search${selectedTab}s`]}
                />
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={selectedTab}>
            <TabPane tabId="Event">
              <PostableResults
                type="event"
                onSelect={onSelect}
                items={results?.events || []}
              />
            </TabPane>
            <TabPane tabId="Location">
              <PostableResults
                type="location"
                onSelect={onSelect}
                items={results?.locations || []}
                customItems={results?.custom_locations || []}
                keyword={searchKey}
                loading={loading}
              />
            </TabPane>
            <TabPane tabId="Organization">
              <PostableResults
                type="organization"
                onSelect={onSelect}
                items={results?.organizations || []}
              />
            </TabPane>
            <TabPane tabId="Timeline">
              <PostableResults
                type="timeline"
                onSelect={onSelect}
                items={results?.timelines || []}
              />
            </TabPane>
          </TabContent>
        </DropdownMenu>
      </UncontrolledDropdown>
      <div className="mt-5 gap-4 d-flex flex-column">
        {items.map((item: any) => {
          if (item?.timeline) {
            return (
              <TimelineOptionItem
                key={item?.id}
                timeline={item?.timeline}
                onRemove={onRemove}
                item={item}
              />
            );
          }

          if (item?.organization) {
            return (
              <OrganizationOptionItem
                key={item?.id}
                organization={item?.organization}
                onRemove={onRemove}
                item={item}
              />
            );
          }

          if (item?.event) {
            return (
              <EventOptionItem
                key={item?.id}
                event={item?.event}
                onRemove={onRemove}
                item={item}
              />
            );
          }

          if (item?.location || item?.custom_location) {
            return (
              <LocationOptionItem
                key={item?.id}
                location={item?.location || item?.custom_location}
                item={item}
                onRemove={(onRemove)}
                isCustom={item?.custom_location !== null}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

export default PostableDropdownMultiple;
