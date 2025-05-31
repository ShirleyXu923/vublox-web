import { xor } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
} from 'reactstrap';

import { saveClientInterestsRequest } from '@reducers/app/AppAction';
import { getCategoriesRequest } from '@reducers/category/CategoryAction';
import { handleError } from '@services/ErrorHandler';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';

import InterestsSelectionPlaceholder from './InterestsSelectionPlaceholder';

const placeholder = Array(20).fill(null);

interface InterestsSelectionProps {
  onSuccess: () => void;
}

function InterestsSelection({ onSuccess }: InterestsSelectionProps) {
  const i18n = useTranslation('onboarding');
  const [ categories, setCategories ] = useState([]);
  const [ selected, setSelected ] = useState<any[]>([]);
  const [ loading, setLoading ] = useState(true);
  const dispatch = useDispatch<any>();
  const { logo } = useAppTheme();

  const loadData = () => {
    dispatch(getCategoriesRequest({ keyword: 'sports' })).$promise
      .then(({ data }: any) => {
        setCategories(data.find((d: any) => d.name === 'Sports')?.subCategories || []);
      })
      .catch((e: any) => handleError(e))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelect = (category: any) => {
    setSelected((s: any) => xor(s, [ category.id ]));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(saveClientInterestsRequest({ category_ids: selected })).$promise;
      onSuccess();
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="text-center">
        <img src={logo} alt="Vublox" height={40} className="mb-5 interests-selection-logo" />
        <h2 className="mb-3 onboarding-welcome-text">{i18n.label.welcome}</h2>
        <h6 className="fw-normal mb-5 mx-3 onboarding-interests-description">
          {i18n.label.interestsDescription}
        </h6>
      </div>

      <div className="categories">
        {loading && placeholder.map((_, i) => (
          <InterestsSelectionPlaceholder
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          />
        ))}
        {categories.map((c: any) => (
          <Button
            key={c.id}
            onClick={() => handleSelect(c)}
            outline={!selected.includes(c.id)}
            color="primary"
          >{c.name}
          </Button>
        ))}
      </div>

      <Button
        block
        color="primary onboarding-continue-button"
        className="mt-5"
        disabled={selected.length === 0}
        onClick={handleSubmit}
      >
        {i18n.button.continue}
      </Button>
    </div>
  );
}

export default InterestsSelection;
