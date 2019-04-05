import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside';

import {
  setWeekData,
  onUserChange } from '../../../actions/timesheetActions';

class WeekDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    }
  }

  onWeekChange(item) {
    let showSubmittedTS = (this.props.userSelected.value == this.props.profile._id) ? false : true;
    this.props.setWeekData(item.id);
    this.props.onUserChange(this.props.userSelected, item.id, showSubmittedTS);
    this.setState({showMenu: false});
  }

  _menuItems() {
    let _this = this;
    return this.props.previousWeeks.map( (item, index) => {
      return <li key={item.id} onClick={_this.onWeekChange.bind(_this, item)}>
        <a href="#" onClick={(e) => {e.preventDefault()}}>{item.name}</a>
      </li>
    })
  }
  _toggleMenu() {
    this.setState({showMenu: !this.state.showMenu});
  }
  handleClickOutside() {
    this.setState({showMenu: false});
  }
  render () {
    return (
      <div className="dropdown open btn-group">
        <button id="dropdown-basic-1"
          role="button"
          type="button"
          className={this.state.showMenu ? "dropdown-toggle btn-active btn-default" : "dropdown-toggle btn btn-default"}
          onClick={this._toggleMenu.bind(this)}>
            {moment(this.props.weekSelected).format('DD MMM YYYY')}
        </button>
        {this.state.showMenu ? <ul role="menu" className="dropdown-menu" >
          {this._menuItems()}
        </ul> : "" }

      </div>
    )
  }
}

function mapStateToProps(state) {
  return { weekSelected: state.timesheet.weekSelected,
  previousWeeks: state.timesheet.previousWeeks,
  profile: state.user.profile };
}

let actions = {
  setWeekData,
  onUserChange
};

export default connect(mapStateToProps, actions)(onClickOutside(WeekDropdown));
