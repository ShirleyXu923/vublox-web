/* eslint-disable jsx-a11y/label-has-associated-control */
import { xor } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  FormGroup,
  Input,
} from 'reactstrap';

import { getViewersAnalyticsRequest } from '@reducers/analytics/AnalyticsAction';
import { handleError } from '@services/ErrorHandler';
import { shortNumberFormat } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, FilterIcon } from '@shared/icons';
import Select from '@shared/utils/Forms/Select/Select';

import DoughnutGraph from './DoughnutGraph';

import './ViewerData.scss';

function ViewerData({ query = {} }: { query: any }) {
  const i18n = useTranslation('analyticsPage');
  const dispatch = useDispatch<any>();
  const [ data, setData ] = useState<any>({});
  const [ show, setShow ] = useState(false);
  const [ filters, setFilters ] = useState<any>({
    filters: [ 'all', 'followers', 'non_followers' ],
    duration: undefined,
  });
  const [ filter, setFilter ] = useState([ 'all', 'followers', 'non_followers' ]);
  const [ duration, setDuration ] = useState<any>(undefined);

  const loadData = async () => {
    try {
      const { data: resp } = await dispatch(getViewersAnalyticsRequest({
        ...filters,
        ...query,
      })).$promise;
      setData(resp);
    } catch (e) {
      handleError(e);
    }
  };
  const handleToggle = () => {
    if (show) {
      setFilter(filters.filters);
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
      filters: filter,
      duration: duration?.value,
    }));
  };

  const handleSetFilter = (value: string) => {
    setFilter(s => {
      let newValue = xor(s, [ value ]);
      if (newValue.includes('followers') && newValue.includes('non_followers')) {
        newValue = [
          'all',
          ...newValue,
        ];
      } else if (newValue.includes('all') && !newValue.includes('followers') && !newValue.includes('non_followers')) {
        newValue = [
          ...newValue,
          'followers',
          'non_followers',
        ];
      } else {
        newValue = newValue.filter(v => v !== 'all');
      }
      return newValue;
    },
    );
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters, query ]);

  return (
    <div className="viewer-data">
      <div className="head d-flex justify-content-between align-items-center">
        <div className="b5 text-uppercase">{i18n.label.viewers}</div>
        <Dropdown isOpen={show} toggle={handleToggle}>
          <DropdownToggle className="dropdown-toggle">
            <div>
              <FilterIcon />&nbsp;
              {filters.filters.includes('all') ? i18n.label.allViewers : i18n.label.custom}
            </div>
            <CaretDownIcon width={17} height={17} />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem toggle={false} onClick={() => handleSetFilter('all')}>
              <FormGroup check>
                <Input type="checkbox" checked={filter.includes('all')} />
                <label className="form-check-label">
                  {i18n.label.allViewers}
                </label>
              </FormGroup>
            </DropdownItem>
            <DropdownItem toggle={false} onClick={() => handleSetFilter('followers')}>
              <FormGroup check>
                <Input type="checkbox" checked={filter.includes('followers')} />
                <label className="form-check-label">
                  {i18n.label.followers}
                </label>
              </FormGroup>
            </DropdownItem>
            <DropdownItem toggle={false} onClick={() => handleSetFilter('non_followers')}>
              <FormGroup check>
                <Input type="checkbox" checked={filter.includes('non_followers')} />
                <label className="form-check-label">
                  {i18n.label.nonFollowers}
                </label>
              </FormGroup>
            </DropdownItem>
            <DropdownItem
              toggle={false}
              onClick={() => {
                handleSetFilter('custom');
                setDuration(undefined);
              }}
            >
              <FormGroup check>
                <Input type="checkbox" checked={filter.includes('custom')} />
                <label className="form-check-label">
                  {i18n.label.custom}
                </label>
              </FormGroup>
            </DropdownItem>

            {filter.includes('custom') && (
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
                disabled={(filter.includes('custom') && !duration) || filter.length === 0}
              >
                {i18n.button.apply}
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="graphs d-flex align-items-center">
        <div className="doughnut">
          <DoughnutGraph data={[ data.followers, data.non_followers ]} />
        </div>
        <div className="data" style={{ width: '100%' }}>
          <div className="data-wrapper">
            <div className="data b5">
              <span className="text-body">{i18n.label.followers}</span>
              <div className="d-flex align-items-center bar-text">
                <div className="bar mx-2" style={{ background: 'var(--bs-primary)', width: `${((data.followers / data.total) * 50 || 1)}%` }} />
                <span>{shortNumberFormat(data.followers)} <span className="percent">({data.followers_percentage}%)</span></span>
              </div>
            </div>
            <div className="data b5">
              <span className="text-body">{i18n.label.nonFollowers}</span>
              <div className="d-flex align-items-center bar-text">
                <div className="bar mx-2" style={{ background: '#007888', width: `${((data.non_followers / data.total) * 50 || 1)}%` }} />
                <span>{shortNumberFormat(data.non_followers)} <span className="percent">({data.non_followers_percentage}%)</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewerData;
