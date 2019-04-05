import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const renderMenu = (checked, onClick, content) => {
  return (
    <li key={content} onClick={onClick}>
      <a href="#" onClick={(e) => {e.preventDefault()}}>{content}</a>
      <input type="radio" checked={checked} readOnly />
    </li>
  )
}

const renderCategory = (categories, categorySelected, onClick) => {
  return categories.map((cat) => {
    if(categorySelected._id == cat._id)
    return (
      <li key={cat.category} >
        <a href="#" onClick={(e) => {e.preventDefault()}}>{cat.category}</a>
        <input type="radio" checked={true} readOnly />
      </li>
    )
    else
      return (
        <li key={cat.category} onClick={onClick.bind(this, cat)}>
          <a href="#" onClick={(e) => {e.preventDefault()}}>{cat.category}</a>
          <input type="radio" checked={false}  readOnly />
        </li>
      )
  })
}

const renderMenuWithCategory = (checked, onClick, content, categories, categorySelected, onCatClick) => {
  return (
    <li key={content} onClick={onClick}>
      <a href="#" onClick={(e) => {e.preventDefault()}}>{content}</a>
      <input type="radio" checked={checked} readOnly />
      <div className="dropdown-category"><ul >{renderCategory(categories, categorySelected, onCatClick)}</ul></div>
    </li>
  )
}


class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      checked: _.includes(props.selected, 'ADMIN'),
      selected: props.selected
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
    let selected = [],
        checked = this.state.checked;
    selected.push(item)
    _.intersection([item], ["DEVELOPER", "GUEST"]).length > 0 ? checked = false : "";
    checked ? selected.push("ADMIN") : ""
    this.setState({selected: selected, checked: checked})
    this.props.select(selected);
  }

  _checked(e) {
    let selected = [];
    selected.push(this.state.selected[0]);
    !this.state.checked ? selected.push("ADMIN") : "";
    this.setState({selected: selected, checked: !this.state.checked})
    this.props.select(selected);
  }

  _onCatClick(item, e) {
    e.stopPropagation();
    this.props.onCategorySelect(item);
    console.log(item.category);
  }

  _menuItems() {
    let _this = this;
    return this.props.data.map( (item, index) => {

      let onSelect = _this._onSelect.bind(_this, item);
      let onCatClick = _this._onCatClick.bind(this);

      if(_this.props.checkbox == index){
        if(_.intersection(_this.state.selected, ["DEVELOPER", "GUEST"]).length > 0){
          return <MenuItem key={index} disabled>
            {item}
            <input type="checkbox" checked={_this.state.checked} disabled readOnly/>
          </MenuItem>
        } else {
          return <MenuItem key={index} onClick={_this._checked.bind(_this)}>
            {item}
            <input type="checkbox" checked={_this.state.checked} readOnly/>
          </MenuItem>
        }
      }else {
        if(_.includes(_this.state.selected, item))
          if(_.intersection(_this.state.selected, ["DEVELOPER", "LEAD"]).length > 0) {
            return renderMenuWithCategory(true,
              onSelect,
              item,
              _this.props.categories,
              _this.props.categorySelected,
              onCatClick);
          }else {
            return renderMenu(true, onSelect, item);
          }
        else
          return renderMenu(false, onSelect, item);
      }
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
            {this.props.title+this.state.selected.join(',')}
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
