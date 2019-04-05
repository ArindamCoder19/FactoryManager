import React, { Component } from 'react';

import BackdropLoader from './BackdropLoader';

export default class EditableItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInput: false,
      showSubmit: false,
      showLoading: false
    }
  }
  _getBodyData() {
    let _this = this;
    return this.props.data.map((item) => {
      return <li key={item._id}>
        {item[_this.props.info.payloadName]}
        <div className="nav-close-trigger" onClick={() => {this.props.deleteItem(item._id)}}><span></span></div>
      </li>
    })
  }

  _addItems() {
    this.setState({showInput: true})
  }

  _showSubmit(state) {
    this.setState({showSubmit: state})
  }

  _onSubmit() {
    if(this.input.value != "") {
      this.props.add(this.input.value);
      this.setState({showSubmit: false, showInput: false})
    }
  }

  _onCancel() {
    this.setState({showSubmit: false, showInput: false})
  }

  _onCloseError(e) {
    e.preventDefault();
    this.setState({showError: false});
  }
  render() {
    if(this.props.show){
      return (
        <div className="modal">
          <div className="editModalContent">
            <div className="modalHeader">
              { this.props.info.title }
              <div className="nav-close-trigger" onClick={() => {this.props.close()}}><span></span></div>

            </div>

            <BackdropLoader show={this.props.loading}/>

            <div className="modalBody">
              <div className={this.props.error != "" ? "slideDown" : "modal-error"}>
                {this.props.error}
                <div className="nav-close-trigger" onClick={() => {this.props.closeError()}}><span></span></div>
            </div>
              <div className="modalList">
                <ul>
                  {this._getBodyData()}
                </ul>
              </div>
              <div className="modalAdd">

                { this.state.showInput ?
                  <div className="modalInput">
                    <input type="text"
                      autoFocus
                      ref={(input) => {
                        this.input = input;
                      }}/>
                      <div className="modal-buttons">
                        <button onClick={this._onSubmit.bind(this)}>Submit</button>
                        <button onClick={this._onCancel.bind(this)}>Cancel</button>
                      </div>
                  </div>
                  :
                  <div>
                    <div className="add-symbol"><span></span></div>
                    <text onClick={this._addItems.bind(this)}>Add</text>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
     )
   }else {
     return null
   }
  }
}
