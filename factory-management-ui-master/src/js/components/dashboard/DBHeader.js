import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import DBDropdown from './generic/DBDropdown';
import { switchSelection, getDashboardData } from '../../actions/dashboardActions';

class DBHeader extends React.Component {
  onDDChange(selectedValue) {
    this.props.getDashboardData(selectedValue)
  }
  switchSelection(event) {

    let args = {
      isUser: event.target.checked,
      data: {label: "Overview", value: "all"} //Initialize
    }
    this.props.getDashboardData(args);
    // this.props.switchSelection(event.target.checked);
  }
  render () {
    let { userList, isUser, categories, ddSelected, userRole } = this.props;
    return (
      <Row className="db-header">
        <Col xs={12} sm={6}><label>Dashboard</label></Col>
        { _.intersection(userRole, ["LEAD", "MANAGER", "ADMIN", "GUEST"]).length > 0 &&
          <Col xs={12} sm={6} className="db-dropdown-container">
          {_.intersection(userRole, ["MANAGER", "ADMIN", "GUEST"]).length > 0 && <div className="db-switch">

            <label htmlFor="generic-switch">Categories</label>
            <label className="switch-container">
              <input id="generic-switch" type="checkbox" checked={this.props.isUser} onChange={this.switchSelection.bind(this)}/>
              <span className="slider"></span>
            </label>
            <label htmlFor="generic-switch">Users</label>

          </div>}

          <div className="db-dropdown">
            <DBDropdown
              userList={userList}
              categories={categories}
              ddSelected={ddSelected}
              onDDChange={this.onDDChange.bind(this)}
              isUser={isUser}/>
          </div>
        </Col>
      }
    </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    userRole: state.auth.userRole,
    userList: state.dashboard.userList,
    categories: state.generic.categories,
    isUser: state.dashboard.isUser,
    ddSelected: state.dashboard.ddSelected
  };
}

export default connect(mapStateToProps, { switchSelection, getDashboardData })(DBHeader);
