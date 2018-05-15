import React, {Component} from "react";

export default class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(event) {
    let index = event.target && event.target.selectedIndex;
    let el = event.target.options[index];
    let value = el.value;
    this.props.onChange(value, el);
  }

  getOptions(arr, props) {
    return arr.map((item) => (
      <option className="options" key={item[props.idName]} value={item[props.idName]} label={item[props.field]}/>))
  }

  render() {
    return (
      <select className="form-control home-select" value={this.state.selectValue}
              onChange={this.handleChange.bind(this)}>
        {this.getOptions(this.props.array, this.props)}
      </select>
    )
  }
}