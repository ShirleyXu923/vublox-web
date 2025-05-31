/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import React, { KeyboardEventHandler, useEffect, useState } from 'react';
import {
  components,
  GroupBase,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { SelectProps } from '../Select/Select';
import './TagsInput.scss';

type TagsInputProps<Option, IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Async extends boolean = false,
  Createable extends boolean = true> = {
    onChange: (newValue: any[]) => void;
    maxLength?: number;
  } & SelectProps<Option, IsMulti, Group, Async, Createable>;

function TagsInput<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  Async extends boolean = false,
  >({
  onChange, maxLength,
  isClearable = false,
  ...rest
}: TagsInputProps<Option, IsMulti, Group, Async, true>) {
  const [ inputValue, setInputValue ] = useState('');
  const [ value, setValue ] = useState<any[]>((rest.defaultValue as any) || []);

  const createOption = (label: string) => ({
    label,
    value: label,
  });

  const MAX_CUSTOM_TAGS = 5;

  // Helper function to safely get custom tag count // Ensure defaultTags is always an array
  const getCustomTagCount = (currentTags: any[] = [], defaultTags: any[] = []) => currentTags.length - (defaultTags || []).length;

  // Avoid duplicates by comparing tag values in a case-insensitive manner
  const isDuplicateTag = (tags: any[] = [], newTag: string = '') => tags.some(({ value: tagValue }) => tagValue.toLowerCase() === newTag.toLowerCase());

  const handleKeyDown: KeyboardEventHandler = (event) => {
  // Ensure maxLength is handled consistently
    const effectiveMaxLength = maxLength ?? MAX_CUSTOM_TAGS;

    // Ensure inputValue is a non-empty string and check if maxLength is reached
    if (!inputValue || value.length === effectiveMaxLength) return;

    // Ensure defaultValue is treated as an array (empty array if undefined or null)
    const defaultTags = Array.isArray(rest.defaultValue) ? rest.defaultValue : [];
    // Ensure value is treated as an array (empty array if undefined or null)
    const currentTags = Array.isArray(value) ? value : [];

    // Ensure inputValue is a non-empty string and check custom tag count against maxLength
    if (!inputValue || getCustomTagCount(currentTags, defaultTags) >= effectiveMaxLength) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
      // Check if the tag already exists, avoid duplicates
        if (value.find(({ value: v }) => v === inputValue)) return;

        // Avoid duplicates by checking if the tag already exists
        if (isDuplicateTag(currentTags, inputValue)) return;
        // Add new tag and clear input value
        setValue((prev) => [
          ...(Array.isArray(prev) ? prev : []),
          createOption(inputValue),
        ]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    onChange(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ value ]);
  const [ menuIsOpen, setMenuIsOpen ] = useState(false);

  return (
    <CreatableSelect
      {...rest}
      classNamePrefix="react-select"
      isMulti
      createable
      menuIsOpen={
        menuIsOpen
          && (
            isClearable
              ? value.length < (maxLength ?? 5) // Prevent menu if total tags reach maxLength
              : value.length - (Array.isArray(rest.defaultValue) ? rest.defaultValue.length : 0) < (maxLength ?? 5)
          )
      }
      onFocus={() => setMenuIsOpen(true)}
      onBlur={() => setMenuIsOpen(false)}
      placeholder={(
        <div>
          Enter Tags... {rest.required && <span className="text-danger">*</span>}
        </div>
      )}
      inputValue={inputValue}
      isClearable={isClearable}
      noOptionsMessage={() => null}
      onChange={(newValue) => {
        if (isClearable) {
          // Clearable behavior
          if (Array.isArray(newValue) && newValue.length <= (maxLength ?? 5)) {
            setValue(newValue);
            onChange(newValue);
          }
        } else {
          // Non-clearable behavior
          setValue(newValue as any);
        }
      }}
      onInputChange={setInputValue}
      formatCreateLabel={(newInputValue: string) => `Add "${newInputValue}"`}
      onKeyDown={handleKeyDown}
      value={value}
      components={{
        MultiValueRemove: ({ data, ...restProps }) => {
          const defaultValues = Array.isArray(rest.defaultValue)
            ? (rest.defaultValue as { value: string; label: string }[])
            : [];
          const isDefaultTag = defaultValues.some(
            (defaultTag) => defaultTag.value === (data as { value: string }).value,
          );

          if (isClearable) {
            return (
              <div
                className="tags-input-dark-circle-container"
              >
                <components.MultiValueRemove data={data} {...restProps} />
              </div>
            );
          }
          return isDefaultTag ? null : (
            <div
              className="tags-input-dark-circle-container"
            >
              <components.MultiValueRemove data={data} {...restProps} />
            </div>
          );
        },
        IndicatorsContainer: () => null,
      }}
    />
  );
}

export default TagsInput;
