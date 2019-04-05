import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Tooltip} from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

const data = [
      {name: 'Overall', pv: 20},
      {name: 'Last Month', pv: 30},
      {name: 'Last Week', pv: 100}
];

const CustomizedLabel = props => {
  const { x, y, width, height, value } = props;
  const offset = 25;

  return (
    <text
      x={x + width / 2}
      y={y + height - offset}
      fill="#fff"
      fontSize="0.8vw"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value !== 0 ? value + "%" : 0}
    </text>
  );
};

class DBProductivity extends React.Component {

  render () {
    let {productiveData, ddSelected, isUser, userProfile} = this.props,
    category = "";

    if(isUser && ddSelected.value == "all" && _.includes(userProfile.role,"LEAD")){
      category = userProfile.categoryId[0].category;
    }else if(isUser && _.includes([ddSelected.role], "LEAD") ){
      category = ddSelected.category.value;
    }

    return (
      <Col xs={12} md={6}>
        <div className="db-productive">
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <span>Productivity</span>
            <span>{category}</span>
          </div>
          <div style={{height: "100%"}}>
            <ResponsiveContainer width={'95%'} height={'90%'} >
              <BarChart
                margin={{ top: 25, right: 5, bottom: 0, left: -15 }}
                data={productiveData}
                barSize={70}
                barCategoryGap={1}>
               <XAxis
                 tick={{fill: "#888888", fontSize: "0.8vw" }}
                 axisLine={false}
                 dataKey="label"
                 tickLine={false}/>
               <YAxis
                 tick={{fill: "#888888", fontSize: "0.8vw" }}
                 fill={"#888888"}
                 interval={0}
                 domain={[0,100]}
                 tickLine={false} tickFormatter={(value) => value+"%"} axisLine={false} ticks={[0,25,50,75,100]}/>
               <CartesianGrid horizontal={true} vertical={false} stroke={"#EEEEEE"}/>
               <Tooltip />
               <Bar dataKey="value" fill="#726DA8">
                 {/*<LabelList
                  dataKey="value"
                  position="insideBottom"
                  content={<CustomizedLabel />}
                />*/}
               </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    productiveData: state.dashboard.productiveData,
    ddSelected: state.dashboard.ddSelected,
    isUser: state.dashboard.isUser,
    userProfile: state.user.profile
  };
}

export default connect(mapStateToProps, null)(DBProductivity);
