import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Col, Container, Nav, NavItem, NavLink, Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import ProfilePagePlaceholder from '@components/client/profile-page/ProfilePagePlaceholder';
import { getOrganizationRequest, getOrganizationTimelineRequest } from '@reducers/organization/OrganizationAction';
import { handleError } from '@services/ErrorHandler';
import { AccordionTimeline } from '@shared/components/AccordionTimeline';
import ResizableTimeline from '@shared/components/ResizableTimeline/ResizableTimeline';
import useTimelineMap from '@shared/hooks/useTimelineMap';
import useTranslation from '@shared/hooks/useTranslation';

import { OrganizationHeader } from '../organization-header';
import '../../OrganizationPage.scss';

function OrganizationContent({
  id, preview, defaultItem, TimelineMapComponent, TimelineComponent,
}:
{ id?: string; preview?: boolean; defaultItem?: any;
  TimelineMapComponent: FC<any>; TimelineComponent: FC<any> }) {
  const i18n = useTranslation('organizationPage');
  const dispatch = useDispatch<any>();
  const o = useSelector((state: IRootState) => state.Organization.organization as any);
  const account = useSelector((state: IRootState) => state.Auth.account);
  const [ organization, setOrganization ] = useState(defaultItem || o);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ query, setQuery ] = useState<any>({});
  const location = useLocation();
  const navigate = useNavigate();
  const {
    markers, startDate, endDate, setDates, setTimelineMarkers, setVisibleTimelineMarkers,
  } = useTimelineMap();

  const TabIds = {
    TIMELINE: i18n.label.timeline,
    REWARDS_CENTER: i18n.label.rewardCenter,
    MEMBERS: i18n.label.members,
    STORE: i18n.label.store,
  } as const;

  const tabs = [
    { id: TabIds.TIMELINE, label: i18n.label.timeline },
    { id: TabIds.MEMBERS, label: i18n.label.members },
    { id: TabIds.REWARDS_CENTER, label: i18n.label.rewardCenter },
    { id: TabIds.STORE, label: i18n.label.store },
  ];

  const [ activeTab, setActiveTab ] = useState<typeof TabIds[keyof typeof TabIds]>(TabIds.TIMELINE);

  const initialLoad = async () => {
    try {
      setIsLoading(true);
      await dispatch(getOrganizationRequest(id || '')).$promise;
    } catch (error) {
      handleError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location ]);

  useEffect(() => {
    setOrganization(o);
  }, [ o ]);

  return (
    <div className="organization-page full-container">
      <Container className="mt-3 mt-md-5 gx-0" fluid>
        <Row className="justify-content-center organization-page-wrapper">
          <Col md={12}>
            {isLoading
              ? (
                <ProfilePagePlaceholder />
              )
              : (
                <>
                  <OrganizationHeader reload={initialLoad} />

                  <div className="scrolling-pills-timeline d-flex overflow-auto gap-2 mt-3">
                    <Nav pills className="flex-nowrap gap-2">
                      {tabs.map(tab => (
                        <NavItem key={tab.id}>
                          <NavLink
                            active={activeTab === tab.id}
                            className="tab-link text-nowrap d-flex justify-content-center align-items-center"
                            onClick={() => setActiveTab(tab.id)}
                            aria-label={`${tab.label} tab`}
                            style={{ cursor: 'pointer' }}

                          >
                            {tab.label}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </div>
                </>
              )}
          </Col>
        </Row>

        <TabContent activeTab={activeTab} className="tabs-container">
          <TabPane tabId={TabIds.TIMELINE} className="timeline-tab">
            <ResizableTimeline
              mapComponent={(
                <TimelineMapComponent
                  markers={markers}
                  startDate={startDate}
                  endDate={endDate}
                  location={organization.location}
                  loading={isLoading}
                  onSelectTimeRange={(data: any) => setQuery((s: any) => ({ ...s, ...data }))}
                />
              )}
              timeline={organization?.privacy_option === 'public' || account?.id === organization?.created_by || account?.id === organization?.id ? (
                <AccordionTimeline
                  request={getOrganizationTimelineRequest}
                  createPostLink={`/posts/create?postable_id=${organization?.id}&postable_type=Organization#step-1`}
                  createEventLink={`/events/create?eventable_id=${organization?.id}&eventable_type=Organization#step-1`}
                  link={`/organizations/${organization?.id}`}
                  query={{
                    id: organization.id,
                    ...query,
                  }}
                  defaultTimescale="1-h"
                  onChangeTimeline={setTimelineMarkers}
                  onChangeVisibleItems={setVisibleTimelineMarkers}
                  onChangeDates={setDates}
                  preview={preview}
                  TimelineComponent={TimelineComponent}
                />
              ) : (
                <div className="private mt-5">
                  <div className="s1">{i18n.label.timeline}</div>
                  <div className="b1">{i18n.label.privateTimeline}</div>
                </div>
              )}
            />
          </TabPane>

          <TabPane tabId={TabIds.REWARDS_CENTER}>
            <h3 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h3>
          </TabPane>

          <TabPane tabId={TabIds.MEMBERS}>
            <h3 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h3>
          </TabPane>

          <TabPane tabId={TabIds.STORE}>
            <h3 className="d-flex justify-content-center align-items-center mt-5">{i18n.label.upcoming}</h3>
          </TabPane>
        </TabContent>
      </Container>
    </div>
  );
}

export default OrganizationContent;
