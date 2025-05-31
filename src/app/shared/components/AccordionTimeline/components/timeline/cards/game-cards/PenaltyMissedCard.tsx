import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { PenaltyMissedIcon, SportsIcon } from '@shared/icons';

import { getPlayerType } from './player-types';
import { Pin } from '../../components/pin';

import './GameCards.scss';

function PenaltyMissedCard({
  data = {}, created_at, date_format, homeTeam, awayTeam, player, hasExtender,
}:
{ data: any; created_at: any, date_format: string;
  homeTeam: any, awayTeam: any, player: any, hasExtender: boolean
}) {
  const i18n = useTranslation('eventPage');
  const scorer = data.players?.find((p: any) => p.type === 'scorer') || { name: data.player_name };
  const competitor = data.competitors.find((p: any) => p.qualifier === 'home');
  const competitor2 = data.competitors.find((p: any) => p.id !== competitor.id);
  const lhScore = data.home_score;
  const rhScore = data.away_score;
  const isHomeScore = data.competitor === 'home';
  const isSmScreen = useMediaQuery({ query: '(max-width: 575px)' });

  return (
    <div className="game-card-container">
      <Pin height={100} withExtender={hasExtender} />

      <Card>
        <CardBody>
          <div className="title">
            <div className="header">
              <div className="b6 me-1">
                {moment(created_at).format(date_format)}
              </div>
              <Badge className="danger3">
                <PenaltyMissedIcon width="15" className="me-1" />
                {i18n.label.penaltyMiss}
              </Badge>
            </div>
            <span className="highlight single-line">
              <Link to={`/profile/${player?.client_id}`} className={classNames({ 'pe-none': !player?.client_id })} target="_blank">
                {`${scorer?.name || ''} `}
              </Link>
              <span className="fw-normal">
                {`${getPlayerType(scorer?.player_type, isSmScreen)} ${scorer?.jersey_number ? `#${scorer.jersey_number}` : ''}`}
              </span>
            </span>
            {scorer && (
              <span className="ellipsis">
                •
              </span>
            )}
            <span className={classNames({ highlight2: isHomeScore })}>
              {isHomeScore && (
                <SportsIcon className="goal-icon me-1 mb-1" width={14} height={14} />
              )}
              <Link to={`/organizations/${homeTeam?.id}`} className={classNames({ 'pe-none': !homeTeam?.id })} target="_blank">
                {competitor.name}
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
                {competitor2.name}
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

export default PenaltyMissedCard;
