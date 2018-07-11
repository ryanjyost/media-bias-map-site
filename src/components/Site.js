import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import detectIt from "detect-it";
import ReactImageMagnify from "react-image-magnify";

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
    const { siteMargin, imageWidth, record, index } = this.props;
    const { hover, hoverLink, loaded } = this.state;

    const Placeholder = () => {
      return (
        <div
          style={{
            height: imageWidth,
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
            <a
              href={record ? record.site.url : ""}
              rel="noreferrer"
              key={index}
              style={{
                margin: siteMargin - 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: imageWidth,
                border: "1px solid #f2f2f2",
                width: imageWidth,
                backgroundColor: "#f2f2f2",
                position: "relative"
                // filter: `blur(${style.imageOpacity * 2}px)`,
                // WebkitFilter: `blur(${style.imageOpacity * 2}px)`
              }}
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
            >
              {/*<a*/}
              {/*href={record.site.url}*/}
              {/*rel="noreferrer"*/}
              {/*target={"_blank"}*/}
              {/*style={{ position: "absolute", top: 0, right: 0 }}*/}
              {/*/>*/}
              {/*{!loaded ? <Placeholder /> : null}*/}
              {record && (
                <ReactImageMagnify
                  enlargedImagePosition={"over"}
                  hoverDelayInMs={500}
                  {...{
                    smallImage: {
                      height: imageWidth,
                      width: imageWidth,
                      src: `https://d1dzf0mjm4jp11.cloudfront.net/${
                        record.image
                      }`,
                      onLoad: () => this.setState({ loaded: true })
                    },
                    largeImage: {
                      src: `https://d1dzf0mjm4jp11.cloudfront.net/${
                        record.image
                      }`,
                      width: 1024,
                      height: 1024
                    }
                  }}
                  style={{
                    display: loaded ? "" : "none",
                    opacity: style.imageOpacity
                  }}
                />
              )}
              {/*<img src={""} />*/}
              {/*<a*/}
              {/*href={record.site.url}*/}
              {/*rel="noreferrer"*/}
              {/*target={"_blank"}*/}
              {/*style={{*/}
              {/*width: 40,*/}
              {/*height: 40,*/}
              {/*backgroundColor: "#fff",*/}
              {/*opacity: !loaded*/}
              {/*? 0*/}
              {/*: isTouch*/}
              {/*? 0.9*/}
              {/*: hoverLink*/}
              {/*? 1*/}
              {/*: hover*/}
              {/*? 0.8*/}
              {/*: 0,*/}
              {/*position: "absolute",*/}
              {/*top: 10,*/}
              {/*right: 10,*/}
              {/*zIndex: 2,*/}
              {/*boxShadow: "8px 11px 28px -12px rgba(0,0,0,1)",*/}
              {/*borderRadius: 9999,*/}
              {/*border: "1px solid #f2f2f2",*/}
              {/*display: "flex",*/}
              {/*alignItems: "center",*/}
              {/*justifyContent: "center",*/}
              {/*color: "#333746"*/}
              {/*}}*/}
              {/*onMouseEnter={() => this.setState({ hoverLink: true })}*/}
              {/*onMouseLeave={() => this.setState({ hoverLink: false })}*/}
              {/*>*/}
              {/*<i className="fas fa-external-link-alt" />*/}
              {/*</a>*/}
              {/*</div>*/}
            </a>
          );
        }}
      </Motion>
    );
  }
}
