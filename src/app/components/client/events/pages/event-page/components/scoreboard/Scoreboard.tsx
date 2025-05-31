import classNames from 'classnames';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { UncontrolledCollapse, Button, Collapse } from 'reactstrap';

import { ChevronUpIcon } from '@shared/icons';

import './Scoreboard.scss';

function Scoreboard({ event, toggle, isExpanded }: {
  event: any, toggle?: () => void, isExpanded?: boolean
}) {
  const home = event?.metadata?.competitors?.find?.((c: any) => c.qualifier === 'home');
  const away = event?.metadata?.competitors?.find?.((c: any) => c.qualifier === 'away');
  const CollapseComponent = toggle ? Collapse : UncontrolledCollapse;
  const collapseProps = toggle ? { isOpen: isExpanded } : { defaultOpen: true };
  const isSmallScreen = useMediaQuery({ query: '(max-width: 575px)' });
  return (
    <div className={`${isSmallScreen ? '' : 'mt-5'} scoreboard`}>
      <div className="scoreboard-content">
        <Button
          id="toggler-scoreboard"
          className="toggler header d-flex justify-content-center align-items-center"
          color="link"
          onClick={toggle}
        >
          {isExpanded && (
            <span className="b2 text-start flex-fill">{event?.owner?.name}</span>
          )}
          {!isExpanded && (
            <div className="d-flex justify-content-around align-items-center flex-fill">
              <span
                className="text-truncate"
                style={{ width: isSmallScreen ? '100px' : '200px' }}
                title={home.name}
              >
                {home.name}
              </span>
              <div className="d-flex align-items-center justify-content-center flex-grow-0 text-center" style={{ width: '50px' }}>
                <span className="fw-bold mx-1">{event.metadata?.home_score || 0}</span>
                <span className="mx-1"> - </span>
                <span className="fw-bold mx-1">{event.metadata?.away_score || 0}</span>
              </div>
              <span
                className="text-truncate"
                style={{ width: isSmallScreen ? '100px' : '200px' }}
                title={away.name}
              >
                {away.name}
              </span>
            </div>
          )}

          <ChevronUpIcon className="ms-2" />
        </Button>

        <CollapseComponent
          id="scoreboard"
          {...(toggle ? {} : { toggler: 'toggler-scoreboard' })}
          {...collapseProps}
        >
          <div className="flex-content"> {/* Adding this wrapper to isolate the scoreboard content */}
            <Link to={`/organizations/${event?.homeTeam?.id}`} target="_blank" className={classNames({ 'pe-none': !event?.homeTeam?.id })}>
              <div className="competitor">
                {home.image_path && <img src={home.image_path} alt="Home" className="team-logo" />}
                <div className="caption1">{home?.name}</div>
              </div>
            </Link>
            <div className="score">
              <div className="s1 fw-bold">
                {event.metadata?.home_score || 0}
              </div>
              <div className="s1 fw-bold">-</div>
              <div className="s1 fw-bold">
                {event.metadata?.away_score || 0}
              </div>
            </div>
            <Link to={`/organizations/${event?.awayTeam?.id}`} target="_blank" className={classNames({ 'pe-none': !event?.awayTeam?.id })}>
              <div className="competitor">
                {away.image_path && <img src={away.image_path} alt="Away" className="team-logo" />}
                <div className="caption1">{away?.name}</div>
              </div>
            </Link>
          </div>
        </CollapseComponent>
      </div>

    </div>
  );
}

export default Scoreboard;
