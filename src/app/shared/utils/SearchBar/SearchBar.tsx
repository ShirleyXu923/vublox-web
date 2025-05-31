import classNames from 'classnames';
import React, {
  ChangeEvent, forwardRef, useImperativeHandle, useRef,
} from 'react';
import {
  Button, Input, InputProps, Spinner,
} from 'reactstrap';

import { CloseIcon, SearchIcon } from '@shared/icons';

import './SearchBar.scss';

interface SearchBarProps {
  onSearch: (keyword: string) => void
  placeholder?: string
  iconPlacement?: 'left' | 'right';
  inputProps?: InputProps;
  loading?: boolean
  clearable?: boolean
}

export interface SearchBarRef {
  clear: () => void;
  setValue: (value: any) => void;
}

function SearchBar({
  onSearch, placeholder, iconPlacement = 'left', inputProps, loading, clearable,
} : SearchBarProps, ref: React.ForwardedRef<SearchBarRef>,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearch(newValue);
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    setValue: (value: any) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    },
  }));

  return (
    <div className="search-bar">
      <Input
        {...inputProps}
        innerRef={inputRef}
        bsSize="sm"
        placeholder={placeholder || 'Search'}
        onChange={handleSearch}
      />
      <SearchIcon className={classNames({
        'search-icon-left': iconPlacement === 'left',
        'search-icon': iconPlacement === 'right',
      })}
      />

      {(clearable && inputRef.current?.value) && (
        <Button
          className="clear-button"
          size="sm"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = '';
              handleSearch({ target: { value: '' } } as any);
            }
          }}
        >
          <CloseIcon />
        </Button>
      )}
      {loading && <Spinner size="sm" />}
    </div>
  );
}

export default forwardRef<SearchBarRef, SearchBarProps>(SearchBar);
