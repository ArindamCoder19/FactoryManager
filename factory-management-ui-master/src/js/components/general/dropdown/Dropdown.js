import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

const renderMenu = (checked, onClick, content) => {
  if(!checked)
    return (
      <li key={content.id} onClick={onClick}>
        <a href="#" onClick={(e) => {e.preventDefault()}}>{content.name}</a>
        <input type="radio" checked={checked} readOnly />
      </li>
    )
  else {
    return null
  }
}


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

  _toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

  _onSelect(item, e) {
    e.stopPropagation();
    this.setState({
      open: false
    });
    this.props.select(item, e);
  }

  _menuItems() {
    let _this = this;
    return this.props.data.map( (item, index) => {

      let onSelect = _this._onSelect.bind(_this, item);
      if(_this.props.selected == item.name)
        return renderMenu(true, onSelect, item);
      else
        return renderMenu(false, onSelect, item);
    })
  }

  render() {
    return (
      <div className="dropdown open btn-group">
        <button id="dropdown-basic-1"
          role="button"
          type="button"
          className="dropdown-toggle btn btn-default"
          onClick={this._toggleMenu.bind(this)}>
            {this.props.title+this.props.selected}
        <span className="caret"></span>
        </button>
        {this.state.open ? <ul role="menu" className="dropdown-menu" >
          {this._menuItems()}
        </ul> : "" }
      </div>
    )
  }
}

export default onClickOutside(Dropdown)
