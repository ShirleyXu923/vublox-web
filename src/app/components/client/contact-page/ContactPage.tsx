import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import './ContactPage.scss';
import ContactEclipse1 from '@assets/img/contact-eclipse-1.png';
import ContactEclipse2 from '@assets/img/contact-eclipse-2.png';
import ContactImage1 from '@assets/img/contact-image-test.jpeg';
import useTranslation from '@shared/hooks/useTranslation';
import ContactEmailIcon from '@shared/icons/ContactEmailIcon';

function ContactPage() {
  const i18n = useTranslation('contactPage');

  useEffect(() => {
    const html = document.querySelector('html');

    if (html) {
      html.style.overflow = 'hidden';
    }

    const unMount = () => {
      if (html) {
        html.style.overflow = 'auto';
      }
    };

    return unMount;
  }, []);

  return (
    <Container fluid className="contact-page">
      <img className="float-image-1" src={ContactImage1} alt="" />
      <img className="float-image-2" src={ContactImage1} alt="" />
      <img className="eclipse-1" src={ContactEclipse1} alt="" />
      <img className="eclipse-2" src={ContactEclipse2} alt="" />
      <Container className="main-container">
        <div className="text-box">
          <Row>
            <Col md={12}>
              <h1 className="h1">{i18n.label.title}</h1>
              <div className="s4 description">{i18n.label.description}</div>
            </Col>
          </Row>
          <div className="separator" />
          <Row>
            <Col md={12} className="links">
              <Link to="mailto:enquiries@vublox.com" className="link">
                <ContactEmailIcon />
                <div className="texts">
                  <div className="s2">{i18n.label.sendEmail}</div>
                  <div className="s5">enquiries@vublox.com</div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
    </Container>
  );
}

export default ContactPage;
