/* eslint-disable max-len */
import classNames from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { DropdownMenu, DropdownItem, Dropdown } from 'reactstrap';

import { IRootState } from '@app/store';
// import favIcon from '@assets/img/vublox-icon.png';
// import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';

import './SearchBarResults.scss';
import SearchBarItem from './SearchBarItem';
import { DescriptionPlaceholder, ImagePlaceholder, NamePlaceholder } from './SearchBarResultPlaceholder';

type SearchBarResultsProps = {
  data?: any;
  show?: boolean;
  searching?: boolean;
  selectedFilter: string[];
  loadMore: () => void;
};

function SearchBarResults({
  data, show, searching, selectedFilter, loadMore,
}: SearchBarResultsProps) {
  const i18n = useTranslation('systemWideSearch');

  const { items, meta } = data;

  const keyword = useSelector((state: IRootState) => state.Search.keyword);

  return (
    <div className="search-bar-results-container">
      <Dropdown toggle={() => {}}>
        <DropdownMenu
          className={classNames('search-bar-results', {
            show: (show && keyword),
          })}
        >
          <div id="scrollableDiv" className="scrollable-container">
            <InfiniteScroll
              dataLength={items?.length || 0}
              next={loadMore}
              hasMore={meta?.currentPage < meta?.totalPages}
              loader={(
                <DropdownItem className="search-item" disabled>
                  <div className="search-item-image me-2">
                    <ImagePlaceholder />
                  </div>
                  <div className="search-item-info b6 d-flex flex-column">
                    <p className="label mb-1 text-truncate">
                      <NamePlaceholder />
                    </p>
                    <p className="description mb-0 text-truncate">
                      <DescriptionPlaceholder />
                    </p>
                  </div>
                </DropdownItem>
              )}
              scrollableTarget="scrollableDiv"
              key={`${selectedFilter}-${keyword}`}
            >
              {items?.map((item: any) => (
                <SearchBarItem
                  key={`item-${item.type}-${item.id}`}
                  item={item}
                  selectedFilter={selectedFilter}
                />
              ))}
            </InfiniteScroll>

            {searching && (
              <DropdownItem className="search-item" disabled>
                <div className="search-item-image me-2">
                  <ImagePlaceholder />
                </div>
                <div className="search-item-info b6 d-flex flex-column">
                  <p className="label mb-1 text-truncate">
                    <NamePlaceholder />
                  </p>
                  <p className="description mb-0 text-truncate">
                    <DescriptionPlaceholder />
                  </p>
                </div>
              </DropdownItem>
            )}
          </div>

          {(!searching && items?.length === 0) && (
            <DropdownItem text className="text-center">
              {selectedFilter.length === 0
                ? i18n.label.NoOptionsSelected
                : i18n.label.empty}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default SearchBarResults;
