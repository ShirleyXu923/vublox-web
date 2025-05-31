import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'reactstrap';

import TopNav from './components/topnav/TopNav';

function DashboardLayout() {
  return (
    <Container fluid className="dashboard-content">
      <TopNav />

      <Container>
        <Outlet />
      </Container>
    </Container>
  );
}

export default DashboardLayout;
