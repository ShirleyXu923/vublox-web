/* eslint-disable jsx-a11y/label-has-associated-control */
import { xorBy } from 'lodash';
import React, {
  useEffect,
  useImperativeHandle, useReducer, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dropdown,
  DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { setSelectedFiltersDispatch } from '@reducers/category/CategoryAction';
import { handleError } from '@services/ErrorHandler';
import { filterLoader } from '@shared/components/AdvancedFilter/AdvancedFilter';
import useTranslation from '@shared/hooks/useTranslation';
import { SportsIcon } from '@shared/icons';

import './EventFilter.scss';

interface EventFilterProps {
  handleApply: (filters: any[]) => void;
}

export type EventFilterRef = {
  open: () => void;
};

function reducer(state: { filters: any[] }, action: { payload: any[] }) {
  return { filters: action.payload || [] };
}

function EventFilter({ handleApply }: EventFilterProps,
  ref: React.ForwardedRef<any>) {
  const i18n = useTranslation('home');
  const selectedCategories = useSelector(({ Category }: IRootState) => Category.selectedFilters
   || []);
  const [ { filters }, reducerDispatch ] = useReducer(reducer, { filters: selectedCategories });
  const [ categories, setCategories ] = useState<any[]>([]);
  const [ show, setShow ] = useState(false);
  const dispatch = useDispatch<any>();

  const sortCategories = (cat: any[]) => {
    const selectedIds = new Set(filters.map((sc: any) => sc.category_id ?? sc.id));
    return [ ...cat ].sort((a, b) => {
      const aSelected = selectedIds.has(a.id);
      const bSelected = selectedIds.has(b.id);
      const compareVal = aSelected ? -1 : 1;
      return aSelected === bSelected ? a.name.localeCompare(b.name) : compareVal;
    });
  };

  const setSelectedCategories = (selected: any) => {
    reducerDispatch({ payload: selected });
  };

  const handleSelectAll = () => {
    const isAllSelected = filters.length > 0 && (categories.length
      === filters.length);
    const newSelection = isAllSelected ? [] : categories;
    setSelectedCategories(newSelection);
  };

  const handleSelectCategory = (category: any) => {
    setSelectedCategories(xorBy(filters, [ category ], (c) => c.category_id ?? c.id));
  };

  const loadData = () => {
    filterLoader(dispatch)
      .then(({ data }: any) => {
        const cat = data.find((d: any) => d.name === 'Sports')?.subCategories || [];
        setCategories(sortCategories(cat));
        setSelectedCategories(filters.length === 0 ? cat : filters);
      })
      .catch((e: any) => handleError(e));
  };

  const reset = () => {
    setSelectedCategories(selectedCategories);
  };

  const apply = () => {
    handleApply(filters);
    dispatch(setSelectedFiltersDispatch(filters));
    setShow(false);
  };

  const handleToggle = () => {
    if (show) {
      setSelectedCategories(selectedCategories);
    }
    setShow(s => !s);
  };

  useImperativeHandle(ref, () => ({
    open: () => setShow(true),
  }));

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!show) {
      setSelectedCategories(filters);
    }
  }, [ show, filters ]);

  useEffect(() => {
    setCategories((prevCategories: any[]) => sortCategories(prevCategories));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filters ]);

  return (
    <Dropdown isOpen={show} className="event-filter" toggle={handleToggle}>
      <DropdownToggle className="dropdown-toggle d-flex align-items-center">
        <SportsIcon className="me-2" />
        <div className="flex-fill text-start">
          {categories.length === selectedCategories.length ? i18n.label.allSports
            : `${selectedCategories.sort((a: any, b: any) => a.name.localeCompare(b.name))
              .slice(0, 3)
              .map((i: any) => i.name).join(', ')}${selectedCategories.length > 3 ? `, +${selectedCategories.length - 3}` : ''}` || i18n.label.allSports}
        </div>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem
          text
          className="d-flex align-items-center justify-content-between"
        >
          <h5 className="mb-0 fw-normal">{i18n.label.sports}</h5>
          <Button
            color="link"
            size="sm"
            onClick={reset}
          >
            {i18n.button.reset}
          </Button>
        </DropdownItem>
        <DropdownItem divider />

        <div className="sports">
          <DropdownItem toggle={false}>
            <FormGroup check>
              <Input
                id="all"
                type="checkbox"
                checked={categories.length === filters.length}
                onChange={handleSelectAll}
              />
              <label className="form-check-label" htmlFor="all">
                {i18n.label.allSports}
              </label>
            </FormGroup>
          </DropdownItem>

          {categories.map((c: any) => (
            <DropdownItem toggle={false} key={c.id}>
              <FormGroup check>
                <Input
                  id={c.name}
                  type="checkbox"
                  checked={!!filters.find((cat: any) => c.id === cat.category_id
                   || c.id === cat.id)}
                  onChange={() => handleSelectCategory(c)}
                />
                <label className="form-check-label" htmlFor={c.name}>
                  {c.name}
                </label>
              </FormGroup>
            </DropdownItem>
          ))}
        </div>

        <DropdownItem text toggle>
          <Button size="sm" color="primary" block onClick={apply} disabled={filters.length === 0}>
            {i18n.button.apply}
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default React.forwardRef<EventFilterRef, EventFilterProps>(EventFilter);
