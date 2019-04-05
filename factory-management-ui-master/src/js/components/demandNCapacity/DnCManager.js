import React, { Component } from 'react';
import { connect } from 'react-redux';

import DnCHeader from './DnCHeader';
import DnCCounter from './DnCCounter';
import DnCOverview from './DnCOverview';
import BackdropLoader from '../general/BackdropLoader';
import { currentPage, getDnCInitialData } from '../../actions/general';

class DnCManager extends Component {

  componentWillMount() {
    this.props.currentPage("dnc");
    this.props.getDnCInitialData(this.props.userID);
  }

  render () {
    if(this.props.initialdataload)
      return (
        <div className="dnc-wrapper" >
          <DnCHeader />
          <DnCCounter />
          <DnCOverview />
        </div>
      )
    else {
      return <BackdropLoader show={true}/>
    }
  }
}

function mapStateToProps(state) {
  return {userRole: state.auth.userRole,
    initialdataload: state.generic.initialdataload,
    userID: state.auth.userID};
}

export default connect(mapStateToProps, {currentPage, getDnCInitialData} )(DnCManager);
