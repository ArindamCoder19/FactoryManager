import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';


class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  handleClickOutside() {
    this.setState({
      open: false
    });
  }

  _onDDChange(item, e) {
    e.preventDefault();
    this.props.onDDChange(item);
    this.setState({open: false});
  }

  _menuItems() {
    let _this = this,
    menuArray = [];
    this.props.menu.forEach( (item, index) => {
      if(_this.props.ddSelected.value !== item.value){
        menuArray.push(<li key={item.value} onClick={_this._onDDChange.bind(_this, item)}>
          <a href="#" >{item.label}</a>
        </li>)
      }
    });

    return menuArray;
  }

  onClick() {
    this.setState({open: !this.state.open});
  }

  render() {
    return (
      <div className="dropdown open btn-group">
        <button id="dropdown-basic-1"
          role="button"
          type="button"
          className="dropdown-toggle btn btn-default"
          onClick={this.onClick.bind(this)}>
          {this.props.ddSelected.label}
        <span className="caret"></span>
        </button>
        {this.state.open ? <ul role="menu" className="dropdown-menu dropdown-menu-right" >
          {this._menuItems()}
        </ul> : ""}
      </div>
    )
  }
}


export default onClickOutside(Dropdown);
