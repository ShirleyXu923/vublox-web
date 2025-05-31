import classNames from 'classnames';
import { debounce, isEmpty } from 'lodash';
import React, {
  useCallback, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dropdown, DropdownItem, DropdownMenu, Nav, NavItem, NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getMyEventsRequest } from '@reducers/event/EventAction';
import { getMyPostsRequest } from '@reducers/post/PostAction';
import { getMyTimelinesRequest } from '@reducers/timeline/TimelineActions';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import SearchBar, { SearchBarRef } from '@shared/utils/SearchBar/SearchBar';

interface EntityFilterProps {
  handleSelect: (value: any) => void;
}

function EntityFilter({
  handleSelect,
}: EntityFilterProps) {
  const i18n = useTranslation('analyticsPage');
  const dispatch = useDispatch<any>();
  const account = useSelector(({ Auth }: IRootState) => Auth.account);
  const [ searchResults, setSearchResults ] = useState<any>({});
  const [ showResults, setShowResults ] = useState(false);
  const [ searching, setSearching ] = useState(false);
  const [ activeTab, setActiveTab ] = useState('events');

  const ref = useRef<SearchBarRef>(null);

  const handleSearch = async (query: string) => {
    try {
      const params = {
        search: query,
        ownerable_id: account.id,
        ownerable_type: account.type === 'user' ? 'Client' : 'Organization',
      };

      const [ events, posts, timelines ] = await Promise.all([
        dispatch(getMyEventsRequest(params)).$promise,
        dispatch(getMyPostsRequest(params)).$promise,
        dispatch(getMyTimelinesRequest(params)).$promise,
      ]);

      setSearchResults({
        events: events?.data?.items?.filter((event: any) => event.type !== 'upcoming') || [],
        posts: posts?.data?.items || [],
        timelines: timelines?.data?.items || [],
      });
      setShowResults(true);
    } catch (error) {
      handleError(error);
    } finally {
      setSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadData = useCallback(debounce((query: string) => {
    handleSearch(query);
  }, 3000), []);

  const onSearch = (v: string) => {
    setSearching(true);
    loadData(v);
  };

  const onSelect = (type: string, v: any) => {
    handleSelect({
      ...v,
      type,
    });
    ref.current?.setValue(v.name || v.title);
    setShowResults(false);
  };

  return (
    <Dropdown className="position-relative">
      <SearchBar
        ref={ref}
        iconPlacement="left"
        placeholder={i18n.placeholder.entitySearch}
        onSearch={onSearch}
        loading={searching}
        clearable
      />

      <DropdownMenu
        className={classNames('w-100 mt-2', {
          'dropdown-submenu': true,
          show: showResults && !isEmpty(searchResults),
        })}
      >
        <Nav tabs pills>
          <NavItem onClick={() => setActiveTab('events')}>
            <NavLink active={activeTab === 'events'}>
              {i18n.label.events}
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('posts')}>
            <NavLink active={activeTab === 'posts'}>
              {i18n.label.posts}
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('timelines')}>
            <NavLink active={activeTab === 'timelines'}>
              {i18n.label.timeline}
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="events">
            {searchResults.events?.map((s: any) => (
              <DropdownItem
                key={s.id}
                onClick={() => onSelect('Event', s)}
                toggle={false}
                className="d-block"
              >
                {s.name || s.title}
              </DropdownItem>
            ))}
          </TabPane>
          <TabPane tabId="posts">
            {searchResults.posts?.map((s: any) => (
              <DropdownItem
                key={s.id}
                onClick={() => onSelect('Post', s)}
                toggle={false}
                className="d-block"
              >
                {s.name || s.title}
              </DropdownItem>
            ))}
          </TabPane>
          <TabPane tabId="timelines">
            {searchResults.timelines?.map((s: any) => (
              <DropdownItem
                key={s.id}
                onClick={() => onSelect('Timeline', s)}
                toggle={false}
                className="d-block"
              >
                {s.name || s.title}
              </DropdownItem>
            ))}
          </TabPane>
        </TabContent>
      </DropdownMenu>
    </Dropdown>
  );
}

export default EntityFilter;
