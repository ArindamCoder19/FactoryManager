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

const COLORSS = ["#CDDC39", "#2196F3", "#9C27B0", "#009688", "#d998cb", "#93b9c6", "#ccc5a8"]

const COLORS = {
  ah: "#000000",
  idle: "#FFCA00",
  overtime: "#E91E63"
}

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

const getInvertedCurve = (x, y, width, height) => {
  if(height)
    if(height < -30){
      return `M${x},${y + height}
              L${x},${y - 5}
              A10,15 0 0,0 ${x + width},${y - 5}
              L${x + width},${y + height}
              Z`;
    }else {
      return `M${x},${y + height}
              L${x},${y}
              A10,15 0 0,0 ${x + width},${y}
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

const CurveTopReverse = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getInvertedCurve(x, y, width, height)} stroke="none" fill={fill}/>;
};

const Shape1 = (props) => {
  const { fill, x, y, width, height, shapeIndex, scIds} = props;
  let curved = false, count = 0;
  for(let i = 0; i<scIds.length; i++){
    if(i > shapeIndex && props[scIds[i]._id] != 0){
      count++
    }
  }
  (count == 0 && props.idleTime != 0) && count++;

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

class DnCOverview extends Component {

  _getSubData(payload) {
    let data = []
    this.props.subCategories.forEach((item, index) => {
      if(payload[item._id] != 0)
       data.push(<li key = {index}>
        <svg width="20" height="4">
          <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: COLORSS[index]}} />
        </svg>
        <span>{Math.round(payload[item._id] * 100) / 100}</span>
      </li>);
    })
    return data;
  }

  customizedLegend(props) {
    // const { payload, width } = props;
    // if(width < 680) {
    //   return (
    //     <div className="custom-legend">
    //       <span>Overview</span>
    //       <ul>
    //         <li key={`item-0`}>
    //           <span style={{color: COLORS.ah}}>AH</span>
    //         </li>
    //         {/*
    //           payload.map((entry, index) => (
    //
    //             <li key={`item-${index+1}`}>
    //               <span style={{color: entry.color}}>{entry.value}</span>
    //             </li>
    //           ))
    //         */}
    //       </ul>
    //     </div>
    //   );
    // } else {
      return (
        <div className="custom-legend">
          <span>Overview</span>
          <ul>
            <li key={`item-0`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: COLORS.ah}} />
              </svg>
              <span>Available Hours</span>
            </li>
            {
              this.props.subCategories.map((entry, index) => (
                <li key={`item-${index+1}`}>
                  <svg width="20" height="6">
                    <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: COLORSS[index]}} />
                  </svg>
                  <span>{entry.subCategory+" Demand"}</span>
                </li>
              ))
            }
            <li key={`item-0-1`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: COLORS.idle}} />
              </svg>
              <span>Idle Time</span>
            </li>
            <li key={`item-0-2`}>
              <svg width="20" height="6">
                <rect x="0" y="0" rx="3" ry="5" width="20" height="6" style={{fill: COLORS.overtime}} />
              </svg>
              <span>Overtime</span>
            </li>
          </ul>
        </div>
      );
    // }
  }

  customTooltip(props) {
    const { active } = props;
    if(active){
      const { payload, label, viewBox } = props;
      return (
        <div className="custom-tooltip">
          <ul>
            {viewBox.width < 680 && <li><span>{label}</span></li>}
            <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: COLORS.ah}} />
              </svg>
              <span>{Math.round(payload[0].payload.capacity * 100) / 100}</span>
            </li>
            {
              this._getSubData(payload[0].payload)
            }
            {payload[0].payload.idleTime != 0  && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: COLORS.idle}} />
              </svg>
              <span>{Math.round(payload[0].payload.idleTime * 100) / 100}</span>
            </li>}
            {payload[0].payload.overTime != 0 && <li>
              <svg width="20" height="4">
                <rect x="0" y="0" rx="2" ry="5" width="20" height="4" style={{fill: COLORS.overtime}} />
              </svg>
              <span>{Math.round(payload[0].payload.overTime * 100) / 100}</span>
            </li>}
          </ul>
        </div>
      )
    }else
      return null;
  }

  _getSubCategoryList() {
    let subCategories = this.props.subCategories;
    return this.props.subCategories.map((item, index) => {
      return <Bar
         key={index}
         dataKey={item._id}
         fill={COLORSS[index]}
         stackId="stack1"
         shape={<Shape1 shapeIndex={index} scIds={subCategories}/>}
         maxBarSize={15}
         />
    })
  }
  render () {
    return (
      <div className="db-overview">
        <div className="db-legend">
          {this.customizedLegend()}
        </div>
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
             tickCount={10}
             tick={{fontSize: '0.75em', fill: "#888888"}}
             tickLine={false}/>
           <Tooltip offset={-57.5} cursor={{fill: "#fafafa", opacity: "0.5"}} content={this.customTooltip.bind(this)}/>
           {/*<Legend verticalAlign="top" align='right' height={30} content={this.customizedLegend.bind(this)}/>*/}
           <ReferenceLine y={0} stroke='#E8E8E8'/>
           {
             this._getSubCategoryList()
           }
           <Bar dataKey="idleTime" fill="#FFCA00" stackId="stack1" shape={<CurveTop/>} maxBarSize={15}/>
           <Bar dataKey="overTime" shape={<CurveTopReverse/>} fill="#E91E63" stackId="stack1" maxBarSize={15}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.dnc.dncData.weekData,
    ddSelected: state.dnc.ddSelected,
    subCategories: state.generic.subCategories,
    year: state.dnc.year
  };
}

export default connect(mapStateToProps, null )(DnCOverview);
