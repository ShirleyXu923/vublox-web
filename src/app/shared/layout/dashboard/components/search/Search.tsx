// src/app/shared/layout/dashboard/components/search/Search.tsx
import _, { xor } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useDispatch,
  // useSelector,
  useSelector,
} from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import {
  Button, DropdownItem, DropdownMenu, DropdownToggle,
  FormGroup, Input, Label, Spinner, UncontrolledCollapse, UncontrolledDropdown,
} from 'reactstrap';
import { AnyAction } from 'redux';
import { ActionFunctionAny } from 'redux-actions';

// import { IRootState } from '@app/store';
import { IRootState } from '@app/store';
import { clearSearchResultsRequest, setKeywordRequest, systemWideSearchRequest } from '@reducers/search/SearchAction';
import usePrevious from '@shared/hooks/usePrevious';
import useTranslation from '@shared/hooks/useTranslation';
import { ChevronDownIcon, CloseIcon, SearchIcon } from '@shared/icons';
import ClearIcon from '@shared/icons/ClearIcon';

import SearchBarResults from '../search-bar-results/SearchBarResults';
import './Search.scss';

type SearchOptionType = {
  value: string;
  label: string;
};

function Search({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) {
  const i18n = useTranslation('general');
  const i18nSearch = useTranslation('systemWideSearch');
  const isSmScreen = useMediaQuery({ query: '(max-width: 767px)' });
  const [ searching, setSearching ] = useState(false);
  const [ showSearchResults, setShowSearchResults ] = useState(false);
  const [ searchOptions ] = useState([
    { value: 'all', label: i18nSearch.label.all },
    { value: 'Events', label: i18nSearch.label.events },
    { value: 'Timelines', label: i18nSearch.label.timelines },
    { value: 'Organizations', label: i18nSearch.label.organizations },
    { value: 'Users', label: i18nSearch.label.profiles },
    { value: 'Locations', label: i18nSearch.label.locations },
    { value: 'Posts', label: i18nSearch.label.posts },
  ]);
  const [ categories ] = useState([
    { value: 'Sports', label: i18nSearch.label.sports },
    { value: 'Entertainment', label: i18nSearch.label.entertainment },
    { value: 'Historical', label: i18nSearch.label.historical },
    { value: 'Technology', label: i18nSearch.label.technology },
  ]);
  const [ selectedOptions, setSelectedOptions ] = useState(searchOptions
    .map((o) => o.value));
  const [ selectedCategories, setSelectedCategories ] = useState(categories
    .map((o) => o.value));
  const [ page, setPage ] = useState(1);

  const dispatch: ActionFunctionAny<AnyAction> = useDispatch();

  const { results, keyword } = useSelector((state: IRootState) => ({
    results: state.Search.results,
    keyword: state.Search.keyword,
  }));
  const prevKeyword = usePrevious(keyword);
  const prevFilter = usePrevious(selectedOptions);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(_.debounce((query) => {
    setSearching(true);

    if (query.filter.length === 0) {
      setSearching(false);
      return;
    }

    dispatch(systemWideSearchRequest(query)).$promise
      .then(() => setSearching(false))
      .catch(() => setSearching(false));
  }, 500), []);

  useEffect(() => {
    if (!keyword) return;
    const newPage = prevKeyword !== keyword || prevFilter !== selectedOptions ? 1 : page;
    setPage(newPage);

    // Clear results if no filters are selected
    if (selectedOptions.length === 0) {
      dispatch(clearSearchResultsRequest());
      setSearching(false);
      return;
    }
    handleSearch({
      keyword,
      page: newPage,
      limit: !selectedOptions.includes('all') ? 10 : 3,
      filter: selectedOptions,
      categories: selectedCategories,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ page, keyword, prevKeyword, selectedOptions, prevFilter, selectedCategories ]);

  const handleInputChange = async (value: string) => {
    dispatch(setKeywordRequest(value));
  };

  const toggleSelectedOptions = (option: SearchOptionType) => {
    setSelectedOptions((s) => {
      const newValue = xor(s, [ option.value ]);

      if (option.value === 'all') {
        if (!s.includes('all')) {
          setSelectedCategories(categories.map((o) => o.value)); // Select all categories
          return searchOptions.map((o) => o.value);
        }
        setSelectedCategories([]);
        return [];
      } if (newValue.length === searchOptions.length || (!newValue.includes('all') && newValue.length === searchOptions.length - 1)) {
        return searchOptions.map((o) => o.value);
      }

      return newValue.filter((v) => v !== 'all');
    });
  };

  const toggleSelectedCategories = (option: any) => {
    setSelectedCategories((s) => {
      if (option.value === 'all') {
        if (s.length === categories.length) {
          return [];
        }
        return categories.map((o) => o.value);
      }

      const newValue = xor(s, [ option.value ]);
      return newValue;
    });
  };

  const renderSearchContainer = () => (
    <>
      <div className="search d-flex">
        <div className="search-select">
          <UncontrolledDropdown inNavbar>
            <DropdownToggle color="link" size="sm" className="dropdown-select">
              <span className={`text-truncate ${selectedOptions.length === 0 ? 'placeholder-text' : ''}`}>
                {/* eslint-disable-next-line no-nested-ternary */}
                {selectedOptions.length === 0
                  ? i18nSearch.label.select || 'Select'
                  : selectedOptions.includes('all')
                    ? i18nSearch.label.all
                    : selectedOptions.map((option) => (i18nSearch.label as any)[option.toLowerCase()]).join(', ')}
              </span>
              <ChevronDownIcon width={18} />
            </DropdownToggle>

            <DropdownMenu>
              {searchOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  toggle={false}
                  onClick={() => toggleSelectedOptions(option)}
                >
                  <FormGroup check>
                    <Input type="checkbox" checked={selectedOptions.includes(option.value)} />
                    <Label check>
                      {option.label}
                    </Label>
                  </FormGroup>
                </DropdownItem>
              ))}

              <DropdownItem
                id="toggler-categories"
                toggle={false}
                onClick={() => toggleSelectedCategories({ value: 'all' })}
              >
                <FormGroup check>
                  <Input type="checkbox" checked={categories.length === selectedCategories.length} />
                  <Label check className="categories-label">
                    {i18nSearch.label.categories}
                    <ChevronDownIcon width={18} />
                  </Label>
                </FormGroup>
              </DropdownItem>
              <UncontrolledCollapse toggler="toggler-categories" className="categories-dropdown">
                {categories.map((option) => (
                  <DropdownItem
                    key={option.value}
                    toggle={false}
                    onClick={() => toggleSelectedCategories(option)}
                  >
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        checked={selectedCategories.includes(option.value)}
                      />
                      <Label check>
                        {option.label}
                      </Label>
                    </FormGroup>
                  </DropdownItem>
                ))}
              </UncontrolledCollapse>

            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="search-input-container position-relative">
          <span className="search-icon-left">
            <SearchIcon />
          </span>
          <Input
            bsSize="sm"
            placeholder={i18n.placeholder.search}
            value={keyword}
            onChange={({ target }) => handleInputChange(target.value)}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => {
              setShowSearchResults(false);
            }, 150)}
          />
          <span className="search-icon">
            {keyword && (
              <Button color="link" size="sm" onClick={() => handleInputChange('')}>
                <ClearIcon />
              </Button>
            )}
            {searching && (
              <Spinner size="sm" color="primary" className="me-2" />
            )}
          </span>
          {!isSmScreen && (
            <SearchBarResults
              data={results}
              show={showSearchResults}
              searching={searching}
              selectedFilter={selectedOptions}
              loadMore={() => setPage(page + 1)}
            />
          )}
        </div>
      </div>
      {isSmScreen && (
        <>
          <Button color="link" size="sm" onClick={toggle}>
            <CloseIcon />
          </Button>
          <SearchBarResults
            data={results}
            show={showSearchResults}
            searching={searching}
            selectedFilter={selectedOptions}
            loadMore={() => setPage(page + 1)}
          />
        </>
      )}
    </>
  );

  if (isOpen && isSmScreen) {
    return renderSearchContainer();
  }

  return isSmScreen ? (
    <Button
      color="link"
      size="sm"
      onClick={toggle}
    >
      <SearchIcon />
    </Button>
  ) : (
    renderSearchContainer()
  );
}

export default Search;
