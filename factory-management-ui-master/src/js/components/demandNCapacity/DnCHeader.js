import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import DBDropdown from '../dashboard/generic/DBDropdown';
import { getDnCData } from '../../actions/dncActions';

class DnCHeader extends Component {
  onDDChange(selectedValue) {
    this.props.getDnCData(selectedValue)
  }
  render () {
    let { categories, ddSelected } = this.props;
    return (
      <Row className="db-header">
        <Col xs={12} sm={6}><label>Report - Demand & Capacity</label></Col>
          <Col xs={12} sm={6} className="db-dropdown-container">

          <div className="db-dropdown">
            <DBDropdown
              userList={[]}
              categories={categories}
              ddSelected={ddSelected}
              onDDChange={this.onDDChange.bind(this)}
              isUser={false}/>
          </div>
        </Col>
    </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: state.generic.categories,
    ddSelected: state.dnc.ddSelected
  };
}

export default connect(mapStateToProps, {getDnCData} )(DnCHeader);
