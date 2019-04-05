import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, MenuItem, Image} from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import InlineEdit from 'react-edit-inline';
import {updateProfile, userProfileView, isProfileFetching} from '../actions/userActions' ;
import {signoutUser} from '../actions/auth' ;
import onClickOutside from 'react-onclickoutside';


class Profile extends Component {
  constructor(props) {
    super(props) ;
    this.state = {
        showModal: false,
        editModal: false,
        phoneNo:'Not provided',
        location: 'Not provided',
    }
    //Dispatch action to get details about user from the userID

    //Bind functions to define the context of this
    this.renderContent = this.renderContent.bind(this);
    this.locationChanged =  this.locationChanged.bind(this);
    this.phoneChanged = this.phoneChanged.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    this.setState({showModal:false, editModal:false});
}

  close() {
    this.setState({ showModal: false, editModal:false  });
  }

  open() {
    this.setState({
      showModal: true,
      editModal: false,
      phoneNo: this.props.profile.phoneNo ? this.props.profile.phoneNo : "Phone Number",
      location: this.props.profile.location? this.props.profile.location : "Location"
    });
  }


  editDetails() {
    this.setState({showModal:true, editModal: true }) ;
        console.log(this.props.profile.firstName);
  }

  closeDetails() {
    this.setState({showModal:false, editModal:false});
  }

  _toggle(e) {
    e.stopPropagation();
    this.props.toggle(true);
  }

  _logout() {
    this.props.signoutUser(this.props.socket);
  }

  customValidateText(text) {
      return (text.length > 0 && text.length < 64);
   }

  phoneChanged(obj) {
        // data = { description: "New validated text comes here" }
        this.setState({ phoneNo: obj.phone });
        console.log('phone changed');
    }

  locationChanged(obj) {
        // data = { description: "New validated text comes here" }
        // Update your model from here
        this.setState({ location: obj.location });
        console.log('location changed');
    }

  saveChanges(obj) {
    let payload = {} ;
    this.state.phoneNo != "Phone Number" ? payload.phoneNo = this.state.phoneNo : "" ;
    this.state.location != "Location" ? payload.location = this.state.location : "" ;
    this.setState({showModal:true, editModal:false});
    this.props.updateProfile(this.props.userID, payload);
    this.props.userProfileView(this.props.userID);
  }

   handleClickOutside = evt => {
    // ..handling code goes here...
    console.log("handleClickOutside Profile");
    this.setState({showModal:false,editModal:true});
  }

  renderContent() {
    if(this.state.showModal) {
      if(this.props.isfetching){
      return(
        <div className="showModal">
          <div className="modalHeader">
            <text className="modalTitle">Loading..</text>
          </div>

        </div>
      )
    }else{
      if(this.state.editModal) {
        return (
          <div className="showModal">

            <div className="modalHeader">
              <button className="nav" onClick={this.closeDetails.bind(this)}><img src="../src/images/icon-previous.svg" alt=""/></button>
              <text className="modalTitle">Profile</text>
              <button className="editSave" onClick={this.saveChanges.bind(this)}>Save</button>
            </div>

             <div className="profileImage">
              <h1 className="profileName">{this.props.profile.firstName[0] + this.props.profile.lastName[0]}  </h1>
            </div>

            <div className="modalContent">
              <text className="name">{this.props.profile.firstName + " " + this.props.profile.lastName}</text>
              <text className="role">{this.props.profile.role.join(',')}</text>
              <span className="divider"></span>
              <text>{this.props.profile.email}</text>

                <InlineEdit
                activeClassName="editing"
                text= {this.props.profile.phoneNo ? this.props.profile.phoneNo : 'Phone No'}
                paramName="phone"
                className="beCenter"
                style={{
                padding: 6,
                fontSize: 15,
                fontWeight: 100
              }}
                change={this.phoneChanged.bind(this)} />

                <InlineEdit
                activeClassName="editing"
                text= {this.props.profile.location ? this.props.profile.location : 'Location'}
                paramName="location"
                className="beCenter"
                style={{
                padding: 6,
                fontSize: 15,
                fontWeight: 100
              }}
                change={this.locationChanged.bind(this)} />

              <text className="localTime">{(new Date(new Date().getTime()).toLocaleTimeString()).slice(0,5)} </text>
            </div>

          </div>
        )
      }
      else {
        return(
          <div className="showModal">
            <div className="modalHeader">
              <button className="nav" onClick={this.close.bind(this)}><img src="../src/images/icon-previous.svg" alt=""/></button>
              <text className="modalTitle">Profile</text>
              <button className="editSave" onClick={this.editDetails.bind(this)}>Edit</button>
            </div>

            <div className="profileImage">
              <h1 className="profileName">{this.props.profile.firstName[0] + this.props.profile.lastName[0]}  </h1>
            </div>

            <div className="modalContent">
              <text className="name">{this.props.profile.firstName + " " + this.props.profile.lastName}</text>
              <text className="role">{this.props.profile.role.join(',')}</text>
              <span className="divider"></span>
              <text>{this.props.profile.email}</text>
              <text>{this.state.phoneNo}</text>
              <text> {this.state.location} </text>
              <text className="localTime"> {(new Date(new Date().getTime()).toLocaleTimeString()).slice(0,5)}</text>
            </div>

          </div>
        )
      }
    }}
    else {
      return(
            <div>
               <div>
               <MenuItem key='profile' eventKey='profile' onClick={this.open.bind(this)}>Profile</MenuItem>
               <MenuItem key='logout' eventKey='logout' onClick={this._logout.bind(this)}>Logout</MenuItem>
              </div>

            </div>
      )
    }
  }

  render() {

      return(
        <div>
       {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  userID: state.auth.userID,
  profile: state.user.profile,
  isfetching: state.user.isfetching
  };
}

export default connect(mapStateToProps, {userProfileView, signoutUser, isProfileFetching, updateProfile})(onClickOutside(Profile));
