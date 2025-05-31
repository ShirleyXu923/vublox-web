import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';

import { IRootState } from '@app/store';
import { setChartViewDispatch } from '@reducers/analytics/AnalyticsAction';
import useLazyEffect from '@shared/hooks/useLazyEffect';
import useTranslation from '@shared/hooks/useTranslation';

import './ChartFilter.scss';

function ChartFilter({ onViewChange }: { onViewChange: (view: string) => void }) {
  const i18n = useTranslation('analyticsPage');
  const dispatch = useDispatch<any>();
  const view = useSelector(({ Analytics }: IRootState) => Analytics.view);

  const setView = (v: string) => {
    dispatch(setChartViewDispatch(v));
  };

  useLazyEffect(() => {
    onViewChange(view);
  }, [ view ]);

  return (
    <ButtonGroup>
      <Button
        color="primary"
        outline
        onClick={() => setView('number')}
        active={view === 'number'}
      >
        {i18n.label.number}
      </Button>
      <Button
        color="primary"
        outline
        onClick={() => setView('percentage')}
        active={view === 'percentage'}
      >
        {i18n.label.percentage}
      </Button>

    </ButtonGroup>
  );
}

export default ChartFilter;
