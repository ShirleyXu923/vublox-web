import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Navigate } from 'react-router-dom';
import {
  Col, Container, Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import FollowSelection from '@shared/components/FollowSelection/FollowSelection';

import InterestsSelection from './components/interests-selection/InterestsSelection';

import './OnboardingPage.scss';

function OnboardingPage() {
  const interests = useSelector(({ Auth }: IRootState) => (Auth.user as any).interests || []);
  const [ onboarding ] = useState(interests.length === 0);
  const [ activeTab, setActiveTab ] = useState('interests');
  const isXsScreen = useMediaQuery({ query: '(max-width: 575px)' });
  if (interests.length > 0 && !onboarding) {
    return <Navigate to="/home" />;
  }

  return (
    <Container className={`onboarding-page ${isXsScreen ? 'pt-5 px-3' : 'p-5'}`}>
      <Row className="justify-content-center">
        <Col md={6} className="my-auto">
          <TabContent activeTab={activeTab}>
            <TabPane tabId="interests">
              <InterestsSelection
                onSuccess={() => setActiveTab('follow')}
              />
            </TabPane>
            <TabPane tabId="follow">
              {activeTab === 'follow' && (
                <FollowSelection />
              )}
            </TabPane>
          </TabContent>

        </Col>
      </Row>
    </Container>
  );
}

export default OnboardingPage;
