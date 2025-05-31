import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { CardIcon } from '@shared/icons';

import { getPlayerType } from './player-types';
import { Pin } from '../../components/pin';

import './GameCards.scss';

function YellowCard({
  data = {}, created_at, date_format, homeTeam, awayTeam, player, hasExtender,
}:
{ data: any; created_at: any, date_format: string;
  homeTeam: any, awayTeam: any, player: any, hasExtender: boolean
}) {
  const i18n = useTranslation('eventPage');
  const team = data.competitor === 'home' ? homeTeam : awayTeam;
  const competitor = data.competitors?.find((c: any) => c.qualifier === data.competitor);
  const pl = data.players?.[0] || {};
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
              <Badge className="warning2">
                <CardIcon width="15" className="me-1" />
                {i18n.label.yellowCard}
              </Badge>
            </div>
            <span className="highlight">
              <Link to={`/organizations/${team?.id}`} className={classNames({ 'pe-none': !team?.id })} target="_blank">
                {competitor.name}
              </Link>
            </span>
            <span>
              •
            </span>
            <span className="highlight">
              <Link to={`/profile/${player?.client_id}`} className={classNames({ 'pe-none': !player?.client_id })} target="_blank">
                {pl.name}
              </Link>
            </span>
            <span>
              {`${getPlayerType(pl.player_type, isSmScreen)} ${pl.jersey_number ? `#${pl.jersey_number}` : ''}`}
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default YellowCard;
