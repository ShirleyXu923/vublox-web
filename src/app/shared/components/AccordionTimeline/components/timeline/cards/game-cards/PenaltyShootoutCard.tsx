import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { HourglassIcon, SportsIcon } from '@shared/icons';

import { Pin } from '../../components/pin';

import './GameCards.scss';

function PenaltyShootoutCard({
  data = {}, created_at, date_format, homeTeam, awayTeam, hasExtender,
}:
{ data: any; created_at: any, date_format: string;
  homeTeam: any, awayTeam: any, hasExtender: boolean
}) {
  const i18n = useTranslation('eventPage');
  const lhScore = data.home_score;
  const rhScore = data.away_score;
  const isHomeScore = data.competitor === 'home';

  return (
    <div className="game-card-container">
      <Pin height={100} withExtender={hasExtender} />

      <Card className="penalty-shootout">
        <CardBody>
          <div className="title">
            <div className="header">
              <div className="b6 me-1">
                {moment(created_at).format(date_format)}
              </div>
              <Badge className="penalty-shootout">
                <HourglassIcon width="12" className="me-1" />
                {i18n.label.penaltyShootout}
              </Badge>
            </div>
            <span className="highlight single-line">
              {i18n.label.penaltyShootoutDescription}
            </span>

            <span className={classNames({ highlight2: isHomeScore })}>
              {isHomeScore && (
                <SportsIcon className="goal-icon me-1 mb-1" width={14} height={14} />
              )}
              <Link to={`/organizations/${homeTeam?.id}`} className={classNames({ 'pe-none': !homeTeam?.id })} target="_blank">
                {homeTeam.name}
              </Link>
            </span>
            <span className={classNames({ highlight2: isHomeScore })}>
              {lhScore}
            </span>
            <span>
              -
            </span>
            <span className={classNames({ highlight2: !isHomeScore })}>
              {rhScore}
            </span>
            <span className={classNames({ highlight2: !isHomeScore })}>
              <Link to={`/organizations/${awayTeam?.id}`} className={classNames({ 'pe-none': !awayTeam?.id })} target="_blank">
                {awayTeam.name}
              </Link>
              {!isHomeScore && (
                <SportsIcon className="goal-icon ms-1 mb-1" width={14} height={14} />
              )}
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default PenaltyShootoutCard;
