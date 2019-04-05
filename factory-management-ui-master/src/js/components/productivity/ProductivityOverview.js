import React, { Component } from 'react';
import { connect } from 'react-redux';

import ProductivityChart from './overview/ProductivityChart';
import ProductivityTiles from './overview/ProductivityTiles';

import { PROD_COLORS } from '../../util/constants';

class ProductivityOverview extends Component {
  customizedLegend() {
    return (
        <div className="custom-legend">
          <span>Overview</span>
          <ul>
            {this.props.includeVacation && <li key={`item-0`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.vacation}} />
              </svg>
              <span>Vacation</span>
            </li>}
            <li key={`item-1`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.idleTime}} />
              </svg>
              <span>Idle Time</span>
            </li>
            <li key={`item-2`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.meeting}} />
              </svg>
              <span>Meetings</span>
            </li>
            <li key={`item-3`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.training}} />
              </svg>
              <span>Training</span>
            </li>
            <li key={`item-4`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.coordination}} />
              </svg>
              <span>Co-ordination</span>
            </li>
            <li key={`item-5`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: PROD_COLORS.productive}} />
              </svg>
              <span>Productive</span>
            </li>
          </ul>
        </div>
      );
  }
  render () {
    return (
      <div className="db-overview">
        <div className="db-legend">
          {this.customizedLegend()}
        </div>
        <div style={{width: "100%", height: "87.5%"}}>
          <ProductivityChart />
          <ProductivityTiles />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    includeVacation: state.productivity.includeVacation
  };
}

export default connect(mapStateToProps, null )(ProductivityOverview);
