import React, {Component} from "react";

export default class RadioButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  RadioChanger(event) {
    let val = event.target.value;
    this.setState({value: val});
    this.props.change(val);
  }

  render() {

    return (
      <div className="form-check form-check-inline">
        <label className="form-check-label" for="male">
          <input className="form-check-input"
                 type="radio"
                 name="gender"
                 id="male"
                 value="Male"
                 checked={this.state.value === "Male"}
                 onChange={this.RadioChanger.bind(this)}
                 required
          />Male
        </label>
        <label className="form-check-label" for="female">
          <input className="form-check-input"
                 type="radio"
                 name="gender"
                 id="female"
                 value="Female"
                 checked={this.state.value === "Female"}
                 onChange={this.RadioChanger.bind(this)}
          />Female
        </label>
        <label className="form-check-label" for="other">
          <input className="form-check-input"
                 type="radio"
                 name="gender"
                 id="other"
                 value="Other"
                 checked={this.state.value === "Other"}
                 onChange={this.RadioChanger.bind(this)}
          />Other
        </label>
      </div>
    )
  }
}
