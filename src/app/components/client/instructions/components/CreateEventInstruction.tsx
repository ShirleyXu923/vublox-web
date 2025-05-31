import './MainInstructionsPage.scss';
import React from 'react';
import {
  Badge,
  Col,
  Container,
  Row,
} from 'reactstrap';

import Step1 from '@assets/img/instructions/create-event/Step1.png';
import Step2 from '@assets/img/instructions/create-event/Step2.png';
import Step3 from '@assets/img/instructions/create-event/Step3.png';
import Step4A from '@assets/img/instructions/create-event/Step4A.png';
import Step4B from '@assets/img/instructions/create-event/Step4B.png';
import Step4C from '@assets/img/instructions/create-event/Step4C.png';
import Step4D from '@assets/img/instructions/create-event/Step4D.png';
import BackButton from '@shared/buttons/BackButton';
import useTranslation from '@shared/hooks/useTranslation';

function CreateEventInstruction() {
  const i18n = useTranslation('instructionsPage');

  return (
    <Container className="main-container instructions">
      <Container>
        <div className="mb-5">
          <BackButton />
        </div>
        <h2>{i18n.event.title}</h2>
        <Row className="mt-5 step">
          <Col>
            <div className="d-flex align-items-start gap-2">
              <Badge color="primary">1</Badge>
              <div className="b3">{i18n.event.step1}</div>
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step1} alt="step-1" />
            </div>
          </Col>
        </Row>
        <Row className="mt-5 step">
          <Col>
            <div className="d-flex align-items-start gap-2">
              <Badge color="primary">2</Badge>
              <div className="b3">{i18n.event.step2}</div>
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step2} alt="step-1" />
            </div>
          </Col>
        </Row>
        <Row className="mt-5 step">
          <Col>
            <div className="d-flex align-items-start gap-2">
              <Badge color="primary">3</Badge>
              <div className="b3">{i18n.event.step3}</div>
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step3} alt="step-1" />
            </div>
          </Col>
        </Row>
        <Row className="mt-5 step">
          <Col>
            <div className="d-flex align-items-start gap-2">
              <Badge color="primary">4</Badge>
              <div className="b3">{i18n.event.step4}</div>
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step4A} alt="step-1" />
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step4B} alt="step-1" />
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step4C} alt="step-1" />
            </div>
            <div className="mt-3">
              <img className="step-image" src={Step4D} alt="step-1" />
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default CreateEventInstruction;
