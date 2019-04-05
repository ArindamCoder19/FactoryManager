import React, { Component } from 'react';
import _ from 'lodash';

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: []
    }
  }


  _onChange(id, data, e) {
    let checkedList = this.state.checkedList;
    //TO_DO: better approach ^assigns a ref
    if(e.target.checked){
      checkedList.push({id: id, data: data})
    }else{
      let taskRfc = data.rfcNumber
      checkedList = _.filter(checkedList, function(o) { return o.data.rfcNumber != taskRfc })
    }
    this.setState({checkedList: checkedList});
  }

  _getProductiveData() {
    let data = this.props.prevweekproddata,
    currentTaskIds = Object.keys(this.props.timesheetdata),
    _this = this,
    prevTaskIds = Object.keys(data);
    return prevTaskIds.map((item) => {
      if(currentTaskIds.indexOf(item) >= 0 ){
        return <div key={item} style={{fontStyle: "italic"}}>
          <input type="checkbox" name="prevtask" value={item} disabled />
          {data[item].rfcNumber}
        </div>
      }else {
        return <div key={item}>
          <input type="checkbox" name="prevtask" value={item} onChange={_this._onChange.bind(_this, item, data[item])}/>
          {data[item].rfcNumber}
        </div>
      }
    });
  }

  _getNonProductiveData() {
    let data = this.props.prevweeknonproddata,
    currentTaskIds = Object.keys(this.props.timesheetdata),
    _this = this,
    prevTaskIds = Object.keys(data);
    return prevTaskIds.map((item) => {
      if(currentTaskIds.indexOf(item) >= 0 ){
        return <div key={item} style={{fontStyle: "italic"}}>
          <input type="checkbox" name="prevtask" value={item} disabled />
          {data[item].nonProdName}
        </div>
      }else {
        return <div key={item}>
          <input type="checkbox" name="prevtask" value={item} onChange={_this._onChange.bind(_this, item, data[item])}/>
          {data[item].nonProdName}
        </div>
      }
    });
  }

  render() {
    if(this.props.show){
      return (
        <div className="modal">
          <div className="prevweekModalContent">
            <div className="modalHeader">
              Populate tasks from previous week
              <div className="nav-close-trigger" onClick={() => {this.props.close()}}><span></span></div>

            </div>

            <div className="modalBody">

              <div className="modalList">
                <div>
                  Tasks
                  <hr />
                  {this._getProductiveData()}
                </div>
                <div>
                  {this._getNonProductiveData()}
                  <div className="button-component">
                    <button
                      className="Sign"
                      onClick={this.props.onAddPrevTasks.bind(this, this.state.checkedList)}>Add Task/s</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
     )
   }else {
     return null
   }
  }
}
