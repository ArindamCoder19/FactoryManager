import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

import BackdropLoader from '../../general/BackdropLoader';

import { getOverallStatistics } from '../../../actions/productivityActions';
import { PROD_COLORS } from '../../../util/constants';

class ProductivityTiles extends Component {
  constructor() {
    super();

    this.state = {
      yearSelect: "CUR"
    }
  }

  onYearSelect(state) {
    let { includeVacation, ddSelected } = this.props;
    let payload = {};

    switch (state) {
      case "PREV":
        payload["year"] = moment().subtract(1, 'year').year();
        break;
      case "CUR":
        payload["year"] = moment().year();
        break;
      case "ALL":
        payload["year"] = "all";
        break;
      default:
    }
    payload["category"] = ddSelected.value;

    this.props.getOverallStatistics(payload, includeVacation);
    this.setState({yearSelect: state});
  }

  render () {
    let { includeVacation, statData, isoverallfetching } = this.props;
    return (
        <Col xs={12} md={6} style={{height: "100%"}}>
          <div className="prod-statistics">
            {isoverallfetching && <BackdropLoader show={true}/>}
            <div className="prod-cProgressBar">
              <CircularProgressbar
                background
                backgroundPadding={5}
                strokeWidth={8}
                percentage={statData.pPerc}
                textForPercentage={(pct) =>
                  <tspan>
                    <tspan x="50" y="50" dy="0">{ `${pct}%`}</tspan>
                  </tspan>}
                classForPercentage={(percentage) => {
                  return 'prod-blue';
                }} />
            </div>
            <div className="prod-tiles">
              <div>
                {includeVacation && <div style={{backgroundColor: PROD_COLORS.vacation}}>{statData.vacation+" Hours ("+statData.vPerc+"%)"}</div>}
                <div style={{backgroundColor: PROD_COLORS.idleTime}}>{statData.idleTime+" Hours ("+statData.iPerc+"%)"}</div>
                <div style={{backgroundColor: PROD_COLORS.meeting}}>{statData.meeting+" Hours ("+statData.mPerc+"%)"}</div>
              </div>
              <div>
                <div style={{backgroundColor: PROD_COLORS.training}}>{statData.training+" Hours ("+statData.tPerc+"%)"}</div>
                <div style={{backgroundColor: PROD_COLORS.coordination}}>{statData.coordination+" Hours ("+statData.cPerc+"%)"}</div>
                <div style={{backgroundColor: PROD_COLORS.productive}}>{statData.productive+" Hours ("+statData.pPerc+"%)"}</div>
              </div>
            </div>
            <div className="prod-years">
              <label>Overall Statistics</label>
              <hr />
              <div>
                <span className={this.state.yearSelect === "ALL" && "selected"} onClick={this.onYearSelect.bind(this, "ALL")}>ALL</span>
                <span className={this.state.yearSelect === "PREV" && "selected"} onClick={this.onYearSelect.bind(this, "PREV")}>{moment().subtract(1, 'year').format("YYYY")}</span>
                <span className={this.state.yearSelect === "CUR" && "selected"} onClick={this.onYearSelect.bind(this, "CUR")}>{moment().format("YYYY")}</span>
              </div>
            </div>
          </div>
        </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    includeVacation: state.productivity.includeVacation,
    ddSelected: state.productivity.ddSelected,
    statData: state.productivity.statData,
    isoverallfetching: state.productivity.isoverallfetching
  };
}

export default connect(mapStateToProps, { getOverallStatistics } )(ProductivityTiles);
