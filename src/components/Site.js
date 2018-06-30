import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";

export default class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      hoverLink: false,
      loaded: false
    };
  }

  render() {
    const { siteMargin, imageHeight, imageWidth, record, index } = this.props;
    const { hover, hoverLink, loaded } = this.state;

    const isTouch = detectIt.hasTouch === true;

    return (
      <Motion
        defaultStyle={{
          imageWidth: imageWidth,
          linkPosition: -50
        }}
        style={{
          imageWidth: spring(imageWidth),
          linkPosition: spring(this.state.hover ? 10 : -50)
        }}
      >
        {style => {
          return (
            <div
              key={index}
              style={{
                margin: siteMargin - 1,
                border: "1px solid #d8d8d8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: imageHeight,
                // width: style.imageWidth,
                width: imageWidth,
                backgroundColor: "#333",
                position: "relative"
              }}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
            >
              <div
                style={{
                  height: imageHeight,
                  width: imageWidth,
                  display: loaded ? "none" : "",
                  backgroundColor: "transparent"
                }}
              />
              <img
                style={{
                  height: imageHeight,
                  width: imageWidth,
                  display: loaded ? "" : "none"
                }}
                draggable="false"
                src={record.image.secure_url}
                onLoad={() => this.setState({ loaded: true })}
              />
              <a
                href={record.site.url}
                target={"_blank"}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fff",
                  opacity: isTouch ? 0.9 : hoverLink ? 1 : hover ? 0.8 : 0,
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 2,
                  boxShadow: "8px 11px 28px -12px rgba(0,0,0,1)",
                  borderRadius: 9999,
                  border: "1px solid #f2f2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#333746"
                }}
                onMouseEnter={() => this.setState({ hoverLink: true })}
                onMouseLeave={() => this.setState({ hoverLink: false })}
              >
                <i className="fas fa-external-link-alt" />
              </a>
            </div>
          );
        }}
      </Motion>
    );
  }
}
