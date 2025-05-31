import classNames from 'classnames';
import React, { FormEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button, Card, CardBody, CardImg, CardText, CardTitle,
  Col, Container, Form, FormFeedback, FormGroup, Input, InputGroup,
  InputGroupText,
  Label,
  Row,
  Spinner,
} from 'reactstrap';

import img from '@assets/img';
import { createLeadRequest } from '@reducers/lead/LeadAction';
import { handleError } from '@services/ErrorHandler';
import LocaleService from '@services/LocaleService';
import {
  ClockIcon, CrownIcon, EmailIcon, EmailStarIcon,
  TimelinePinIcon, UserIcon,
} from '@shared/icons';

import './LandingPage.scss';

function LandingPage() {
  const i18n = LocaleService.getTranslations('landing');
  const [ email, setEmail ] = useState('');
  const navigate = useNavigate();
  const [ firstName, setFirstName ] = useState('');
  const [ errors, setErrors ] = useState<any>({});
  const [ loading, setLoading ] = useState(false);
  const dispatch = useDispatch<any>();
  const form = useRef<any>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);
      await dispatch(createLeadRequest({ email, first_name: firstName })).$promise;
      setEmail('');
      setFirstName('');
      toast.success(i18n.success.createLead);
    } catch (err: any) {
      const { response } = err || {};
      const { errors: errs } = response?.data || {};
      if (response?.status === 422) {
        setErrors(errs);
        return;
      }

      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Left this one commented as it can be used when the flow of the landing page changes later
   */
  // const handleScrollToForm = () => {
  //   form.current.scrollIntoView();
  // };

  return (
    <Container fluid className="landing-page g-0 px-0">
      <div
        style={{
          backgroundImage: `url(${img.landing1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
        className="d-flex flex-column align-items-center py-4 pt-5 mt-5"
      >
        <h2 className="my-3 text-center title">{i18n.title}</h2>
        <p className="text-center">
          {i18n.label.description}
        </p>

        <Button
          color="primary"
          className="btn-main mt-4"
          onClick={() => navigate('/world-events')}
        >
          {i18n.button.getEarlyAccess}
        </Button>

        <img src={img.landingDetail} width="60%" style={{ objectFit: 'cover' }} alt="Landing Detail" className="mt-5" />

        <p className="text-center my-5">
          {i18n.label.description2}
        </p>
      </div>

      <div className="position-relative overflow-hidden pb-5">
        <Row className="g-0">
          <Col md={7} className="d-flex align-items-center justify-content-center">
            <img src={img.landing2} width="70%" style={{ objectFit: 'contain' }} alt="Key Features" />
          </Col>
          <Col md={5} className="d-flex align-items-center">
            <div className="p-md-0 p-4">
              <h2 className="mb-5">{i18n.label.keyFeatures}</h2>

              <div className="d-flex">
                <TimelinePinIcon height={31} width={31} />
                <div className="ms-1 mt-1">
                  <h5 className="text-primary">
                    {i18n.label.keyFeatures1}
                  </h5>
                  {i18n.label.keyFeaturesDescription1}
                </div>
              </div>

              <div className="d-flex mt-4">
                <TimelinePinIcon height={31} width={31} />
                <div className="ms-1 mt-1">
                  <h5 className="text-primary">
                    {i18n.label.keyFeatures2}
                  </h5>
                  {i18n.label.keyFeaturesDescription2}
                </div>
              </div>

              <div className="d-flex mt-4">
                <TimelinePinIcon height={31} width={31} />
                <div className="ms-1 mt-1">
                  <h5 className="text-primary">
                    {i18n.label.keyFeatures3}
                  </h5>
                  {i18n.label.keyFeaturesDescription3}
                </div>
              </div>

              <div className="d-flex mt-4">
                <TimelinePinIcon height={31} width={31} />
                <div className="ms-1 mt-1">
                  <h5 className="text-primary">
                    {i18n.label.keyFeatures4}
                  </h5>
                  {i18n.label.keyFeaturesDescription4}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-5 text-center">
          <h2>{i18n.label.benefits}</h2>

          <Row className="mt-4 justify-content-md-center g-0">
            <Col md={3}>
              <div className="card-benefit text-center">
                <ClockIcon width={48} height={48} />
                <h5 className="text-primary mt-2">
                  {i18n.label.benefits1}
                </h5>
                {i18n.label.benefitsDescription1}
              </div>
            </Col>
            <Col md={3}>
              <div className="card-benefit text-center">
                <EmailStarIcon width={48} height={48} />
                <h5 className="text-primary mt-2">
                  {i18n.label.benefits2}
                </h5>
                {i18n.label.benefitsDescription2}
              </div>
            </Col>
            <Col md={3}>
              <div className="card-benefit text-center">
                <CrownIcon width={48} height={48} />
                <h5 className="text-primary mt-2">
                  {i18n.label.benefits3}
                </h5>
                {i18n.label.benefitsDescription3}
              </div>
            </Col>
          </Row>
        </div>

        <div className="accent left" />
        <div className="accent right" />
      </div>

      <div className="overview mt-5 pt-4 text-center">
        <h2>{i18n.label.overview}</h2>

        <Row className="mt-4 justify-content-md-center g-0">
          <Col md={2} className="d-md-block d-none">
            <div className="position-relative">
              <hr />
            </div>
          </Col>
          <Col md={2}>
            <div className="position-relative">
              <hr />
              <TimelinePinIcon />
            </div>
            <div className="card-overview text-center">
              <h1>1</h1>
              <h5 className="text-primary mt-2">
                {i18n.label.overview1}
              </h5>
              {i18n.label.overviewDescription1}
            </div>
          </Col>
          <Col md={2}>
            <div className="position-relative">
              <hr />
              <TimelinePinIcon />
            </div>
            <div className="card-overview text-center">
              <h1>2</h1>
              <h5 className="text-primary mt-2">
                {i18n.label.overview2}
              </h5>
              {i18n.label.overviewDescription2}
            </div>
          </Col>
          <Col md={2}>
            <div className="position-relative">
              <hr />
              <TimelinePinIcon />
            </div>
            <div className="card-overview text-center">
              <h1>3</h1>
              <h5 className="text-primary mt-2">
                {i18n.label.overview3}
              </h5>
              {i18n.label.overviewDescription3}
            </div>
          </Col>
          <Col md={2}>
            <div className="position-relative">
              <hr />
              <TimelinePinIcon />
            </div>
            <div className="card-overview text-center">
              <h1>4</h1>
              <h5 className="text-primary mt-2">
                {i18n.label.overview4}
              </h5>
              {i18n.label.overviewDescription4}
            </div>
          </Col>
          <Col md={2} className="d-md-block d-none">
            <div className="position-relative">
              <hr />
            </div>
          </Col>
        </Row>

        <Button
          color="primary"
          className="btn-main my-5"
          onClick={() => navigate('/world-events')}
        >
          {i18n.button.joinTheCommunity}
        </Button>

        <Card className="border-0 rounded-0 card-form">
          <Row className="g-0">
            <Col md={6}>
              <CardImg src={img.landing3} alt="Cover" className="rounded-0" />
            </Col>
            <Col md={6}>
              <div ref={form} />
              <CardBody className="text-start p-md-5 p-4">
                <CardTitle>
                  <h2>{i18n.label.form}</h2>
                </CardTitle>
                <CardText className="mb-3 w-100">{i18n.label.formDescription}</CardText>

                <Form className="mt-5" onSubmit={handleSubmit}>
                  <FormGroup noMargin className="mb-4">
                    <InputGroup className={classNames({
                      'is-invalid': errors.email,
                    })}
                    >
                      <InputGroupText>
                        <EmailIcon />
                      </InputGroupText>
                      <FormGroup noMargin floating>
                        <Input
                          name="email"
                          type="email"
                          value={email}
                          placeholder={i18n.placeholder.email}
                          onChange={(e) => setEmail(e.target.value)}
                          invalid={errors.email}
                        />
                        <Label for="email">{i18n.label.email}
                          <span className="text-danger">*</span>
                        </Label>
                      </FormGroup>
                    </InputGroup>
                    <FormFeedback>
                      {errors.email && errors.email[0]}
                    </FormFeedback>
                  </FormGroup>

                  <FormGroup noMargin className="mb-4">
                    <InputGroup>
                      <InputGroupText>
                        <UserIcon />
                      </InputGroupText>
                      <FormGroup noMargin floating>
                        <Input
                          name="first_name"
                          placeholder={i18n.placeholder.firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                        />
                        <Label for="first_name">{i18n.label.firstName}</Label>
                      </FormGroup>
                    </InputGroup>
                  </FormGroup>

                  <Button type="submit" color="primary" disabled={!email || loading} className="w-50 mt-4">
                    {i18n.button.submit}
                    {loading && <Spinner size="sm" className="ms-2" />}
                  </Button>
                </Form>

              </CardBody>
            </Col>
          </Row>
        </Card>
      </div>
    </Container>
  );
}

export default LandingPage;
