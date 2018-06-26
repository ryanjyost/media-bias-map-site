import React, { Component } from "react";
import { Motion, spring } from "react-motion";

export default class Link extends Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    const { link, i } = this.props;
    return (
      <a
        key={i}
        target={"_blank"}
        className={"articleLink"}
        href={link.href}
        style={{
          display: "flex",
          padding: "5px 0px",
          margin: 5,
          flexDirection: "column",
          borderBottom: "1px solid #f2f2f2"
        }}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <div
          style={{
            display: "flex"
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "rgba(0, 0, 0, 0.9)",
              textDecoration: "none",
              padding: "0px 0px 3px 0px"
            }}
          >
            {link.text}
          </div>
        </div>
        <div
          style={{ color: "rgba(0,0,0,0.6)", textAlign: "left", fontSize: 12 }}
        >
          {link.site.title}
        </div>
      </a>
    );
  }
}
