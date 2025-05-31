import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import './Instructions.scss';

import useTranslation from '@shared/hooks/useTranslation';
import { OrganizationIcon } from '@shared/icons';
import EventIcon from '@shared/icons/EventIcon';
import PlusIcon from '@shared/icons/PlusIcon';
import TagUserIcon from '@shared/icons/TagUserIcon';
import TimelineIcon from '@shared/icons/TimelineIcon';
import VideoSquareIcon from '@shared/icons/VideoSquareIcon';

function Instructions() {
  const i18n = useTranslation('instructionsPage');
  return (
    <Container className="main-container instructions-page">
      <Container>
        <h2>{i18n.label.howTo}</h2>
        <Row className="mt-5">
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/create-post" />
            <VideoSquareIcon />
            <span className="b1">{i18n.label.createPost}</span>
          </Col>
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/create-event" />
            <EventIcon height={54} width={54} />
            <span className="b1">{i18n.label.createEvent}</span>
          </Col>
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/create-organization" />
            <OrganizationIcon height={54} width={54} />
            <span className="b1">{i18n.label.createOrganization}</span>
          </Col>
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/create-timeline" />
            <TimelineIcon height={54} width={54} />
            <span className="b1">{i18n.label.createTimeline}</span>
          </Col>
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/contribute" />
            <PlusIcon height={54} width={54} />
            <span className="b1">{i18n.label.contribute}</span>
          </Col>
          <Col className="col-btn" md={4}>
            <Link className="stretched-link" to="/instructions/content-type" />
            <TagUserIcon />
            <span className="b1">{i18n.label.defineYourContentType}</span>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Instructions;
