import React, { Component } from "react";
import FrontPages from "./FrontPages";
import Links from "./Links";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { view, round, screenWidth, isWide } = this.props;
    return (
      <div>
        <div style={{ display: view === "frontPages" ? "block" : "none" }}>
          <FrontPages isWide={isWide} />
        </div>
        <div style={{ display: view === "headlines" ? "block" : "none" }}>
          <Links
            {...this.props}
            articles={this.props.politicsArticles}
            category={"politics"}
          />
        </div>
        <div style={{ display: view === "opinion" ? "block" : "none" }}>
          <Links
            {...this.props}
            category={"opinion"}
            articles={this.props.opinionArticles}
          />
        </div>
      </div>
    );
  }
}
