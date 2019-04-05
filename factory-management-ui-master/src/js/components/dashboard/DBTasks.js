import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Label } from 'recharts';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

const COLORS = ['#00BCD4', '#2196F3', '#E91E63', '#F9A825', '#CDDC39'];

const LEGEND = [
  {name: "Intake", className: "legend-inTake", key: "inTake"},
  {name: "CAB", className: "legend-cab", key: "cab"},
  {name: "Build", className: "legend-build", key: "build"},
  {name: "Test", className: "legend-test", key: "test"},
  {name: "Hold", className: "legend-hold", key: "hold"}
];


class DBTasks extends React.Component {

  getLegendData() {
    let {pieChartData} = this.props;
    return pieChartData.map((item, index) => {
      return <li key={index}><span className={item.className}></span> {item.value} - {item.label}</li>
    })
  }

  render () {
    let { pieChartData, taskCompleted, taskPending } = this.props;
    return (
      <Col xs={12} md={6} >
        <div className="db-tasks">
          Tasks
          <div className="chart-container" style={{height: "100%"}}>

            <div style={{height: "100%", width: "55%"}}>
              <ResponsiveContainer >
              <PieChart onMouseEnter={this.onPieEnter}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  cx={75}
                  cy={90}
                  innerRadius={30}
                  outerRadius={75}
                  fill="#8884d8"
                  paddingAngle={0.5}
                >
                <Label value={taskPending} position="center" />
              	{
                	pieChartData.map((entry, index) => <Cell key={index} fill={COLORS[index]}/>)
                }
              </Pie>

            </PieChart>
              </ResponsiveContainer>
          </div>
          <div style={{width: "45%"}}>
            <ul className="legend">
              {this.getLegendData()}

            </ul>
          </div>

        </div>
      </div>
    </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    pieChartData: state.dashboard.pieChartData,
    taskPending: state.dashboard.pieChartTotal
  };
}

export default connect(mapStateToProps, null)(DBTasks);
