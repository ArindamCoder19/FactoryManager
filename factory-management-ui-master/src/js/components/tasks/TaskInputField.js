import React, { Component } from 'react';
import Select from 'react-select';

class TaskInputField extends Component {

  render() {

    return (
      <div>
        <Select
           name="searchlist"
           value={this.props.value}
           options={this.props.list}
           isLoading={this.props.isLoading}
           className={"searchlist "+this.props.className}
           clearable={false}
           onFocus={this.props.onFocus.bind(this)}
           onChange={this.props.onChange}
        />
      </div>
    )
  }
}


export default TaskInputField;
