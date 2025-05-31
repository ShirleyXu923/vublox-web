import classNames from 'classnames';
import { debounce, xor } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Badge, Button, Dropdown, DropdownItem, DropdownMenu,
} from 'reactstrap';

import { getEventTagsRequest } from '@reducers/event/EventAction';
import { handleError } from '@services/ErrorHandler';
import useTranslation from '@shared/hooks/useTranslation';
import { CloseIcon } from '@shared/icons';
import SearchBar, { SearchBarRef } from '@shared/utils/SearchBar/SearchBar';

interface EventTagsFilterProps {
  tags: any[]
  handleSelectTags: (tags: any[]) => void
}

function EventTagsFilter({ tags, handleSelectTags }: EventTagsFilterProps) {
  const i18n = useTranslation('home');
  const [ searchResults, setSearchResults ] = useState<any[]>([]);
  const [ showResults, setShowResults ] = useState(false);
  const [ searching, setSearching ] = useState(false);
  const dispatch = useDispatch<any>();
  const ref = useRef<SearchBarRef>(null);

  const loadData = (query: string, exclude = []) => {
    dispatch(getEventTagsRequest({ keyword: query, exclude })).$promise
      .then((res: any) => setSearchResults(res.data.items))
      .catch((e: any) => handleError(e))
      .finally(() => setSearching(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce((query, exclude) => {
    loadData(query, exclude);
  }, 2000), []);

  const onSearch = (value: string) => {
    setShowResults(true);
    if (!value) return;

    setSearching(true);
    handleSearch(value, tags);
  };

  const handleSelectTag = (tag: any) => {
    const newTags = xor(tags, [ tag ]);
    setSearchResults((s: any) => s.filter((t: any) => !newTags.includes(t.name)));
    handleSelectTags(newTags);
    if (ref.current) {
      ref.current.clear();
    }
  };

  const handleDeleteTag = (tag: any) => {
    const newTags = xor(tags, [ tag ]);
    setSearchResults((s: any) => s.filter((t: any) => !newTags.includes(t.name)));
    handleSelectTags(newTags);
  };

  return (
    <Dropdown text className="mb-3 mx-3 position-relative">
      <SearchBar
        ref={ref}
        iconPlacement="left"
        placeholder={i18n.label.searchTags}
        onSearch={onSearch}
        loading={searching}
        inputProps={{
          onBlur: () => setTimeout(() => {
            setShowResults(false);
          }, 150),
          onFocus: () => setTimeout(() => {
            setShowResults(true);
          }, 150),
        }}
        clearable
      />

      <div className="tags">
        {tags.map(t => (
          <Badge key={t} pill className="tag">
            {t}
            <Button className="btn-delete" onClick={() => handleDeleteTag(t)}>
              <CloseIcon height={12} width={12} />
            </Button>
          </Badge>
        ))}
      </div>

      <DropdownMenu className={classNames({
        'py-2 dropdown-submenu w-100': true,
        show: showResults && searchResults.length > 0,
      })}
      >
        {searchResults.map((s: any) => (
          <DropdownItem key={s.id} toggle={false} onClick={() => handleSelectTag(s.name)}>
            {s.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default EventTagsFilter;
