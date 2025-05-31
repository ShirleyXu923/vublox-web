import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody } from 'reactstrap';

import useTranslation from '@shared/hooks/useTranslation';
import { SubstitutionIcon } from '@shared/icons';

import { getPlayerType } from './player-types';
import { Pin } from '../../components/pin';

import './GameCards.scss';

function SubstitutionCard({
  data = {}, created_at, date_format, homeTeam, awayTeam, player, relatedPlayer, hasExtender,
}:
{ data: any; created_at: any, date_format: string;
  homeTeam: any, awayTeam: any, player: any, relatedPlayer: any, hasExtender: boolean
}) {
  const i18n = useTranslation('eventPage');
  const team = data.competitor === 'home' ? homeTeam : awayTeam;
  const competitor = data.competitors?.find((c: any) => c.qualifier === data.competitor);
  const substitutedIn = data.players?.find((p: any) => p.type === 'substituted_in') || { name: data.player_name };
  const substitutedOut = data.players?.find((p: any) => p.type === 'substituted_out') || { name: data.related_player_name };
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
              <Badge className="primary2">
                <SubstitutionIcon width="15" className="me-1" />
                {i18n.label.substitution}
              </Badge>
            </div>
            <span className="ellipsis">
              •
            </span>
            <span>
              <Link to={`/organizations/${team?.id}`} className={classNames({ 'pe-none': !team?.id })} target="_blank">
                {competitor?.name}
              </Link>
            </span>
          </div>

          <div className="title mt-2">
            <span className="single-line">
              <span className="text-success">IN</span>
              <span className="highlight">
                <Link to={`/profile/${player?.client_id}`} className={classNames({ 'pe-none': !player?.client_id })} target="_blank">
                  {substitutedIn?.name}
                </Link>
              </span>
              <span>
                {`${getPlayerType(substitutedIn?.player_type, isSmScreen)} ${substitutedIn?.jersey_number ? `#${substitutedIn?.jersey_number}` : ''}`}
              </span>
            </span>
            <span className="ellipsis">
              •
            </span>
            <span className="text-danger">
              OUT
            </span>
            <span className="highlight">
              <Link to={`/profile/${relatedPlayer?.client_id}`} className={classNames({ 'pe-none': !relatedPlayer?.client_id })} target="_blank">
                {substitutedOut?.name}
              </Link>
            </span>
            <span>
              {`${getPlayerType(substitutedOut?.player_type, isSmScreen)} ${substitutedOut?.jersey_number ? `#${substitutedOut?.jersey_number}` : ''}`}
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default SubstitutionCard;
