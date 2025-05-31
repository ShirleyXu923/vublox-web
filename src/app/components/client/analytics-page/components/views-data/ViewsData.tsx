/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getViewsAnalyticsRequest } from '@reducers/analytics/AnalyticsAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import { CaretDownIcon, FilterIcon } from '@shared/icons';

import EntityFilter from './EntityFilter';
import LineGraph from './LineGraph';
import ChartFilter from '../chart-filter/ChartFilter';

function ViewsData({ onUpdate, query = {} }: { onUpdate: (summary: any) => void; query: any }) {
  const i18n = useTranslation('analyticsPage');
  const dispatch = useDispatch<any>();
  const view = useSelector(({ Analytics }: IRootState) => Analytics.view);
  const [ data, setData ] = useState<any>([]);
  const [ lineData, setLineData ] = useState([]);
  const [ show, setShow ] = useState(false);
  const [ filters, setFilters ] = useState<any>({
    page_type: 'all',
  });
  const [ type, setType ] = useState<any>({
    type: 'all',
  });

  const loadData = async () => {
    try {
      const { data: resp } = await dispatch(getViewsAnalyticsRequest({
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
      setType({
        type: filters.page_type,
        id: filters.page_id,
      });
    }
    setShow(s => !s);
  };

  const apply = () => {
    setShow(false);
    setFilters((s: any) => ({
      ...s,
      page_type: type.type,
      page_id: type.id,
    }));
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters, query ]);

  return (
    <div className="views-data">
      <div className="chart-filter">
        <ChartFilter onViewChange={handleViewChange} />
        <Dropdown isOpen={show} toggle={handleToggle}>
          <DropdownToggle className="dropdown-toggle">
            <div>
              <FilterIcon />&nbsp;
              {filters.page_type === 'all' ? i18n.label.entireProfle : i18n.label.specific}
            </div>
            <CaretDownIcon width={17} height={17} />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem toggle={false} onClick={() => setType({ type: 'all' })}>
              <FormGroup check>
                <Input type="radio" checked={type.type === 'all'} />
                <label className="form-check-label">
                  {i18n.label.entireProfle}
                </label>
              </FormGroup>
            </DropdownItem>
            <DropdownItem toggle={false} onClick={() => setType({ type: 'specific' })}>
              <FormGroup check>
                <Input type="radio" checked={type.type !== 'all'} />
                <label className="form-check-label">
                  {i18n.label.specific}
                </label>
              </FormGroup>
            </DropdownItem>

            {type.type !== 'all' && (
              <DropdownItem text className="ps-4 pe-1">
                <EntityFilter handleSelect={(e) => setType(e)} />
              </DropdownItem>
            )}
            <DropdownItem divider />

            <DropdownItem text toggle>
              <Button
                size="sm"
                color="primary"
                block
                onClick={apply}
                disabled={type.type !== 'all' && !type.id}
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

export default ViewsData;
