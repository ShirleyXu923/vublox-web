/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { xor } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,

  // Button,
} from 'reactstrap';

import LocaleService from '@services/LocaleService';
import DropdownIcon from '@shared/icons/DropdownIcon';
import GlowingDot from '@shared/icons/GlowingDot';
import SortIcon from '@shared/icons/SortIcon';
import Checkbox from '@shared/utils/Forms/Checkbox/Checkbox';

import './FilterButton.scss';
import SortButton from './SortButton';

// import SortButton from './SortButton';

// interface IMenuItem {
//   label?: string;
//   onClick?: () => void;
// }

interface FilterButtonProps {

  // Props for filters
  label?: string | any;
  sortIcon?: React.ReactElement | null;
  onSelect: (items: string[]) => void;

  // showFiltersOnly
  toggleOffcanvas?: () => void;

  // For time scale
  yearItems?: any
  onSelectTimeScale?: (item: any) => void;
  selectedTimeScaleLabel?: string

  // For Sort
  sortItems?: any[];
  sort?: any;
  onSelectSort?: (item: any) => void;

  // For centralized filter values
  selectedFilters?: string[];
  setSelectedFilters?: React.Dispatch<React.SetStateAction<string[]>>; // Removed | undefined
  isFixedFilters?: boolean;
  showHistorical?: boolean;
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

function FilterButton({
  label, sortIcon = <SortIcon />, onSelect,
  yearItems, onSelectTimeScale, selectedTimeScaleLabel, sortItems, sort, onSelectSort, selectedFilters, setSelectedFilters,
  isFixedFilters, showHistorical, toggleOffcanvas,
}: FilterButtonProps) {
  const i18n = LocaleService.getTranslations('timelinePage');
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ selected, setSelected ] = useState<string[]>(selectedFilters || []);
  const [ selectedSort, setSelectedSort ] = useState({ value: sort || 'latest-to-oldest' });
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });

  const handleToggle = toggleOffcanvas || (() => {
    setDropdownOpen(!dropdownOpen);
  });

  const screenHeight = window.screen.height;

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
    onSelect(selected);
    setSelectedFilters?.(selected);

    onSelectSort?.(selectedSort);
  };

  const formatLabel = () => {
    if (selectedFilters?.includes('all')) {
      return i18n.label.all;
    }

    if (selectedFilters && selectedFilters.length > 0) {
      return selectedFilters.map((s: any) => (i18n.label as any)[filters[s]]).join(', ');
    }
    return label; // Return default label if no filters are selected
  };

  const [ openItems, setOpenItems ] = useState<string[]>([ 'timescale', 'sort', 'filters' ]);

  const toggleAccordion = (itemId: string) => {
    setOpenItems((prevOpenItems) => (prevOpenItems.includes(itemId)
      ? prevOpenItems.filter((id) => id !== itemId)
      : [ ...prevOpenItems, itemId ]),
    );
  };

  useEffect(() => {
    if (isFixedFilters) {
      setDropdownOpen(false);
    }
  }, [ isFixedFilters ]);

  return (
    <>
      {/* Trigger for Offcanvas and Dropdown */}
      <Dropdown
        className="filter"
        isOpen={dropdownOpen}
        toggle={handleToggle}
        direction={screenHeight > 483 ? 'down' : 'end'}
      >
        <DropdownToggle className="dropdown" tag="span">
          <div className={`dropdown-button ${isXsScreen ? 'gap-0' : ''}`}>
            {sortIcon && (
              <div className="sort-icon">
                {sortIcon}
              </div>
            )}
            <span
              className="b5 text-truncate d-inline-block"
              style={{
                minWidth: '50px',
                maxWidth: isXsScreen ? '80px' : '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {label || formatLabel()}
            </span>
            <div className="dropdown-icon">
              <DropdownIcon />
            </div>
          </div>
        </DropdownToggle>
        {/* Dropdown for larger screens */}
        <DropdownMenu className="filter-menu p-0" container="body" strategy="fixed">
          {/* Shared Header */}
          {label && (
            <div className="head">
              <span className="b3 text-nowrap">{i18n.label.sortAndFilter}</span>
              <div
                className="text-danger text-nowrap"
                onClick={() => {
                  if (setSelectedFilters) {
                    setSelectedFilters([]);
                  }
                }}
              >{i18n.label.clearAll}
              </div>
            </div>
          )}

          {/* Accordion content for scrolledGameMode */}
          <Accordion
            flush
            open={openItems}
            toggle={toggleAccordion}
          >
            <AccordionItem style={{ border: 'none' }}>
              <AccordionHeader targetId="filters" className="collapse-toggler" style={{ border: 'none' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="b3 px-2 specific-inter-text-header">{i18n.label.filters}</span>
                  <GlowingDot />
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="filters" className="py-0" style={{ border: 'none' }}>
                <div className="filter-item specific-inter-text">
                  <Checkbox
                    label={i18n.label.all}
                    checked={selected?.includes('all')}
                    onChange={() => handleSelect('all')}
                  />
                </div>
                <div className="filter-item specific-inter-text">
                  <Checkbox
                    label={i18n.label.upcoming}
                    checked={selected?.includes('upcoming')}
                    onChange={() => handleSelect('upcoming')}
                  />
                </div>
                <DropdownItem text className="small mt-1">
                  {i18n.label.personal}
                </DropdownItem>
                <div className="filter-item pt-2 specific-inter-text">
                  <Checkbox
                    label={i18n.label.posts}
                    checked={selected?.includes('posts')}
                    onChange={() => handleSelect('posts')}
                  />
                </div>
                <div className="filter-item pt-2 specific-inter-text">
                  <Checkbox
                    label={i18n.label.personalPosts}
                    checked={selected?.includes('personal')}
                    onChange={() => handleSelect('personal')}
                  />
                </div>
                <div className="filter-item pt-2 specific-inter-text">
                  <Checkbox
                    label={i18n.label.taggedPosts}
                    checked={selected?.includes('tagged')}
                    onChange={() => handleSelect('tagged')}
                  />
                </div>
                <div className="filter-item pt-2 specific-inter-text">
                  <Checkbox
                    label={i18n.label.yourTags}
                    checked={selected?.includes('tags')}
                    onChange={() => handleSelect('tags')}
                  />
                </div>
                {showHistorical && (
                  <>
                    <DropdownItem text className="small mt-1">
                      {i18n.label.historical}
                    </DropdownItem>
                    <div className="filter-item pt-2 specific-inter-text">
                      <Checkbox
                        label={i18n.label.historicalPosts}
                        checked={selected?.includes('historical')}
                        onChange={() => handleSelect('historical')}
                      />
                    </div>
                  </>
                )}
              </AccordionBody>
            </AccordionItem>
            <hr className="m-0 my-1" style={{ width: '100%' }} />

            <AccordionItem style={{ border: 'none' }}>
              <AccordionHeader targetId="timescale" className="collapse-toggler">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="b3 px-2 specific-inter-text-header">Time Scale</span>
                  <GlowingDot />
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="timescale" className="p-0 ">
                <div className="bd-highlight mx-0 timescale-mobile-off-canvas">
                  <SortButton
                    onSelect={onSelectTimeScale as (item: any) => void}
                    label={
                      selectedTimeScaleLabel
                        ? (
                          <span style={{ color: 'var(--bs-secondary-text)', fontSize: '14px' }}>
                            {yearItems.find((item: any) => item?.value === selectedTimeScaleLabel)?.label}
                          </span>
                        )
                        : undefined
                    }
                    sortIcon={null}
                    items={yearItems}
                  />
                </div>
              </AccordionBody>
            </AccordionItem>
            <hr className="m-0 my-1" style={{ width: '100%' }} />

            <AccordionItem style={{ border: 'none' }}>
              <AccordionHeader targetId="sort" className="collapse-toggler">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="b3 px-2 specific-inter-text-header">Sort</span>
                  <GlowingDot />
                </div>
              </AccordionHeader>
              <AccordionBody accordionId="sort" className="py-0"> {/* Added class to control padding */}
                {sortItems?.map((item: any) => (
                  <div key={item?.label} className="filter-item  py-2 specific-inter-text">
                    <label>
                      <input
                        type="radio"
                        name="sortOptions"
                        value={item?.label}
                        checked={selectedSort.value === item?.value}
                        onChange={() => setSelectedSort(item)}
                        className="me-2"
                      />
                      <span>{item?.label}</span>
                    </label>
                  </div>
                ))}
              </AccordionBody>
            </AccordionItem>
            <hr className="m-0 my-1" style={{ width: '100%' }} />

          </Accordion>

          {/* Shared Apply Button */}
          <DropdownItem className="action py-0">
            <button type="button" className="btn btn-primary b6" onClick={applySelection}>
              {i18n.button.apply}
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default FilterButton;
