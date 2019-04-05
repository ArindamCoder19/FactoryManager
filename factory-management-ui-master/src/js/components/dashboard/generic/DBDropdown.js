import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';


class Dropdown extends Component {
  constructor(props) {
    super(props);

    let categoryList = props.categories.map((item) => {
      return {label: item.category, value: item._id}
    });

    categoryList.unshift({label: "Overview", value: "all"});

    this.state = {
      open: false,
      categoryList: categoryList
    }
  }

  handleClickOutside() {
    this.setState({
      open: false
    });
  }

  _onDDChange(item, e) {
    e.preventDefault();
    let args = {
      isUser: this.props.isUser,
      data: item
    }
    this.props.onDDChange(args);
    this.setState({open: false});
  }

  _menuItems() {
    let _this = this;
    if(this.props.isUser)
      return this.props.userList.map( (item, index) => {
          return <li key={item.value} onClick={_this._onDDChange.bind(_this, item)}>
            <a href="#"><span>{item.label}</span><span>{item.category.value}</span></a>
          </li>
      })
    else
    return this.state.categoryList.map( (item, index) => {
        return <li key={item.value} onClick={_this._onDDChange.bind(_this, item)}>
          <a href="#" >{item.label}</a>
        </li>
    })
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
