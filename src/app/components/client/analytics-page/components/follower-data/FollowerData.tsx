/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getFollowersAnalyticsRequest } from '@reducers/analytics/AnalyticsAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, FilterIcon } from '@shared/icons';
import Select from '@shared/utils/Forms/Select/Select';

import LineGraph from './LineGraph';
import ChartFilter from '../chart-filter/ChartFilter';

function FollowerData({ onUpdate, query = {} }: { onUpdate: (summary: any) => void; query: any }) {
  const i18n = useTranslation('analyticsPage');
  const dispatch = useDispatch<any>();
  const [ data, setData ] = useState<any>([]);
  const [ lineData, setLineData ] = useState([]);
  const [ show, setShow ] = useState(false);
  const [ filters, setFilters ] = useState({
    filter: 'all',
    duration: undefined,
  });
  const [ filter, setFilter ] = useState('all');
  const [ duration, setDuration ] = useState<any>(undefined);
  const view = useSelector(({ Analytics }: IRootState) => Analytics.view);

  const loadData = async () => {
    try {
      const { data: resp } = await dispatch(getFollowersAnalyticsRequest({
        ...filters,
        ...query,
      })).$promise;
      setData(resp.data);
      setLineData(resp.data?.map((r: any) => ({
        x: r.date,
        y: r.count,
      })));
      onUpdate(resp.summary);
    } catch (e) {
      handleError(e);
    }
  };

  const handleViewChange = (v: string) => {
    setLineData(data.map((r: any) => ({
      x: r.date,
      y: v === 'number' ? r.count : r.percentage,
    })));
  };

  const handleToggle = () => {
    if (show) {
      setFilter(filters.filter);
      setDuration({
        label: (i18n.label as any)[filters.duration as any],
        value: filters.duration,
      });
    }
    setShow(s => !s);
  };

  const apply = () => {
    setShow(false);
    setFilters((s: any) => ({
      ...s,
      filter,
      duration: duration?.value,
    }));
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters, query ]);

  return (
    <div className="followers-data">
      <div className="chart-filter">
        <ChartFilter onViewChange={handleViewChange} />
        <Dropdown isOpen={show} toggle={handleToggle}>
          <DropdownToggle className="dropdown-toggle">
            <div>
              <FilterIcon />&nbsp;
              {filters.filter === 'all' ? i18n.label.allFollowers : i18n.label.custom}
            </div>
            <CaretDownIcon width={17} height={17} />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem toggle={false} onClick={() => setFilter('all')}>
              <FormGroup check>
                <Input type="radio" checked={filter === 'all'} />
                <label className="form-check-label">
                  {i18n.label.allFollowers}
                </label>
              </FormGroup>
            </DropdownItem>
            <DropdownItem toggle={false} onClick={() => setFilter('custom')}>
              <FormGroup check>
                <Input type="radio" checked={filter === 'custom'} />
                <label className="form-check-label">
                  {i18n.label.custom}
                </label>
              </FormGroup>
            </DropdownItem>

            {filter === 'custom' && (
              <DropdownItem text className="ps-4 pe-1">
                <Select
                  options={[
                    { label: i18n.label['1d'], value: '1d' },
                    { label: i18n.label['7d'], value: '7d' },
                    { label: i18n.label['30d'], value: '30d' },
                    { label: i18n.label['6m'], value: '6m' },
                    { label: i18n.label['1y'], value: '1y' },
                    { label: i18n.label['1y+'], value: '1y+' },
                  ]}
                  placeholder={i18n.label.followDuration}
                  onChange={value => setDuration(value)}
                  formGroupProps={{ noMargin: true }}
                  value={duration}
                />
              </DropdownItem>
            )}
            <DropdownItem divider />

            <DropdownItem text toggle>
              <Button
                size="sm"
                color="primary"
                block
                onClick={apply}
                disabled={filter === 'custom' && !duration}
              >
                {i18n.button.apply}
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <LineGraph data={lineData} type={view as any} />
    </div>
  );
}

export default FollowerData;
