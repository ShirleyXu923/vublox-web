import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import {
  Button,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { getOrganizationsRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';

import FollowSelectionItem from './FollowSelectionItem';
import FollowSelectionPlaceholder from './FollowSelectionPlaceholder';
import './FollowSelection.scss';

const placeholder = Array(6).fill(null);

interface FollowSelectionProps {
  inModal?: boolean;
  onSubmit?: () => void;
}

function FollowSelection({ inModal, onSubmit }: FollowSelectionProps) {
  const i18n = useTranslation('onboarding');
  const interests = useSelector(({ Auth }: IRootState) => (Auth.user as any).interests || []);
  const [ loading, setLoading ] = useState(true);
  const [ organizations, setOrganizations ] = useState([]);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { logo } = useAppTheme();
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  const loadData = () => {
    dispatch(getOrganizationsRequest({
      category_ids: interests.map((i: any) => i.category_id),
    })).$promise
      .then(({ data }: any) => {
        setOrganizations(data.items);
      }).catch((e: any) => handleError(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="follow-selection">
      <div className="text-center">
        {!inModal && (
          <>
            <img src={logo} alt="Vublox" height={40} className="mb-5 follow-selection-logo" />
            <h6 className={`onboarding-interests-description fw-normal mb-5 ${isXsScreen ? 'mx-1' : 'mx-4'}`}>
              {i18n.label.followDescription}
            </h6>
          </>
        ) }
      </div>

      <div className="organizations">
        {inModal && (
          <div className="b3 mb-4">
            {i18n.label.followUsers}
          </div>
        )}
        {loading && placeholder.map((_, i) => (
          <FollowSelectionPlaceholder
            // eslint-disable-next-line react/no-array-index-key
            key={i}
          />
        ))}
        {organizations.map((o: any) => (
          <FollowSelectionItem key={o.id} item={o} />
        ))}
        {!loading && organizations.length === 0 && (
          <span className="text-muted">{i18n.label.emptyOrganizations}</span>
        )}
      </div>

      <Button
        block
        color="primary"
        className="mt-5 onboarding-continue-button"
        onClick={() => (onSubmit ? onSubmit() : navigate('/instructions/all'))}
      >
        {i18n.button.done}
      </Button>
    </div>
  );
}

export default FollowSelection;
