/* eslint-disable jsx-a11y/label-has-associated-control */
import 'apple-mapkit-js';
import { xorBy } from 'lodash';
import moment from 'moment';
import React, {
  useEffect, useImperativeHandle, useReducer, useState,
} from 'react';
import RangeSlider from 'react-range-slider-input';
import { useDispatch, useSelector } from 'react-redux';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Dropdown,
  DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getCategoriesRequest, setAdvancedFiltersDispatch } from '@reducers/category/CategoryAction';
import { handleError } from '@services/ErrorHandler';
import TagsFilter from '@shared/components/EventTagsFilter/EventTagsFilter';
import LocationFilter from '@shared/components/LocationFilter/LocationFilter';
import useTranslation from '@shared/hooks/useTranslation';
import { FilterIcon } from '@shared/icons';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';

import OrganizationFilter from './OrganizationFilter';

import 'react-range-slider-input/dist/style.css';
import './AdvancedFilter.scss';

let loaderPromise: any;
export const filterLoader = (dispatch: any) => {
  loaderPromise = loaderPromise
  || dispatch(getCategoriesRequest({ keyword: 'sports' })).$promise
    .finally(() => { loaderPromise = null; });
  return loaderPromise;
};

interface PostEventFilterProps {
  upcoming?: boolean;
  inverse?: boolean;
  onApply?: (filters: any) => void;
}

export type PostEventFilterRef = {
  open: () => void;
};

function reducer(state: { filters: any; inverseFilters: any },
  action: { payload: any; type: string }) {
  if (action.type === 'inverse') {
    return {
      ...state,
      inverseFilters: {
        ...state.inverseFilters,
        ...action.payload || {},
      },
    };
  }

  return {
    ...state,
    filters: {
      ...state.filters,
      ...action.payload || {},
    },
  };
}

