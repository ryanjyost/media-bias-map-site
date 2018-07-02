import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import Loader from "react-loader-spinner";

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

    const Placeholder = () => {
      return (
        <div
          style={{
            height: imageHeight,
            width: imageWidth,
            backgroundColor: "#e5e5e5"
          }}
        >
          <div
            style={{
              margin: "auto",
              width: "50%",
              backgroundColor: "#f2f2f2",
              height: 20
            }}
          />
        </div>
      );
    };

    return (
      <Motion
        defaultStyle={{
          linkPosition: -50,
          imageOpacity: 0
        }}
        style={{
          linkPosition: spring(this.state.hover ? 10 : -50),
          imageOpacity: spring(loaded ? 1 : 0)
        }}
      >
        {style => {
          return (
            <div
              key={index}
              style={{
                margin: siteMargin - 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: imageHeight,
                // width: style.imageWidth,
                width: imageWidth,
                backgroundColor: "#f2f2f2",
                position: "relative"
                // filter: `blur(${style.imageOpacity * 2}px)`,
                // WebkitFilter: `blur(${style.imageOpacity * 2}px)`
              }}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
            >
              {/*{!loaded ? <Placeholder /> : null}*/}
              <img
                style={{
                  height: imageHeight,
                  width: imageWidth,
                  display: loaded ? "" : "none",
                  opacity: style.imageOpacity
                }}
                draggable="false"
                src={`https://d1dzf0mjm4jp11.cloudfront.net/${record.image}`}
                onLoad={() => this.setState({ loaded: true })}
              />
              <a
                href={record.site.url}
                target={"_blank"}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fff",
                  opacity: !loaded
                    ? 0
                    : isTouch
                      ? 0.9
                      : hoverLink
                        ? 1
                        : hover
                          ? 0.8
                          : 0,
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
