import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

class DBOnTime extends React.Component {
  render () {
    let { overallPercentage, lastWeekPercentage, lastMonthPercentage,
    overallTotal, overallDelivered,
    weekTotal, weekDelivered,
    monthTotal, monthDelivered} = this.props;
    return (
      <Col xs={12} md={6}>
        <div className="db-ontime">
          On-Time Tasks
          <div className="cProgressBar-container">
            <div >
            	<CircularProgressbar
                background
                backgroundPadding={5}
                strokeWidth={5}
                percentage={overallPercentage == null ? 100 : overallPercentage}
                textForPercentage={(pct) =>
                  <tspan>
                    <tspan x="50" y="45" dy="0">{ `${pct}%`}</tspan>
                    <tspan x="50" y="45" dy="15">{overallDelivered+" / "+overallTotal}</tspan>
                  </tspan>}
                classForPercentage={(percentage) => {
                  return percentage >= 95 ? 'complete' : 'incomplete';
                }} />
              <div>Overall</div>
            </div>
            <div>
              <CircularProgressbar
                background
                backgroundPadding={5}
                strokeWidth={5}
                percentage={lastMonthPercentage == null ? 100 : lastMonthPercentage}
                textForPercentage={(pct) =>
                  <tspan>
                    <tspan x="50" y="45" dy="0">{ `${pct}%`}</tspan>
                    <tspan x="50" y="45" dy="15">{monthDelivered+" / "+monthTotal}</tspan>
                  </tspan>}
                classForPercentage={(percentage) => {
                  return percentage >= 95 ? 'complete' : 'incomplete';
                }} />

              <div>Last Month</div>
            </div>
            <div>
              <CircularProgressbar
                background
                backgroundPadding={5}
                strokeWidth={5}
                percentage={lastWeekPercentage == null ? 100 : lastWeekPercentage}
                textForPercentage={(pct) =>
                  <tspan>
                    <tspan x="50" y="45" dy="0">{ `${pct}%`}</tspan>
                    <tspan x="50" y="45" dy="15">{weekDelivered+" / "+weekTotal}</tspan>
                  </tspan>}
                classForPercentage={(percentage) => {
                  return percentage >= 95 ? 'complete' : 'incomplete';
                }} />

              <div>Last Week</div>
            </div>
          </div>
        </div>
      </Col>
    )
  }
}
function mapStateToProps(state) {
  let { oot, mot, wot,
    overallOT, overallOTD, lastMonthOT,
    lastMonthOTD, lastWeekOT, lastWeekOTD } = state.dashboard.dashboardData;
  return {
    overallPercentage: oot,
    lastMonthPercentage: mot,
    lastWeekPercentage: wot,
    overallDelivered: overallOT,
    overallTotal: overallOTD,
    monthDelivered: lastMonthOT,
    monthTotal: lastMonthOTD,
    weekDelivered: lastWeekOT,
    weekTotal: lastWeekOTD
  };
}

export default connect(mapStateToProps, null)(DBOnTime);
