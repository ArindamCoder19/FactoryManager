import React, { Component } from 'react';
import { connect } from 'react-redux';

import FutureScopeSummary from './FutureScopeSummary';
import FutureScopeDetail from './FutureScopeDetail';
import CreateNewFSDetail from './CreateNewFSDetail';
import { currentPage, getFSInitialData } from '../../actions/general';
import BackdropLoader from '../general/BackdropLoader';

class FutureScopeManager extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount() {
    this.props.currentPage("future-scope");
    this.props.getFSInitialData(this.props.userID);
  }

  render() {
    if(this.props.initialdataload)
      return (
        <div className="FS-wrapper">
          <FutureScopeSummary />
          {!this.props.newfs && this.props.showfs != null  ? <FutureScopeDetail key={this.props.showfs}/> : ""}
          {this.props.newfs ? <CreateNewFSDetail /> : ""}
        </div>
      )
    else
      return <BackdropLoader show={true}/>
  }
}

function mapStateToProps(state) {
  return { showfs: state.futureScope.showfs,
    userID: state.auth.userID,
    initialdataload: state.generic.initialdataload,
    newfs: state.futureScope.newfs };
}

export default connect(mapStateToProps, {currentPage, getFSInitialData})(FutureScopeManager);
