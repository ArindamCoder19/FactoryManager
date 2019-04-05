import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const renderFromCalendar = (buttonClick, fromDate, toDate, dateSelect) => {
  return (
    <DatePicker
      key='ped-from'
      inline
      selected={fromDate != null ? moment(fromDate) : ""}
      onChange={dateSelect.bind(this)}
      maxDate={toDate != null ? moment(toDate) : null}
    >
    <div className="cal-button-container">
      <button onClick={buttonClick.bind(this, 0)}>
        The Beginning
      </button>
    </div>
    </DatePicker>
  )
}

const renderToCalendar = (buttonClick, fromDate, toDate, dateSelect) => {
  return (
    <DatePicker
      key='ped-to'
      inline
      selected={toDate != null ? moment(toDate) : ""}
      onChange={dateSelect.bind(this)}
      minDate={fromDate != null ? moment(fromDate) : null}
    >
    <div className="cal-button-container">
      <button onClick={buttonClick.bind(this, 1)}>
        The End
      </button>
    </div>
    </DatePicker>
  )
}


class Filter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menuId: 0,
      open: false,
      menuSelected: this.props.menuSelected,
      subMenuSelected: this.props.subMenuSelected
    }
  }

  handleClickOutside() {
    this.setState({
      open: false,
      menuId: 0
    });
  }

  _toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

  _menuClicked(index, e) {
    e.preventDefault();
    this.setState({
      menuId: this.state.menuId == index ? -1 : index
    })
  }

  _buttonClick(index, e) {

    if(index == 0) {
      let payload = {name: "The Beginning", id: "ALL"};
      let { filter, menuType } = this.props;

      filter[menuType] = "ALL";
      this.props.filterSelect(filter);
      this.setState({
        menuSelected: payload,
        menuId: 1
      });

    }else {
      let payload = {name: "The End", id: "ALL"};
      let { filter, subMenuType } = this.props;

      filter[subMenuType] = "ALL";
      this.props.filterSelect(filter);
      this.setState({
        subMenuSelected: payload,
        open: false,
        menuId: 0
      });
    }

  }

  _fromSelect(date) {
    let payload = {name: date.format("DD MMM YYYY"), id: date.format("YYYY-MM-DD")}
    let { filter, menuType } = this.props;

    filter[menuType] = date.format("YYYY-MM-DD");
    this.props.filterSelect(filter);
    this.setState({
      menuSelected: payload,
      menuId: 1
    });
  }

  _toSelect(date) {
    let payload = {name: date.format("DD MMM YYYY"), id: date.format("YYYY-MM-DD")}
    let { filter, subMenuType } = this.props;

    filter[subMenuType] = date.format("YYYY-MM-DD");
    this.props.filterSelect(filter);
    this.setState({
      subMenuSelected: payload,
      open: false,
      menuId: 0
    });
  }

  _menuItems() {
    let _this = this,
    fromDate = this.state.menuSelected.id == "ALL" ? null : this.state.menuSelected.id,
    toDate = this.state.subMenuSelected.id == "ALL" ? null : this.state.subMenuSelected.id;

    return ([
      <li key='calendar-0'>
        <a href="#" className="icon-calendar"
          onClick={this._menuClicked.bind(this, 0)}>
          From: {this.state.menuSelected.name}
        </a>
        {this.state.menuId == 0 &&
          <div className="dropdown-submenu">
            {renderFromCalendar(this._buttonClick.bind(this), fromDate, toDate, this._fromSelect.bind(this))}
          </div>
        }
      </li>,
      <li key='calendar-1'>
        <a href="#" className="icon-calendar"
          onClick={this._menuClicked.bind(this, 1)}>
          To: {this.state.subMenuSelected.name}
        </a>
        {this.state.menuId == 1 &&
          <div className="dropdown-submenu">
            {renderToCalendar(this._buttonClick.bind(this), fromDate, toDate, this._toSelect.bind(this))}
          </div>
        }
      </li>

    ])

  }

  render() {
    let { title, className } = this.props,
    {menuSelected, subMenuSelected} = this.state;

    return (
      <div className={className ? className+" grey-dropdown" : "grey-dropdown"}>
        <div className="dropdown open btn-group">
          <button id="dropdown-basic-1"
            role="button"
            type="button"
            className="dropdown-toggle btn btn-default"
            onClick={this._toggleMenu.bind(this)}>
            {title+" | "+menuSelected.name+" - "+subMenuSelected.name}
          <span className="caret"></span>
          </button>
          {this.state.open ? <ul role="menu" className="filter-menu dropdown-menu" >
            {this._menuItems()}
          </ul> : "" }
        </div>
      </div>
    )
  }
}

export default onClickOutside(Filter)
