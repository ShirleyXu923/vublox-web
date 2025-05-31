/* eslint-disable no-unneeded-ternary */
import _ from 'lodash';
import { useEffect, useState } from 'react';

function useValidate(form: any, config: any, keys: string[]) {
  const [ isValid, setIsValid ] = useState(true);

  const validate = () => {
    let valid = true;
    keys.map((key: string) => {
      const value = _.get(form, key);
      const rules = _.get(config, key);

      if (_.get(rules, 'required') && !value) {
        valid = false;
      }

      if (_.get(rules, 'min') && value?.length < _.get(rules, 'min')) {
        valid = false;
      }

      if (_.get(rules, 'max') && value?.length > _.get(rules, 'max')) {
        valid = false;
      }

      return key;
    });

    return valid;
  };

  useEffect(() => {
    setIsValid(validate());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ form ]);

  return isValid;
}

export default useValidate;
