import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
  MENU_ITEMS,
  ADMIN_MENU,
  REPORT_ITEMS } from '../util/constants';
import * as actions from '../actions/general';
/**
 * Parent: AppLayout
 * Desc: Left Navigation Bar
 */
class SideBar extends Component {

  constructor(props) {
    super(props);
    let isAdmin = props.userRole && props.userRole.indexOf('ADMIN') >= 0;
    props.getCount();
    this.state = {
      showMenu: false,
      subMenuSelected: null,
      subMenuID: null,
      parentID: null,
      isAdmin: isAdmin
    }
  }

  _onSubClick(item, e) {
    e.preventDefault();
    this.props.toggle(false);
    this.props.isFetching();
    this.props.showModal(item.payload);
    this.setState({
      showMenu: false,
      subMenuSelected: item.name,
      subMenuID: item.id,
      showModal: true});
  }

  _showSubMenu(parent, e){
    e.stopPropagation();
    this.setState({showMenu: !this.state.showMenu, parentID: parent});
  }

  _toggleSideBar(show, e) {
    e.stopPropagation();
    if(!show){ //  Hide submenu when SideBar is hidden.
      this.setState({showMenu: false});
    }
    this.props.toggle(show);
  }

  /**
   * Generate Sub-menu list.
   * @param (menu constant, this)
   */
  _subItems(menu, self) {

    if(menu.subMenu.length > 0 ){
      return menu.subMenu.map( (item) => {
        return <li key={item.id}
          onClick={self._onSubClick.bind(self, item)}><a href="#" >{item.name}</a></li>
      } );
    }
    else if(menu.navSubMenu.length > 0){
      return menu.navSubMenu.map( (item) => {
        return <li key={item.id}>
                    <NavLink
                      onClick = { self._toggleSideBar.bind(self, false) }
                      to={ item.routeTo } >
                        <span className="menu-label">{ item.name }</span>
                    </NavLink>
                </li>
      } );

    }else{
      return <div>No Items</div>
    }
  }

  _generateTabs(menu) {
    let menuList = [],
    self = this;

     menu.forEach( (item, index) => {
       if(_.intersection(item.roles, self.props.userRole).length > 0){
        menuList.push(

          <li key={item.id} >
              <NavLink
                onClick = { self._toggleSideBar.bind(self, false) }
                activeClassName="menu-active"
                to={ item.routeTo } >
                  <span
                    className={"menu-img "+item.className}>
                  </span>
                  <span className="menu-label">{ item.name }</span>
                  { item.showBadge ? <Badge>{item.id == "m6" ? self.props.usercount: (item.id == "m2" ? self.props.taskcount : "")}</Badge> : "" }
              </NavLink>

              { self.state.isAdmin && (item.subMenu.length > 0 || item.navSubMenu.length > 0 )?
                  <span className="menu-caret" onClick={self._showSubMenu.bind(self, item.id)}></span>
              : "" }

              { item.id === self.state.parentID &&
                self.state.showMenu ?

                  <div className="dropdown">
                     <ul className="dropdown-menu submenu">
                       {self._subItems(item, self)}
                    </ul>
                  </div>

              : ""}

          </li>
        )
      }
    });

    return menuList;
  }

  _menuItems() {
    return this._generateTabs(MENU_ITEMS);
  }

  _adminMenuItems() {
    return this._generateTabs(ADMIN_MENU);
  }

  _reportMenuItems() {
    return this._generateTabs(REPORT_ITEMS);
  }

  render() {
    return (
        <div id = "sidebar-wrapper"
            onMouseOver = { this._toggleSideBar.bind(this, true) }
            onMouseLeave = { this._toggleSideBar.bind(this, false) } >
          <div className = "sidebar-logo">
            <div className="nav-close-trigger" onClick={ this._toggleSideBar.bind(this, false)}>
              <span></span>
            </div>
            <div className="logo-img"></div>
          </div>
          <ul className = "sidebar-nav">
            {this._menuItems()}
          </ul>

          {_.intersection(["ADMIN", "LEAD", "MANAGER", 'GUEST'], this.props.userRole).length > 0 && <div className="admin-section">
            <div>
              <label>Reports</label>
              <ul className = "sidebar-nav">
                {this._reportMenuItems()}
              </ul>
            </div>
          </div>}

          {this.state.isAdmin &&
          <div className="admin-section">
            <div>
              <label>Admin Console</label>
              <ul className = "sidebar-nav">
                {this._adminMenuItems()}
              </ul>
            </div>
          </div>}

        </div>
    )
  }
}

function mapStateToProps(state) {
  return { userRole: state.auth.userRole,
  usercount: state.generic.usercount,
  taskcount: state.generic.taskcount};
}

export default connect(mapStateToProps, actions)(SideBar);
