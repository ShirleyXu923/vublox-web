/* eslint-disable jsx-a11y/label-has-associated-control */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  AccordionBody, AccordionHeader, AccordionItem, Button, Col,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, UncontrolledAccordion,
} from 'reactstrap';

import EventTagsFilter from '@shared/components/EventTagsFilter/EventTagsFilter';
import useTranslation from '@shared/hooks/useTranslation';
import { FilterIcon } from '@shared/icons';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';

import './MapFilter.scss';

interface MapFilterProps {
  filters: any;
  handleApply: (filters: any) => void;
  upcoming?: boolean;
}

function MapFilter({ filters = {}, handleApply, upcoming }: MapFilterProps) {
  const i18n = useTranslation('worldEvents');
  const [ show, setShow ] = useState(false);
  const [ date, setDate ] = useState('');
  const [ startDate, setStartDate ] = useState(null as any);
  const [ endDate, setEndDate ] = useState(null as any);
  const [ tags, setTags ] = useState<any[]>([]);

  const apply = () => {
    const newFilters: any = {
      tags,
    };

    switch (date) {
      case 'today':
        newFilters.start_date = moment().utc().startOf('day').toISOString();
        newFilters.end_date = moment().utc().endOf('day').toISOString();
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
        newFilters.start_date = moment(startDate).utc().startOf('day').toISOString();
        newFilters.end_date = moment(endDate).utc().endOf('day').toISOString();
        break;
      default:
        break;
    }

    handleApply(newFilters);
    setShow(false);
  };

  const getFilterCount = () => {
    let count = 0;
    if (date) {
      count++;
    }
    if (tags.length > 0) {
      count++;
    }
    return count;
  };

  useEffect(() => {
    if (!show) {
      setTags((s: any) => filters.tags || s);
    }
  }, [ show, filters ]);

  return (
    <Dropdown isOpen={show} className="map-filter" toggle={() => setShow(s => !s)}>
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

        <UncontrolledAccordion defaultOpen="date" toggle={() => {}}>
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
              <EventTagsFilter
                tags={tags}
                handleSelectTags={setTags}
              />
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>

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

export default MapFilter;
