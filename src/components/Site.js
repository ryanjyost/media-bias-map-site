import React, { Component } from "react";
import { Motion, spring } from "react-motion";

export default class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const { siteMargin, imageHeight, imageWidth, record, index } = this.props;
    const { hover } = this.state;
    return (
      <Motion
        defaultStyle={{
          imageWidth: imageWidth
        }}
        style={{
          imageWidth: spring(imageWidth)
        }}
      >
        {style => (
          <div
            // href={record.site.url}
            //target={"_blank"}
            key={index}
            style={{
              margin: siteMargin,
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
                backgroundImage: `url(${record.image.url})`,
                backgroundSize: "contain"
              }}
            />
          </div>
        )}
      </Motion>
    );
  }
}
