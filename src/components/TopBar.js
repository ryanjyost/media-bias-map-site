import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { location, view } = this.props;
    let isMenuOpen = false;
  }
}
