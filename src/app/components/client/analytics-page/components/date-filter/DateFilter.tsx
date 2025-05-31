/* eslint-disable jsx-a11y/label-has-associated-control */
import moment from 'moment';
import React, { useState } from 'react';
import {
  Button,
  Col,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  FormGroup,
  Input,
  Row,
} from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, FilterIcon } from '@shared/icons';
import DatePickerInput from '@shared/utils/Forms/DatePickerInput/DatePickerInput';

function DateFilter({ onChange }: { onChange: (dateFilters: any) => void }) {
  const i18n = useTranslation('analyticsPage');
  const [ show, setShow ] = useState(false);
  const [ filters, setFilters ] = useState({
    date: 'all',
  });
  const [ dateFilter, setDateFilter ] = useState('all');
  const [ startDate, setStartDate ] = useState(null as any);
  const [ endDate, setEndDate ] = useState(null as any);

  const handleToggle = () => {
    if (!show) {
      setDateFilter(filters.date);
    }
    setShow(!show);
  };

  const apply = () => {
    const newFilters: any = {};
    switch (dateFilter) {
      case 'last7Days':
        newFilters.start_date = moment().utc().subtract(7, 'days').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().endOf('day')
          .toISOString();
        break;
      case 'last30Days':
        newFilters.start_date = moment().utc().subtract(30, 'days').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().endOf('day')
          .toISOString();
        break;
      case 'last3Months':
        newFilters.start_date = moment().utc().subtract(3, 'months').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().endOf('day')
          .toISOString();
        break;
      case 'lastYear':
        newFilters.start_date = moment().utc().subtract(1, 'year').startOf('day')
          .toISOString();
        newFilters.end_date = moment().utc().endOf('day')
          .toISOString();
        break;
      case 'custom':
        newFilters.start_date = moment(startDate).startOf('day').toISOString();
        newFilters.end_date = moment(endDate).endOf('day').toISOString();
        break;
      default:
        break;
    }
    setFilters({ date: dateFilter });
    onChange(newFilters);
    setShow(false);
  };

  return (
    <div className="chart-filter">
      <Dropdown isOpen={show} toggle={handleToggle} className="date-filter">
        <DropdownToggle className="dropdown-toggle">
          <div>
            <FilterIcon />&nbsp;
            {(i18n.label as any)[filters.date as any]}
          </div>
          <CaretDownIcon width={17} height={17} />
        </DropdownToggle>

        <DropdownMenu end>
          <DropdownItem toggle={false} onClick={() => setDateFilter('all')}>
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'all'} />
              <label className="form-check-label">
                {i18n.label.all}
              </label>
            </FormGroup>
          </DropdownItem>
          <DropdownItem toggle={false} onClick={() => setDateFilter('last7Days')}>
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'last7Days'} />
              <label className="form-check-label">
                {i18n.label.last7Days}
              </label>
            </FormGroup>
          </DropdownItem>
          <DropdownItem toggle={false} onClick={() => setDateFilter('last30Days')}>
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'last30Days'} />
              <label className="form-check-label">
                {i18n.label.last30Days}
              </label>
            </FormGroup>
          </DropdownItem>
          <DropdownItem toggle={false} onClick={() => setDateFilter('last3Months')}>
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'last3Months'} />
              <label className="form-check-label">
                {i18n.label.last3Months}
              </label>
            </FormGroup>
          </DropdownItem>
          <DropdownItem toggle={false} onClick={() => setDateFilter('lastYear')}>
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'lastYear'} />
              <label className="form-check-label">
                {i18n.label.lastYear}
              </label>
            </FormGroup>
          </DropdownItem>
          <DropdownItem
            toggle={false}
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setDateFilter('custom');
            }}
          >
            <FormGroup check>
              <Input type="radio" checked={dateFilter === 'custom'} />
              <label className="form-check-label">
                {i18n.label.custom}
              </label>
            </FormGroup>
          </DropdownItem>

          {dateFilter === 'custom' && (
            <Row className="px-3 pt-1 mb-n2">
              <Col xs={6}>
                <DatePickerInput
                  label={i18n.label.startDate}
                  onChange={setStartDate}
                  className="col-6"
                  selected={startDate}
                />
              </Col>
              <Col xs={6}>
                <DatePickerInput
                  label={i18n.label.endDate}
                  onChange={setEndDate}
                  className="col-6"
                  selected={endDate}
                  minDate={startDate}
                />
              </Col>
            </Row>
          )}

          <DropdownItem divider />
          <DropdownItem text toggle>
            <Button
              size="sm"
              color="primary"
              block
              onClick={apply}
              disabled={dateFilter === 'custom' && (!startDate || !endDate)}
            >
              {i18n.button.apply}
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default DateFilter;
