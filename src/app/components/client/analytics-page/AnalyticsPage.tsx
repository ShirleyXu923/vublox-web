import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import {
  Badge,
  Col, Container, Nav, NavItem, NavLink, Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import { shortNumberFormat } from '@shared/helpers';
import useTranslation from '@shared/hooks/useTranslation';
import { TrendingDownIcon, TrendingUpIcon } from '@shared/icons';

import DateFilter from './components/date-filter/DateFilter';
import FollowerData from './components/follower-data/FollowerData';
import ViewerData from './components/viewer-data/ViewerData';
import ViewsData from './components/views-data/ViewsData';
import './AnalyticsPage.scss';

function AnalyticsPage() {
  const i18n = useTranslation('analyticsPage');
  const account = useSelector(({ Auth }: IRootState) => Auth.account);
  const [ activeTab, setActiveTab ] = useState('views');
  const [ viewsData, setViewsData ] = useState<any>({});
  const [ followerData, setFollowerData ] = useState<any>({});
  const [ query, setQuery ] = useState(account.type === 'user' ? {} : {
    organization_id: account.id,
  });
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    setQuery((s: any) => {
      const { organization_id: oId, ...rest } = s;
      if (account.type !== 'user') {
        rest.organization_id = account.id;
      }
      return rest;
    });
  }, [ account ]);

  useEffect(() => {
    if (!isEmpty(followerData) && !isEmpty(viewsData)) {
      setLoading(false);
    }
  }, [ followerData, viewsData ]);

  return (
    <Container fluid className="analytics-page">
      <Container className="px-0 px-md-5 py-4">
        <Row className="header d-flex justify-content-between align-items-center">
          <h1 className="title">{i18n.label.title}</h1>
          <DateFilter onChange={setQuery} />
        </Row>
        <Row className="mt-5">
          <Col md={12}>
            <Nav tabs className="head">
              <NavItem>
                <NavLink
                  active={activeTab === 'views'}
                  onClick={() => setActiveTab('views')}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="b5 text-uppercase">{i18n.label.views}</div>
                    <Badge className={viewsData.trend === 'down' ? 'danger2' : 'success2'} pill>
                      {viewsData.trend === 'down' ? <TrendingDownIcon /> : <TrendingUpIcon />}
                      <span>{`${viewsData.change || '-'}`}%</span>
                    </Badge>
                  </div>
                  {loading ? (
                    <h2 className="w-100 mt-3 pt-1 text-center">
                      <ContentLoader
                        width="120"
                        height="35"
                        className="content-loader"
                      >
                        <rect width="120" height="35" />
                      </ContentLoader>
                    </h2>
                  ) : (
                    <h2 className="text-center mt-4">{shortNumberFormat(viewsData.total)}</h2>
                  )}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === 'followers'}
                  onClick={() => setActiveTab('followers')}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="b5 text-uppercase">{i18n.label.followers}</div>
                    <Badge className={followerData.trend === 'down' ? 'danger2' : 'success2'} pill>
                      {followerData.trend === 'down' ? <TrendingDownIcon /> : <TrendingUpIcon />}
                      <span>{`${followerData.change || '-'}`}%</span>
                    </Badge>
                  </div>
                  {loading ? (
                    <h2 className="w-100 mt-3 pt-1 text-center">
                      <ContentLoader
                        width="120"
                        height="35"
                        className="content-loader"
                      >
                        <rect width="120" height="35" />
                      </ContentLoader>
                    </h2>
                  ) : (
                    <h2 className="text-center mt-4">
                      {`${followerData.trend === 'up' ? '+' : '-'}${shortNumberFormat(followerData.total)}`}
                    </h2>
                  )}
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="views">
                &nbsp;
                <ViewsData onUpdate={setViewsData} query={query} />
              </TabPane>
              <TabPane tabId="followers">
                &nbsp;
                <FollowerData onUpdate={setFollowerData} query={query} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12}>
            <ViewerData query={query} />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default AnalyticsPage;
