import _ from 'lodash';
import React from 'react';
import { Col, FormText } from 'reactstrap';

import { FieldType } from '@shared/forms/types';
import Input from '@shared/utils/Forms/Input/Input';

import { FormType } from '../../hooks/useFormFeature';

type UrlType = {
  facebook: FieldType;
  instagram: FieldType;
  tiktok: FieldType;
  x: FieldType;
  youtube: FieldType;
};

interface SocialInputProps {
  name: string;
  form: FormType;
  url: UrlType;
  icon: React.ReactElement;
  onInputChange: (e: any) => void;
}

function SocialInput({
  name,
  form,
  url,
  icon,
  onInputChange,
}: SocialInputProps) {
  return (
    <Col md={12}>
      <Input
        className="custom-form"
        name={_.get(url, `${name}.id`)}
        leftIcon={(
          <div className="prefix-container">
            <span className="label caption3">{_.get(url, `${name}.label`)}</span>
            <div className="prefix">
              {icon}
              <span className="b5">{_.get(url, `${name}.prefix`)}</span>
            </div>
          </div>
        )}
        value={_.get(form, `url.${name}`)}
        onChange={onInputChange}
        maxLength={_.get(url, `${name}.max`)}
        rightIcon={(
          <FormText>
            <small className="text-muted">
              {`${(_.get(form, `url.${name}`) as any)?.length || 0}/${_.get(url, `${name}.max`)}`}
            </small>
          </FormText>
        )}
      />
    </Col>
  );
}

export default SocialInput;
