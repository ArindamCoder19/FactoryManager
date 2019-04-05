import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import store from '../../../store';

const renderMenu = (menu, onClick) => {
  return (
    <li key={menu.id} id={menu.id} onClick={onClick}>
      <a href="#" onClick={(e) => {e.preventDefault()}}>{menu.name}</a>
      {/* <input type="radio" checked={false} readOnly /> */}
      <svg height="40" width="40" style={{position: "absolute", right: "0", top: "0"}}>
        <circle cx="20" cy="20" r="6" fill="none" strokeWidth="1" stroke="black"/>
        {/* <circle cx="20" cy="20" r="4" fill="black" /> */}
      </svg>
      {/* <label className="round-radio-label" htmlFor={menu.id}></label> */}
    </li>
  )
}

const renderSubMenu = (subMenu, onClick, subMenuSelected) => {
  return subMenu.map((item) => {
    return (
        <li key={item.id} id={item.id} onClick={onClick.bind(this, item)}>
          <a href="#" onClick={(e) => {e.preventDefault()}}>{item.name}</a>
          {/* <input type="radio" checked={_.some(subMenuSelected, item)}  readOnly /> */}
          <svg height="40" width="40" style={{position: "absolute", right: "0", top: "0"}}>
            <rect x="15" y="15" width="10" height="10" fill="none" strokeWidth="1" stroke="black"/>
            {_.some(subMenuSelected, item) && <rect x="17" y="17" width="6" height="6" fill="black" stroke="none"/>}
            {/* <circle cx="20" cy="20" r="4" fill="black" /> */}
          </svg>
          {/* <label className="square-radio-label" htmlFor={item.id}></label> */}
        </li>
      )
  })
}

const renderMenuWithSubMenu = (menuItem, checked, onMenuClick, submenu, onSubClick, subMenuSelected) => {
  return (
    <li key={menuItem.id} id={menuItem.id} onClick={onMenuClick}>
      <a href="#" onClick={(e) => {e.preventDefault()}}>{menuItem.name}</a>
      {/* <input type="radio" checked={true} readOnly /> */}
      <svg height="40" width="40" style={{position: "absolute", right: "0", top: "0"}}>
        <circle cx="20" cy="20" r="6" fill="none" strokeWidth="1" stroke="black"/>
        <circle cx="20" cy="20" r="4" fill="black" />
      </svg>
      {/* <label className={"round-radio-label"} htmlFor={menuItem.id}></label> */}
      {checked && <div className="dropdown-submenu"><ul >{renderSubMenu(submenu, onSubClick, subMenuSelected)}</ul></div>}
    </li>
  )
}

class Filter extends Component {

  constructor(props) {
    super(props);
    let subMenuSelected = props.submenu,
    menuSelected = props.menu[0] ? props.menu[0] : {name: "All", id: "ALL"};

    props.submenu.forEach((item, index) => {
      if(item.default != undefined && item.default){
        subMenuSelected = [item];
      }
    });

    props.menu.forEach((item, index) => {
      if(item.default != undefined && item.default){
        menuSelected = item;
      }
    });

    // window.resize = this._getDDStyles();
    this.state = {
      activeKey: 0,
      open: false,
      menuSelected: menuSelected, // Default: {name: "All", id: "ALL"}
      subMenuSelected: subMenuSelected // Default: [All submenu]
    }
  }

  handleClickOutside() {
    this.setState({
      open: false
    });
  }

  _toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

  _onMenuClick(item, e) {
    e.stopPropagation();

    if(item.id != this.state.menuSelected.id){
      let isMenuSelected = true;
      let { filter, menuType, subMenuType } = this.props;

      filter[menuType] = item.id;
      filter[subMenuType] = "ALL";
      this.props.filterSelect(filter);
      this.setState({menuSelected: item, subMenuSelected: this.props.submenu});
    }
  }

  _onSubMenuClick(item, e) {
    e.stopPropagation();
    let subMenuSelected = this.state.subMenuSelected,
        isAll = false;

    if(item.id == "ALL"){
      subMenuSelected = this.props.submenu;
      isAll = true;
    }else {
      if(_.some(subMenuSelected, item)) {
        if(subMenuSelected.length >= 2){
          subMenuSelected = _.reject(subMenuSelected, function(o) { return item.id == o.id || o.id == 'ALL' });
        }
      }else {
        subMenuSelected.push(item);
        if(subMenuSelected.length === this.props.submenu.length-1 ){
          subMenuSelected = this.props.submenu;
          isAll = true;
        }
      }
    }
    let ids = subMenuSelected.map((item) => item.id);
    let { filter, subMenuType } = this.props;

    isAll ? filter[subMenuType] = "ALL" : filter[subMenuType] = ids.join(",");
    this.props.filterSelect(filter);

    this.setState({subMenuSelected: subMenuSelected});
  }

  _menuItems() {
    let _this = this,
    { menuSelected, subMenuSelected } = this.state,
    { menu, submenu } = this.props;
    if(menu.length > 0){
      return menu.map((item, index) => {
        let onMenuClick = _this._onMenuClick.bind(_this, item),
            onSubClick = _this._onSubMenuClick.bind(_this),
            checked = menuSelected.id == "ALL" ? true : _.some([menuSelected], item);
        if(menuSelected.id == item.id){
          return renderMenuWithSubMenu(item, checked, onMenuClick, submenu, onSubClick, subMenuSelected);
        }else {
          return renderMenu(item, onMenuClick)
        }
      })
    }else if(submenu.length > 0){
      let onSubClick = _this._onSubMenuClick.bind(this);
      return renderSubMenu(submenu, onSubClick, subMenuSelected);
    }
  }

  _getTitle() {
    let { name } = this.props,
      { menuSelected, subMenuSelected } = this.state,
      subNames = [],
      isAll = false;

    subMenuSelected.forEach((item) => {
      if(item.id != "ALL"){
        subNames.push(item.name);
      }else {
        isAll = true;
      }
    });

    let subMenuTitle = isAll ? "All" : subNames.join(",");

    let title = this.props.menu.length > 0  ? name+menuSelected.name+(this.props.submenu.length > 0 ? " | " : "")+subMenuTitle : name+" "+subMenuTitle;

    return title;
  }
  _getDDStyles() {
    let height = window.innerHeight - 183;
    return {maxHeight: height, overflowY: "auto"}
  }
  render() {
    let { className } = this.props;
    return (
      <div className={className ? className+" grey-dropdown" : "grey-dropdown"}>
        <div className="dropdown open btn-group">
          <button id="dropdown-basic-1"
            role="button"
             type="button"
            className="dropdown-toggle btn btn-default"
            onClick={this._toggleMenu.bind(this)}>
            {this._getTitle()}
          <span className="caret"></span>
          </button>
          {this.state.open ? <ul role="menu" className="filter-menu dropdown-menu" style={this._getDDStyles()}>
            {this._menuItems()}
          </ul> : "" }
        </div>
      </div>
    )
  }
}

export default onClickOutside(Filter)
