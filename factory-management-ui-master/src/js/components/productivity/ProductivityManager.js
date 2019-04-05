import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductivityHeader from './ProductivityHeader';
import ProductivityCounter from './ProductivityCounter';
import ProductivityOverview from './ProductivityOverview';
import BackdropLoader from '../general/BackdropLoader';
import { currentPage, getProdInitialData } from '../../actions/general';

class ProductivityManager extends Component {

  componentWillMount() {
    this.props.currentPage("prod");
    this.props.getProdInitialData(this.props.userID);
  }

  render () {
    if(this.props.initialdataload)
      return (
        <div className="dnc-wrapper" >
          <ProductivityHeader />
          <ProductivityCounter />
          <ProductivityOverview />
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

export default connect(mapStateToProps, {currentPage, getProdInitialData} )(ProductivityManager);
