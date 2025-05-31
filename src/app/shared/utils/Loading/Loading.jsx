import PropTypes from 'prop-types';
import * as React from 'react';
import './LoadingStyle.scss';
import { Row, Col, Container } from 'reactstrap';

function Loading({
  cover,
  show,
}) {
  if (!show) return null;
  return (
    <div className={`${cover ? 'full-screen' : 'loading'}`}>
      <Container>
        <Row className="align-items-center">
          <Col>
            <div className="spinner">
              <div className="rect1" />
              <div className="rect2" />
              <div className="rect3" />
              <div className="rect4" />
              <div className="rect5" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

Loading.propTypes = {
  cover: PropTypes.bool.isRequired,
  show: PropTypes.bool.isRequired,
};

export default Loading;
