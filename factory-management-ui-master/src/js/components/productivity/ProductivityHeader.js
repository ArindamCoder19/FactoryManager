import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import Dropdown from './generic/Dropdown';
import { getProdData, getProdWeekData } from '../../actions/productivityActions';

class ProductivityHeader extends Component {

  onToggleVacation(selectedValue) {
    let { data, statData } = this.props;
    this.props.getProdWeekData(selectedValue.value, data, statData);
  }
  onDDChange(selectedValue) {
    let { includeVacation, statYear } = this.props;
    this.props.getProdData(selectedValue, includeVacation, statYear);
  }
  _getCategory(){
    let categoryList = [{label: "Overview", value: "all"}];
    this.props.categories.forEach((item) => {
      categoryList.push({label: item.category, value: item._id});
    });

    return categoryList;
  }

  render () {
    let { categories, ddSelected, includeVacation } = this.props;
    return (
      <Row className="db-header">
        <Col xs={12} sm={6}><label>Productivity</label></Col>
        <Col xs={12} sm={6} className="db-dropdown-container">
          <div className="db-dropdown">
            <Dropdown
              menu={[{label: "Excluding Vacation Hours", value: false}, {label: "Including Vacation Hours", value: true}]}
              ddSelected={includeVacation ? {label: "Including Vacation Hours", value: true} : {label: "Excluding Vacation Hours", value: false}}
              onDDChange={this.onToggleVacation.bind(this)} />
          </div>
          <div className="db-dropdown">
            <Dropdown
              menu={this._getCategory()}
              ddSelected={ddSelected}
              onDDChange={this.onDDChange.bind(this)} />
          </div>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: state.generic.categories,
    ddSelected: state.productivity.ddSelected,
    data: state.productivity.prodData,
    statData: state.productivity.statData,
    statYear: state.productivity.statYear,
    includeVacation: state.productivity.includeVacation
  };
}

export default connect(mapStateToProps, {getProdData, getProdWeekData} )(ProductivityHeader);
