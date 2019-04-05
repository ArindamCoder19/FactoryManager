import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label} from 'recharts';

import { PROD_COLORS } from '../../../util/constants';

const getRectangle = (x, y, width, height) => {
  if(height)
  return `M${x},${y + height}
          L${x},${y}
          L${x + width},${y}
          L${x + width},${y + height}
          Z`;
  else {
    return null
  }
};

const getCurve = (x, y, width, height) => {
  if(height)
    if(height > 10){
      return `M${x},${y + height}
              L${x},${y + 5}
              A10,15 0 0,1 ${x + width},${y + 5}
              L${x + width},${y + height}
              Z`;
    }else {
      return `M${x},${y + height}
              L${x},${y}
              A10,15 0 0,1 ${x + width},${y}
              L${x + width},${y + height}
              Z`;
    }
  else {
    return null
  }
};

const CurveTop = (props) => {
  const { fill, x, y, width, height} = props;
  return <path d={getCurve(x, y, width, height)} stroke="none" fill={fill}/>;
};

const Shape1 = (props) => {
  const { fill, x, y, width, height, shapeIndex, includeVacation } = props;
  let curved = false, count = 0;
  let datakeys = includeVacation ? ["productive", "coordination", "training", "meeting", "idleTime", "vacation"] : ["productive", "coordination", "training", "meeting", "idleTime"];
  for(let i = 0; i<datakeys.length; i++){
    if(i > shapeIndex && props[datakeys[i]] != 0){
      count++
    }
  }

  if(count == 0){
    return <path d={getCurve(x, y, width, height)} stroke="none" fill={fill}/>;
  }else {
    return <path d={getRectangle(x, y, width, height)} stroke="none" fill={fill}/>;
  }
};

const CustomizedLabel =  props => {
  const { x, y, width, height, value } = props.viewBox;

  return (
    <g>
      <path d={`M${x},${y + height} L${x + width},${y + height}`} stroke="#E8E8E8" strokeWidth={1} fill="none"/>;
      <text x={x + width / 2} y={y + height + 15} fill="#888888" fontSize="0.75em" textAnchor="middle" dominantBaseline="bottom">
          {props.year}
      </text>
    </g>
  );
}

class ProductivityChart extends Component {

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

  customTooltipWithVacation(props) {
    const { active } = props;

    if(active){
      const { payload, label, viewBox } = props;
      return (
        <div className="custom-tooltip">
          <span className="tooltip-overview">{payload[0].payload.pPerc+"%"}</span>
          <ul>
            {payload[0].payload.vacation != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.vacation}} />
              </svg>
              <span>{payload[0].payload.vacation+" ("+payload[0].payload.vPerc+"%)"}</span>
            </li>}
            {payload[0].payload.idleTime != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.idleTime}} />
              </svg>
              <span>{payload[0].payload.idleTime+" ("+payload[0].payload.iPerc+"%)"}</span>
            </li>}
            {payload[0].payload.meeting != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.meeting}} />
              </svg>
              <span>{payload[0].payload.meeting+" ("+payload[0].payload.mPerc+"%)"}</span>
            </li>}
            {payload[0].payload.training != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.training}} />
              </svg>
              <span>{payload[0].payload.training+" ("+payload[0].payload.tPerc+"%)"}</span>
            </li>}
            {payload[0].payload.coordination != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.coordination}} />
              </svg>
              <span>{payload[0].payload.coordination+" ("+payload[0].payload.cPerc+"%)"}</span>
            </li>}
            {payload[0].payload.productive != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.productive}} />
              </svg>
              <span>{payload[0].payload.productive+" ("+payload[0].payload.pPerc+"%)"}</span>
            </li>}
          </ul>
        </div>
      )
    }else
      return null;
  }

  customTooltip(props) {
    const { active } = props;

    if(active){
      const { payload, label, viewBox } = props;
      return (
        <div className="custom-tooltip">
          <span className="tooltip-overview">{payload[0].payload.pPerc+"%"}</span>
          <ul>
            {payload[0].payload.idleTime != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.idleTime}} />
              </svg>
              <span>{payload[0].payload.idleTime+" ("+payload[0].payload.iPerc+"%)"}</span>
            </li>}
            {payload[0].payload.meeting != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.meeting}} />
              </svg>
              <span>{payload[0].payload.meeting+" ("+payload[0].payload.mPerc+"%)"}</span>
            </li>}
            {payload[0].payload.training != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.training}} />
              </svg>
              <span>{payload[0].payload.training+" ("+payload[0].payload.tPerc+"%)"}</span>
            </li>}
            {payload[0].payload.coordination != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.coordination}} />
              </svg>
              <span>{payload[0].payload.coordination+" ("+payload[0].payload.cPerc+"%)"}</span>
            </li>}
            {payload[0].payload.productive != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: PROD_COLORS.productive}} />
              </svg>
              <span>{payload[0].payload.productive+" ("+payload[0].payload.pPerc+"%)"}</span>
            </li>}
          </ul>
        </div>
      )
    }else
      return null;
  }

  render () {
    let { includeVacation, statData } = this.props;
    return (
      <Col xs={12} md={6} style={{height: "100%"}}>
        <ResponsiveContainer width={'98%'} height={'85%'} >
          <BarChart data={this.props.data} stackOffset="sign" barGap={20}
                margin={{top: 35, right: 20, left: 0, bottom: 30}}>
           <XAxis dataKey="name"
             axisLine={false}
             tick={{fontSize: '0.75em', fill: "#888888"}}
             tickLine={false}>
             {<Label content={<CustomizedLabel year={this.props.year}/>} viewBox={{height: '20px'}}/>}
           </XAxis>
           <YAxis axisLine={false}
             ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
             tick={{fontSize: '0.75em', fill: "#888888"}}
             tickLine={false}/>
           <Tooltip offset={-57.5} cursor={{fill: "#fafafa", opacity: "0.5"}} content={includeVacation ? this.customTooltipWithVacation.bind(this) : this.customTooltip.bind(this)}/>
           <ReferenceLine y={0} stroke='#E8E8E8'/>
           <Bar dataKey="pPerc" fill="#2196F3" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={0}/>} maxBarSize={15}/>
           <Bar dataKey="cPerc" fill="#4D4D4F" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={1}/>} maxBarSize={15}/>
           <Bar dataKey="tPerc" fill="#607D8B" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={2}/>} maxBarSize={15}/>
           <Bar dataKey="mPerc" fill="#E91E63" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={3}/>} maxBarSize={15}/>
           <Bar dataKey="iPerc" fill="#FFCA00" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={4}/>} maxBarSize={15}/>
           {includeVacation && <Bar dataKey="vPerc" fill="#CDDC39" stackId="stack1"
             shape={<Shape1 includeVacation={includeVacation} shapeIndex={5}/>} maxBarSize={15}/>}
          </BarChart>
        </ResponsiveContainer>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    includeVacation: state.productivity.includeVacation,
    data: state.productivity.prodData.weekData,
    ddSelected: state.productivity.ddSelected,
    year: state.productivity.year
  };
}

export default connect(mapStateToProps, null )(ProductivityChart);
