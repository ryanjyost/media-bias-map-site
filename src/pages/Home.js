import React, { Component } from "react";
import FrontPages from "./FrontPages";
import Links from "./Links";

export default class Home extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   vie: true
    // };
  }

  render() {
    const { view } = this.props;
    return (
      <div>
        <div style={{ display: view === "frontPages" ? "block" : "none" }}>
          <FrontPages />
        </div>
        <div style={{ display: view === "headlines" ? "block" : "none" }}>
          <Links />
        </div>
      </div>
    );
  }
}
