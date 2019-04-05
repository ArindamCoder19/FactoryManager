import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import DBHeader from './DBHeader';
import DBProgress from './DBProgress';
import DBCounter from './DBCounter';
import DBTasks from './DBTasks';
import DBProductivity from './DBProductivity';
import DBOnTime from './DBOnTime';
import DBInBudget from './DBInBudget';
import { currentPage, getDashboardInitialData } from '../../actions/general';
// import { getDashboardData, getDBUserList } from '../../actions/dashboardActions';
import BackdropLoader from '../general/BackdropLoader';

class DashboardManager extends React.Component {

  componentWillMount() {
    this.props.currentPage("dashboard");

    let showUserList = false;
    if(_.intersection(this.props.userRole, ["LEAD", "MANAGER", "ADMIN", 'GUEST'])){
      showUserList = true;
    }

    this.props.getDashboardInitialData(this.props.userID, showUserList, this.props.userRole);
  }

  render () {
    if(this.props.initialdataload)
      return (
        <div className="dashboard-wrapper" >
          <DBHeader />
          <DBProgress />
          <DBCounter />
          <Row className="db-row">
            <DBTasks />
            <DBProductivity />
          </Row>
          <Row className="db-row">
            <DBOnTime />
            <DBInBudget />
          </Row>
        </div>
      )
    else {
      return <BackdropLoader show={true}/>
    }
  }
}

function mapStateToProps(state) {
  return {userRole: state.auth.userRole,
    initialdataload: state.generic.initialdataload,
    userID: state.auth.userID};
}

export default connect(mapStateToProps, {currentPage, getDashboardInitialData} )(DashboardManager);
