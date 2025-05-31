import classNames from 'classnames';
import moment from 'moment-timezone';
import React, { useState } from 'react';
import { GroupBase, SingleValueProps, components } from 'react-select';
import { Badge } from 'reactstrap';

import LocaleService from '@services/LocaleService';
import Select, { SelectProps } from '@shared/utils/Forms/Select/Select';

import './TimezonePicker.scss';

function SingleValue<
Option,
IsMulti extends boolean = false,
Group extends GroupBase<Option> = GroupBase<Option>,
>(props: SingleValueProps<Option, IsMulti, Group>) {
  const i18n = LocaleService.getTranslations('general');
  const {
    children, getValue, selectProps,
  } = props;
  const tz = moment.tz.guess();
  const [ value ] = getValue() as any;

  return (
    <components.SingleValue
      {...props}
      className={classNames({
        'd-none': selectProps.menuIsOpen,
      })}
    >
      {children} {value.value === tz && <Badge pill>{i18n.label.localTimeZone}</Badge>}
    </components.SingleValue>
  );
}

function TimezonePicker(props: SelectProps<{ label: string, value: string }>) {
  const i18n = LocaleService.getTranslations('general');
  const tz = moment.tz.guess();
  const [ timezones ] = useState(moment.tz.names()
    .sort((a, b) => moment.tz(a).utcOffset() - moment.tz(b).utcOffset())
    .map(timezone => ({ label: `(GMT${moment.tz(timezone).format('Z')}) ${timezone}`, value: timezone })));
  const [ defaultValue ] = useState({ label: `(GMT${moment.tz(tz).format('Z')}) ${tz}`, value: tz });

  return (
    <Select
      {...props}
      classNamePrefix="react-select"
      className="timezone-picker"
      options={timezones}
      label={i18n.label.timeZone}
      placeholder={i18n.label.timeZone}
      required
      components={{
        SingleValue,
      }}
      defaultValue={defaultValue}
    />
  );
}

export default TimezonePicker;
