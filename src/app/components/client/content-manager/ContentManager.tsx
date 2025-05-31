import './ContentManager.scss';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import { IRootState } from '@app/store';
import useTranslation from '@shared/hooks/useTranslation';

import { MyEvents } from './components/my-events';
import { MyPosts } from './components/my-posts';
import { MyTimeline } from './components/my-timelines';

function ContentManager() {
  const i18n = useTranslation('contentManager');
  const { posts, events, timelines } = useSelector((state: IRootState) => ({
    posts: state.Post.posts,
    events: state.Event.events,
    timelines: state.Timeline.myTimelines,
  }));
  const [ activeTab, setActiveTab ] = useState('posts');

  return (
    <Container fluid className="contents-page">
      <Container className="px-0 px-lg-5 py-4">
        <div className="page-title">
          <Nav pills className="nav-scrollable">
            <NavItem onClick={() => setActiveTab('posts')}>
              <NavLink href="#" active={activeTab === 'posts'}>
                <span className={activeTab === 'posts' ? 'b4' : 'b3'}>{i18n.label.myPosts}</span>
                <span className="caption1">{posts?.meta?.totalItems || 0}</span>
              </NavLink>
            </NavItem>
            <NavItem onClick={() => setActiveTab('events')}>
              <NavLink href="#" active={activeTab === 'events'}>
                <span className={activeTab === 'events' ? 'b4' : 'b3'}>{i18n.label.myEvents}</span>
                <span className="caption1">{events?.meta?.totalItems || 0}</span>
              </NavLink>
            </NavItem>
            <NavItem onClick={() => setActiveTab('timelines')}>
              <NavLink href="#" active={activeTab === 'timelines'}>
                <span className={activeTab === 'timelines' ? 'b4' : 'b3'}>{i18n.label.myTimelines}</span>
                <span className="caption1">{timelines?.meta?.totalItems || 0}</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="posts">
              <MyPosts />
            </TabPane>
            <TabPane tabId="events">
              <MyEvents />
            </TabPane>
            <TabPane tabId="timelines">
              <MyTimeline />
            </TabPane>
          </TabContent>
        </div>
      </Container>
    </Container>
  );
}

export default ContentManager;
