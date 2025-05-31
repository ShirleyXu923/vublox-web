/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import PropTypes from 'prop-types';
import React from 'react';

import NotificationManager from './NotificationManager';
import Notifications from './Notifications';

class NotificationContainer extends React.Component {
  static propTypes = {
    enterTimeout: PropTypes.number,
    leaveTimeout: PropTypes.number,
  };

  static defaultProps = {
    enterTimeout: 400,
    leaveTimeout: 400,
  };

  constructor(props) {
    super(props);
    NotificationManager.addChangeListener(this.handleStoreChange);
  }

  state = {
    notifications: [],
  };

  componentWillUnmount() {
    NotificationManager.removeChangeListener(this.handleStoreChange);
  }

  handleStoreChange = (notifications) => {
    this.setState({
      notifications,
    });
  };

  handleRequestHide = (notification) => {
    NotificationManager.remove(notification);
  };

  render() {
    const { notifications } = this.state;
    const { enterTimeout, leaveTimeout } = this.props;
    return (
      <Notifications
        enterTimeout={enterTimeout}
        leaveTimeout={leaveTimeout}
        notifications={notifications}
        onRequestHide={this.handleRequestHide}
      />
    );
  }
}

export default NotificationContainer;
