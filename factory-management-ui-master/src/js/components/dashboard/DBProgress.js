import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';

class DBProgress extends React.Component {
  render () {
    let { total, availableHours } = this.props;
    return (
      <div className="db-progress">
        <ProgressBar
          now={total != 0 ? (availableHours/total)*100 : 0}
          label={availableHours+"/"+total+' - Hours Available'}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    total: state.dashboard.dashboardData.total,
    availableHours: state.dashboard.dashboardData.availableHours
  };
}

export default connect(mapStateToProps, null)(DBProgress);
