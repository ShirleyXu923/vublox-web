import './AboutPage.scss';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import AboutEclipse from '@assets/img/about-eclipse.png';
import MenInBlackDark from '@assets/img/men-in-black-dark.png';
import MenInBlackLight from '@assets/img/men-in-black-light.png';
import SoccerBallDark from '@assets/img/soccer-ball-dark.png';
import SoccerBallLight from '@assets/img/soccer-ball-light.png';
import useAppTheme from '@shared/hooks/useAppTheme';
import useTranslation from '@shared/hooks/useTranslation';

function AboutPage() {
  const i18n = useTranslation('aboutPage');
  const { theme } = useAppTheme();
  const SoccerBall = theme === 'light' ? SoccerBallLight : SoccerBallDark;
  const MenInBlack = theme === 'light' ? MenInBlackLight : MenInBlackDark;

  return (
    <Container fluid className="about-page full-container">
      <Container className="main-container">
        <Row className="section-row">
          <img src={SoccerBall} alt="" className="soccer-ball-1" />
          <img src={SoccerBall} alt="" className="soccer-ball-2" />
          <img src={SoccerBall} alt="" className="soccer-ball-3" />
          <Col md={8} className="title-group">
            <h1 className="page-title-text">{i18n.label.title}</h1>
            <div className="b1">{i18n.label.description}</div>
          </Col>
        </Row>
        <Row className="section-row">
          <img src={MenInBlack} alt="" className="mib" />
          <div className="content-row">
            <Col md={7} className="content-group">
              <h2>{i18n.label.meetVublox}</h2>
              <div className="b3">{i18n.label.meetVubloxDescription}</div>
            </Col>
          </div>
        </Row>
        <Row className="section-row last-row">
          <img src={SoccerBall} alt="" className="soccer-ball-4" />
          <img src={AboutEclipse} alt="" className="eclipse" />
          <div className="content-row">
            <Col md={12} className="content-group">
              <h2>{i18n.label.connectingHistoryAndSports}</h2>
              <div className="b3">{i18n.label.connectingHistoryAndSportsDescription}</div>
            </Col>
          </div>
        </Row>
      </Container>
    </Container>
  );
}

export default AboutPage;
