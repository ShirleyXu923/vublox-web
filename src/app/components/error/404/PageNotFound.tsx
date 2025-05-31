import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CardTitle,
  Button,
  Container,
} from 'reactstrap';

import img from '@assets/img';
import useTranslation from '@shared/hooks/useTranslation';

import './PageNotFound.scss';

function PageNotFound() {
  const i18n = useTranslation('general');
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="accent left" />
      <div className="accent right" />

      <Container className="text-center">
        <img src={img[404]} height={180} alt="404" className="mb-3" />
        <CardTitle className="my-4 title2">
          {i18n.error.not_found.title}
        </CardTitle>
        <Button
          color="primary"
          className="btn-shadow w-25 mt-5"
          onClick={() => navigate('/')}
        >
          {i18n.button.go_home.name}
        </Button>
      </Container>
      {/* <main>
        <div className="container">
          <Row className="h-100">
            <Col xs="12" md="10" className="mx-auto my-auto">
              <Card className="auth-card">
                <div className="position-relative image-side ">
                  {/* <p className="text-body h2">MAGIC IS IN THE DETAILS</p> */}
      {/* <p className="white mb-0">Yes, it is indeed!</p> */}
      {/* </div>
                <div className="form-side">
                  <NavLink to="/" className="white">
                    <span className="logo-single" />
                  </NavLink>
                  <CardTitle className="mb-4">
                    {i18n.error.not_found.title}
                  </CardTitle>
                  <p className="mb-0 text-muted text-small mb-0">
                    {i18n.error.not_found.message}
                  </p>
                  <p className="display-1 font-weight-bold mb-5">404</p>
                  <Button
                    href="/"
                    color="primary"
                    className="btn-shadow"
                    size="lg"
                    title={i18n.button.go_home.title}
                  >
                    {i18n.button.go_home.name}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </main> */}
    </div>
  );
}

export default PageNotFound;
