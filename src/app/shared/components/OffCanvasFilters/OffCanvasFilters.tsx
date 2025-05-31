/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import classNames from 'classnames';
import { xor } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  DropdownItem,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import SortButton from '@shared/buttons/SortButton';
import GlowingDot from '@shared/icons/GlowingDot';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';
import SearchBar from '@shared/utils/SearchBar/SearchBar';

import './OffCanvasFilters.scss';

interface OffCanvasFiltersProps {
  offCanvasOpen: boolean;
  toggleOffCanvas: () => void;
  showFiltersOnly?: boolean;
  onSelectTimeScale?: (item: any) => void;
  onSelectFilter: (item: any) => void;
  yearItems: any[];
  onSelectSort: (item: any) => void;
  sortItems: any[];
  labelSort: string;
  selectedTimeScale?: string;
  updateCounter: (count: number) => void; // New prop
  onSearch: (value: string) => void;
  searching: boolean;
  showHistorical?: boolean;
  selectedFilters?: string[];
}

const filters: any = {
  all: 'all',
  upcoming: 'upcoming',
  personal: 'personalPosts',
  posts: 'posts',
  tagged: 'taggedPosts',
  tags: 'yourTags',
  historical: 'historical',
};

function OffCanvasFilters(
  {
    offCanvasOpen,
    toggleOffCanvas,
    showFiltersOnly,
    onSelectTimeScale,
    onSelectFilter,
    yearItems,
    onSelectSort,
    sortItems,
    labelSort,
    selectedTimeScale,
    updateCounter,
    onSearch,
    searching,
    showHistorical,
    selectedFilters,
  }: OffCanvasFiltersProps,
) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });

  const [ selected, setSelected ] = useState<string[]>(selectedFilters || []);
  const [ selectedLabel, setSelectedLabel ] = useState(labelSort);

  const handleSelect = (key: string) => {
    // Toggle the selected filter in and out of the selectedFilters array
    let newFilters = [];

    if (key === 'all') {
      newFilters = selected?.includes('all') ? [] : Object.keys(filters);
    } else {
      newFilters = xor(selected, [ key ]);

      if (newFilters.length !== Object.keys(filters).length) {
        newFilters = newFilters.filter((f) => f !== 'all');
      }

      if (newFilters.length === Object.keys(filters).length - 1 && !newFilters.includes('all')) {
        newFilters = Object.keys(filters);
      }
    }

    setSelected(newFilters);
  };

  const applySelection = () => {
    onSelectFilter(selected);
    updateCounter(selected.length);
    toggleOffCanvas();
  };

  const updateLabel = (item: any) => {
    setSelectedLabel(item?.label);
    if (onSelectSort) {
      onSelectSort(item);
    }
  };
  const [ openItems, setOpenItems ] = useState<string[]>([ 'timescale', 'sort', 'filters' ]);

  const toggleAccordion = (itemId: string) => {
    setOpenItems((prevOpenItems) => (prevOpenItems.includes(itemId)
      ? prevOpenItems.filter((id) => id !== itemId)
      : [ ...prevOpenItems, itemId ]),
    );
  };

  const selectedTimeScaleLabel = useMemo(() => yearItems.find(item => item.value === selectedTimeScale)?.label || selectedTimeScale, [ selectedTimeScale, yearItems ]);

  // Then use selectedLabel in your SortButton
  const clearAll = () => {
    setSelected([]);
    updateCounter(0); // Reset the counter to 0
  };
  return (
    <Offcanvas
      className={classNames('offcanvas-page', { offCanvasShow: offCanvasOpen, offCanvasHide: !offCanvasOpen })}
      isOpen={offCanvasOpen}
      toggle={toggleOffCanvas}
      direction="end"
      style={{ width: isSmScreen ? '75%' : undefined, padding: '0px' }}
    >
      <OffcanvasHeader toggle={toggleOffCanvas}>
        <span className="specific-inter-text-header">Sort & Filter</span>
        <span
          className="text-danger mx-3 clear-all-button"
          onClick={clearAll}
        >
          {i18n.button.clearAll}
        </span>
      </OffcanvasHeader>
      <hr className="mt-0" style={{ width: '100%' }} />

      <div className="bd-highlight mx-3 .search-mobile-off-canvas">
        <SearchBar onSearch={onSearch} iconPlacement="left" loading={searching} />
      </div>
      <hr className="m-0 mt-3 mb-2" style={{ width: '100%' }} />

      <OffcanvasBody className="p-0 ms-0">

        <Accordion flush open={openItems} toggle={toggleAccordion}>
          {/* Time Scale Accordion */}
          <AccordionItem style={{ border: 'none' }}>
            <AccordionHeader targetId="filters" className="collapse-toggler" style={{ border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="b3 px-2 specific-inter-text-header">{i18n.label.filters}</span>
                <GlowingDot />
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="filters" className="py-0 offcanvas-checkbox-container" style={{ border: 'none' }}> {/* Added class to control padding */}
              <div className="filter-item  pt-2 mb-1 specific-inter-text">
                <Checkbox
                  label={i18n.label.all}
                  checked={selected.includes('all')}
                  onChange={() => handleSelect('all')}
                />
              </div>
              <div className="filter-item  pt-2 mb-1 specific-inter-text">
                <Checkbox
                  label={i18n.label.upcoming}
                  checked={selected.includes('upcoming')}
                  onChange={() => handleSelect('upcoming')}
                />
              </div>
              <small>
                {i18n.label.personal}
              </small>
              <div className="filter-item pt-2 specific-inter-text">
                <Checkbox
                  label={i18n.label.posts}
                  checked={selected.includes('posts')}
                  onChange={() => handleSelect('posts')}
                />
              </div>
              <div className="filter-item pt-2 specific-inter-text">
                <Checkbox
                  label={i18n.label.personalPosts}
                  checked={selected.includes('personal')}
                  onChange={() => handleSelect('personal')}
                />
              </div>
              <div className="filter-item pt-2 specific-inter-text">
                <Checkbox
                  label={i18n.label.taggedPosts}
                  checked={selected.includes('tagged')}
                  onChange={() => handleSelect('tagged')}
                />
              </div>
              <div className="filter-item pt-2 mb-1 specific-inter-text">
                <Checkbox
                  label={i18n.label.yourTags}
                  checked={selected.includes('tags')}
                  onChange={() => handleSelect('tags')}
                />
              </div>
              {showHistorical && (
                <>
                  <small>
                    {i18n.label.historical}
                  </small>
                  <div className="filter-item pt-2 specific-inter-text">
                    <Checkbox
                      label={i18n.label.historicalPosts}
                      checked={selected.includes('historical')}
                      onChange={() => handleSelect('historical')}
                    />
                  </div>
                </>
              )}
            </AccordionBody>
          </AccordionItem>
          <hr className="m-0 mt-2 mb-2" style={{ width: '100%' }} />

          <AccordionItem style={{ border: 'none' }}>
            <AccordionHeader targetId="timescale" className="collapse-toggler">
              <div className="d-flex justify-content-between align-items-center">
                <span className="b3 px-2 specific-inter-text-header">Time Scale</span>
                <GlowingDot />
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="timescale" className="pt-1"> {/* Added class to control padding */}
              <div className="bd-highlight mx-0 timescale-mobile-off-canvas">
                <SortButton
                  onSelect={onSelectTimeScale as (item: any) => void}
                  label={<span className="specific-inter-text">{selectedTimeScaleLabel}</span>} // Use the found label
                  sortIcon={null}
                  items={yearItems}
                />
              </div>
            </AccordionBody>
          </AccordionItem>
          <hr className="m-0 my-2" style={{ width: '100%' }} />

          {/* Sort Accordion */}
          <AccordionItem style={{ border: 'none' }}>
            <AccordionHeader targetId="sort" className="collapse-toggler">
              <div className="d-flex justify-content-between align-items-center">
                <span className="b3 px-2 specific-inter-text-header">Sort</span>
                <GlowingDot />
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="sort" className="py-0">
              {sortItems?.map((item: any) => (
                <div key={item?.label} className="filter-item  py-2 specific-inter-text">
                  <label>
                    <input
                      type="radio"
                      id="offcanvas-radio-input"
                      name="sortOptions"
                      value={item?.label}
                      checked={selectedLabel === item?.label}
                      onChange={() => updateLabel(item)}
                      className="me-2"
                    />
                    <span>{item?.label}</span>
                  </label>
                </div>
              ))}
            </AccordionBody>
          </AccordionItem>
          <hr className="m-0 my-2" style={{ width: '100%' }} />

          {/* Filters Accordion */}

        </Accordion>

        <div className="d-flex justify-content-center mt-3">
          <button type="button" className="btn btn-primary b6 apply-button-offcanvas-filter" onClick={applySelection}>
            {i18n.button.apply}
          </button>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
}

export default OffCanvasFilters;