function PostEventFilter({ upcoming, inverse, onApply }: PostEventFilterProps,
  ref: React.ForwardedRef<any>) {
  const i18n = useTranslation('home');
  const selectedCategories = useSelector(({ Category }: IRootState) => Category.selectedFilters
   || []);
  const advancedFilters = useSelector(({ Category }: IRootState) => Category.advancedFilters
   || {});
  const categoriesCache = useSelector((state: IRootState) => state.Category.filters ?? []);
  const [ state, reducerDispatch ] = useReducer(reducer, {
    filters: { ...advancedFilters.filters, categories: selectedCategories },
    inverseFilters: {
      ...advancedFilters.inverseFilters,
      categories: xorBy(selectedCategories, categoriesCache,
        (c: any) => c.category_id ?? c.id),
    },
  });
  const filters = inverse ? state.inverseFilters : state.filters;
  const [ categories, setCategories ] = useState(categoriesCache);
  const [ show, setShow ] = useState(false);
  const [ activeTab, setActiveTab ] = useState('basic');
  const [ basicAccordion, setBasicAccordion ] = useState('sports');
  const [ advancedAccordion, setAdvancedAccordion ] = useState('location');
  const [ date, setDate ] = useState('any');
  const [ startDate, setStartDate ] = useState(null as any);
  const [ endDate, setEndDate ] = useState(null as any);
  const [ location, setLocation ] = useState(null as any);
  const [ coordinates, setCoordinates ] = useState(null as any);
  const [ radius, setRadius ] = useState(12 as any);
  const [ tags, setTags ] = useState<any[]>([]);
  const [ organizations, setOrganizations ] = useState<any[]>([]);
  const dispatch = useDispatch<any>();

  const toggleAccordion = (id: any, type = 'basic') => {
    const fn = type === 'basic' ? setBasicAccordion : setAdvancedAccordion;
    if (basicAccordion === id) {
      fn('');
    } else {
      fn(id);
    }
  };

  const setSelectedCategories = (selected: any) => {
    reducerDispatch({
      type: inverse ? 'inverse' : '',
      payload: { categories: selected },
    });
  };

  const handleSelectAll = () => {
    const isAllSelected = filters.categories.length > 0 && (categories.length
      === filters.categories.length);
    const newSelection = isAllSelected ? [] : categories;
    setSelectedCategories(newSelection);
  };

  const handleSelectCategory = (category: any) => {
    setSelectedCategories(xorBy(filters.categories, [ category ], (c) => c.category_id ?? c.id));
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoordinates({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  };

  const loadData = () => {
    filterLoader(dispatch)
      .then(({ data }: any) => {
        setCategories(data.find((d: any) => d.name === 'Sports')?.subCategories || []);
      })
      .catch((e: any) => handleError(e));
  };

  const apply = () => {
    const newFilters: any = {
      categories: filters.categories,
      tags,
      organizations,
    };

    switch (date) {
      case 'today':
        newFilters.start_date = moment().utc().startOf('day').toISOString();
        break;
      case 'yesterday':
        newFilters.start_date = moment().utc().subtract(1, 'day').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().subtract(1, 'day').endOf('day')
          .toISOString();
        break;
      case 'next_week':
        newFilters.start_date = moment().utc().add(1, 'week').startOf('day')
          .toISOString();
        newFilters.end_date = moment(newFilters.start_date).add(1, 'week').endOf('day').toISOString();
        break;
      case 'last_week':
        newFilters.start_date = moment().utc().subtract(1, 'week').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().endOf('day').toISOString();
        break;
      case 'custom':
        newFilters.start_date = moment(startDate).startOf('day').toISOString();
        newFilters.end_date = moment(endDate).endOf('day').toISOString();
        break;
      default:
        break;
    }

    if (location === 'radius') {
      newFilters.radius = radius;
      newFilters.coordinates = coordinates;
    }

    if (location === 'search' || location === 'current') {
      newFilters.coordinates = coordinates;
    }

    dispatch(setAdvancedFiltersDispatch({
      ...state,
      [inverse ? 'inverseFilters' : 'filters']: newFilters,
    }));

    onApply?.(newFilters);

    setShow(false);
  };

  const clearFilters = () => {
    setSelectedCategories(filters.categories || []);
    setLocation(null);
    setDate('');
    setRadius(12);
    setCoordinates({});
    setTags([]);
    setOrganizations([]);
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) {
      count++;
    }
    if (date) {
      count++;
    }
    if (location) {
      count++;
    }
    if (tags.length > 0) {
      count++;
    }
    if (organizations.length > 0) {
      count++;
    }
    return count;
  };

  const handleToggle = () => {
    if (show) {
      setSelectedCategories(filters.categories);
      setRadius((s: any) => filters.radius || s);
      setCoordinates((s: any) => filters.coordinates || s);
      setTags((s: any) => filters.tags || s);
      setOrganizations((s: any) => filters.organizations || s);
    }
    setShow(s => !s);
  };

  useEffect(() => {
    if (location === 'current' || location === 'radius') {
      getCurrentLocation();
    }
  }, [ location ]);

  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
  }));

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dropdown isOpen={show} className="post-event-filter" toggle={handleToggle}>
      <DropdownToggle className="dropdown-toggle d-flex align-items-center">
        <FilterIcon className="me-2" />
        <div className="d-flex align-items-center flex-fill text-start">
          {i18n.label.filters}

          {getFilterCount() > 0 && (
            <div className="filter-count ms-1">
              {getFilterCount()}
            </div>
          )}
        </div>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          text
          className="d-flex align-items-center justify-content-between"
        >
          <div className="b3">{i18n.label.filters}</div>
        </DropdownItem>

        <Nav tabs pills>
          <NavItem onClick={() => setActiveTab('basic')}>
            <NavLink active={activeTab === 'basic'}>
              {i18n.label.basic}
            </NavLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('advanced')}>
            <NavLink active={activeTab === 'advanced'}>
              {i18n.label.advanced}
            </NavLink>
          </NavItem>
          <NavItem className="flex-fill text-end">
            <Button
              size="sm"
              color="link"
              className="btn-clear p-0"
              onClick={clearFilters}
            >
              {i18n.button.clearAll}
            </Button>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="basic">
            <Accordion open={basicAccordion} toggle={(id) => toggleAccordion(id, 'basic')}>
              <AccordionItem>
                <AccordionHeader targetId="sports" className="collapse-toggler dropdown-item">
                  <div className="b3">
                    {i18n.label.sports}
                  </div>
                  {filters.categories.length > 0 && (
                    <div className="dot ms-2" />
                  )}
                </AccordionHeader>
                <AccordionBody accordionId="sports" className="sports">
                  <DropdownItem toggle={false} onClick={handleSelectAll}>
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        checked={filters.categories.length === categories.length}
                      />
                      <label className="form-check-label">
                        {i18n.label.allSports}
                      </label>
                    </FormGroup>
                  </DropdownItem>

                  {categories.map((c: any) => (
                    <DropdownItem key={c.id} onClick={() => handleSelectCategory(c)} toggle={false}>
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          checked={!!filters.categories.find((cat: any) => c.id === cat.category_id
                   || c.id === cat.id)}
                          onChange={() => handleSelectCategory(c)}
                        />
                        <label className="form-check-label">
                          {c.name}
                        </label>
                      </FormGroup>
                    </DropdownItem>
                  ))}
                </AccordionBody>
              </AccordionItem>

              <AccordionItem>
                <AccordionHeader targetId="date" className="collapse-toggler dropdown-item">
                  <div className="b3">
                    {i18n.label.date}
                  </div>

                  {!!date && (
                    <div className="dot ms-2" />
                  )}
                </AccordionHeader>
                <AccordionBody accordionId="date">
                  <DropdownItem toggle={false} onClick={() => setDate('any')}>
                    <FormGroup check>
                      <Input type="radio" checked={date === 'any'} />
                      <label className="form-check-label">
                        {i18n.label.anyDate}
                      </label>
                    </FormGroup>
                  </DropdownItem>
                  <DropdownItem toggle={false} onClick={() => setDate('today')}>
                    <FormGroup check>
                      <Input type="radio" checked={date === 'today'} />
                      <label className="form-check-label">
                        {i18n.label.today}
                      </label>
                    </FormGroup>
                  </DropdownItem>
                  {!upcoming && (
                    <DropdownItem toggle={false} onClick={() => setDate('yesterday')}>
                      <FormGroup check>
                        <Input type="radio" checked={date === 'yesterday'} />
                        <label className="form-check-label">
                          {i18n.label.yesterday}
                        </label>
                      </FormGroup>
                    </DropdownItem>
                  )}
                  {upcoming ? (
                    <DropdownItem toggle={false} onClick={() => setDate('next_week')}>
                      <FormGroup check>
                        <Input type="radio" checked={date === 'next_week'} />
                        <label className="form-check-label">
                          {i18n.label.nextWeek}
                        </label>
                      </FormGroup>
                    </DropdownItem>
                  ) : (
                    <DropdownItem toggle={false} onClick={() => setDate('last_week')}>
                      <FormGroup check>
                        <Input type="radio" checked={date === 'last_week'} />
                        <label className="form-check-label">
                          {i18n.label.lastWeek}
                        </label>
                      </FormGroup>
                    </DropdownItem>
                  )}
                  <DropdownItem toggle={false} onClick={() => setDate('custom')} className="d-block">
                    <FormGroup check>
                      <Input type="radio" checked={date === 'custom'} />
                      <label className="form-check-label">
                        {i18n.label.customDateRange}
                      </label>
                    </FormGroup>

                    {date === 'custom' && (
                      <div className="date-range row g-1">
                        <Col md={6}>
                          <DatePickerInput
                            label={i18n.label.startDate}
                            onChange={setStartDate}
                            selected={startDate}
                          />
                        </Col>
                        <Col md={6}>
                          <DatePickerInput
                            label={i18n.label.endDate}
                            onChange={setEndDate}
                            className="col-6"
                            selected={endDate}
                            minDate={startDate}
                          />
                        </Col>
                      </div>
                    )}
                  </DropdownItem>
                </AccordionBody>
              </AccordionItem>
            </Accordion>

          </TabPane>
          <TabPane tabId="advanced">
            <Accordion open={advancedAccordion} toggle={(id) => toggleAccordion(id, 'advanced')}>
              <AccordionItem>
                <AccordionHeader targetId="location" className="collapse-toggler dropdown-item">
                  <div className="b3">
                    {i18n.label.location}
                  </div>
                  {!!location && (
                    <div className="dot ms-2" />
                  )}
                </AccordionHeader>
                <AccordionBody accordionId="location">
                  <DropdownItem toggle={false} className="d-block" onClick={() => setLocation('radius')}>
                    <FormGroup check>
                      <Input type="radio" checked={location === 'radius'} />
                      <label className="form-check-label">
                        {i18n.label.customRadius}
                      </label>
                    </FormGroup>

                    {location === 'radius' && (
                      <div className="d-flex ms-4 py-3 align-items-center">
                        <RangeSlider
                          className="single-thumb"
                          defaultValue={[ 0, 12 ]}
                          thumbsDisabled={[ true, false ]}
                          rangeSlideDisabled
                          onInput={(r) => setRadius(r[1])}
                          min={1}
                          max={25}
                        />
                        <div className="radius">{radius}
                          <span className="text-muted"> km</span>
                        </div>
                      </div>
                    )}
                  </DropdownItem>

                  <DropdownItem toggle={false} onClick={() => setLocation('current')}>
                    <FormGroup check>
                      <Input type="radio" checked={location === 'current'} />
                      <label className="form-check-label">
                        {i18n.label.myCurrentLocation}
                      </label>
                    </FormGroup>
                  </DropdownItem>

                  <DropdownItem toggle={false} className="d-block" onClick={() => setLocation('search')}>
                    <FormGroup check>
                      <Input type="radio" checked={location === 'search'} />
                      <label className="form-check-label">
                        {i18n.label.searchLocation}
                      </label>
                    </FormGroup>

                    {location === 'search' && (
                      <LocationFilter
                        handleSetLocation={setCoordinates}
                        className="ms-4 my-2"
                        defaultValue={coordinates?.name}
                      />
                    )}
                  </DropdownItem>
                </AccordionBody>
              </AccordionItem>

              <AccordionItem>
                <AccordionHeader targetId="tags" className="collapse-toggler dropdown-item">
                  <div className="b3">
                    {i18n.label.tags}
                  </div>
                  {tags.length > 0 && (
                    <div className="dot ms-2" />
                  )}
                </AccordionHeader>
                <AccordionBody accordionId="tags">
                  <TagsFilter
                    tags={tags}
                    handleSelectTags={setTags}
                  />
                </AccordionBody>
              </AccordionItem>

              <AccordionItem>
                <AccordionHeader targetId="organizations" className="collapse-toggler dropdown-item">
                  <div className="b3">
                    {i18n.label.organizations}
                  </div>
                  {organizations.length > 0 && (
                    <div className="dot ms-2" />
                  )}
                </AccordionHeader>
                <AccordionBody accordionId="organizations" className="organizations">
                  <OrganizationFilter
                    organizations={organizations}
                    handleSelectOrganizations={setOrganizations}
                  />
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </TabPane>
        </TabContent>

        <DropdownItem divider className="mt-0" />

        <DropdownItem text toggle>
          <Button size="sm" color="primary" block onClick={apply}>
            {i18n.button.apply}
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default React.forwardRef<PostEventFilterRef, PostEventFilterProps>(PostEventFilter);
