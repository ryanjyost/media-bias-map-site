import React, { Component } from "react";
import Site from "./components/Site";
import axios from "axios";
import Slider from "react-rangeslider";
import { Motion, spring } from "react-motion";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      screenWidth: 0,
      screenHeight: 0,
      imageSizeFactor: 5,
      plusHovered: false,
      plusClicked: false,
      minusHovered: false,
      minusClicked: false,
      linksView: false,
      isMenuOpen: true
    };
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)
    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  /**
   * throttle function that catches and triggers last invocation
   * use time to see if there is a last invocation
   */
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  componentDidMount() {
    //get recent posts
    axios
      .get(`http://localhost:8000/records/batch/${1529282237311}`, {
        Accept: "application/json"
      })
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records;
        this.setState({ records });
      })
      .catch(error => {
        console.log("ERROR", error);
      });

    this.updateDimensions();
    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const {
      records,
      screenHeight,
      screenWidth,
      imageSizeFactor,
      plusHovered,
      plusClicked,
      minusHovered,
      minusClicked,
      isMenuOpen
    } = this.state;

    let siteMargin = 3,
      sitesWide = 5,
      containerWidth = screenWidth;

    let imageHeight = 1024 / imageSizeFactor;
    let imageWidth = 1024 / imageSizeFactor;

    sitesWide = Math.max(Math.floor(screenWidth / imageWidth), 5);
    containerWidth = (imageWidth + siteMargin * 2) * sitesWide;

    return (
      <div
        style={{
          overflow: "auto",
          height: "calc(100vh)",
          width: "calc(100%)",
          backgroundColor: "#d8d8d8",
          position: "relative"
        }}
      >
        {/* Hamburger menu */}
        <Motion
          defaultStyle={{
            topBarRotation: 0,
            topBarTop: 0,
            wideMenuWidth: 200,
            wideMenuPaddingRight: 20,
            wideMenuPaddingLeft: 70,
            wideMenuOpacity: 1
          }}
          style={{
            topBarRotation: spring(isMenuOpen ? 45 : 0),
            topBarTop: spring(isMenuOpen ? 0 : -6),
            wideMenuWidth: spring(isMenuOpen ? 200 : 0),
            wideMenuPaddingRight: spring(isMenuOpen ? 20 : 0),
            wideMenuPaddingLeft: spring(isMenuOpen ? 70 : 0),
            wideMenuOpacity: spring(isMenuOpen ? 1 : 0)
          }}
        >
          {style => (
            <div
              style={{
                zIndex: 10,
                top: "20px",
                left: "20px",
                position: "fixed",
                display: "flex"
              }}
            >
              <div
                style={{
                  backgroundColor: isMenuOpen ? "#d8d8d8" : "#59CFA6",
                  height: 52,
                  width: 52,
                  borderRadius: 9999,
                  // position: "fixed",
                  // zIndex: 11,
                  // top: "20px",
                  // left: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isMenuOpen
                    ? ""
                    : "8px 11px 28px -12px rgba(0,0,0,1)",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 20
                }}
                onClick={() =>
                  this.setState({ isMenuOpen: !this.state.isMenuOpen })
                }
              >
                <div
                  style={{
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      width: 25,
                      height: 2,
                      backgroundColor: isMenuOpen ? "#555" : "#fff",
                      zIndex: 20,
                      position: "absolute",
                      borderRadius: 50,
                      top: isMenuOpen ? "0px" : `${-style.topBarTop}px`,
                      // marginTop: style.topBarMargin,
                      transform: `rotate(${style.topBarRotation}deg)`
                    }}
                  />
                  <div
                    style={{
                      width: 25,
                      height: isMenuOpen ? 0 : 2,
                      backgroundColor: isMenuOpen ? "#555" : "#fff",
                      zIndex: 20,
                      borderRadius: 50
                    }}
                  />
                  <div
                    style={{
                      width: 25,
                      height: 2,
                      backgroundColor: isMenuOpen ? "#555" : "#fff",
                      zIndex: 20,
                      borderRadius: 50,
                      // marginBottom: isMenuOpen ? 5 : 0,
                      top: isMenuOpen ? "0px" : `${style.topBarTop}px`,
                      position: "absolute",
                      transform: `rotate(${-style.topBarRotation}deg)`
                    }}
                  />
                </div>
              </div>

              {/* Wide Menu */}
              <div
                style={{
                  backgroundColor: "#fafafa",
                  height: 50,
                  width: style.wideMenuWidth,
                  borderRadius: 9999,
                  // position: "fixed",
                  zIndex: 10,
                  // top: "20px",
                  // left: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `0px ${style.wideMenuPaddingRight}px 0px ${
                    style.wideMenuPaddingLeft
                  }px`,
                  boxShadow: " 8px 11px 28px -12px rgba(0,0,0,1)",
                  border: "1px solid #d8d8d8",
                  cursor: "pointer",
                  position: "absolute",
                  opacity: style.wideMenuOpacity
                }}
              >
                hey
              </div>
            </div>
          )}
        </Motion>

        {/* Resize */}
        <Motion defaultStyle={{ x: 0 }} style={{ x: spring(10) }}>
          {style => (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                height: 120,
                width: 50,
                borderRadius: 9999,
                backgroundColor: "#fff",
                boxShadow: "8px 11px 28px -12px rgba(0,0,0,1)",
                border: "1px solid #f2f2f2"
              }}
            >
              <div
                className={"disableTextSelect"}
                style={{
                  flex: 0.5,
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: plusClicked
                    ? "#59CFA6CC"
                    : "imageSizeFactor" < 2
                      ? "#d8d8d8"
                      : "#59CFA6",
                  borderTopLeftRadius: 9999,
                  borderTopRightRadius: 9999,
                  fontSize: 30,
                  fontWeight: plusHovered ? "400" : "100",
                  color: "#fff"
                }}
                onClick={() =>
                  this.setState({
                    imageSizeFactor:
                      imageSizeFactor > 1
                        ? imageSizeFactor - 1
                        : imageSizeFactor
                  })
                }
                onMouseEnter={() => this.setState({ plusHovered: true })}
                onMouseLeave={() => this.setState({ plusHovered: false })}
                onMouseDown={() => this.setState({ plusClicked: true })}
                onMouseUp={() => this.setState({ plusClicked: false })}
              >
                {imageSizeFactor < 2 ? null : "+"}
              </div>
              <div
                className={"disableTextSelect"}
                style={{
                  flex: 0.5,
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: minusClicked
                    ? "#d8d8d8"
                    : imageSizeFactor > 4
                      ? "#f2f2f2"
                      : "#fafafa",
                  borderBottomLeftRadius: 9999,
                  borderBottomRightRadius: 9999,
                  fontSize: minusHovered ? 50 : 45,
                  fontWeight: "100",
                  color: "#555"
                }}
                onClick={() =>
                  this.setState({
                    imageSizeFactor:
                      imageSizeFactor < 5
                        ? imageSizeFactor + 1
                        : imageSizeFactor
                  })
                }
                onMouseEnter={() => this.setState({ minusHovered: true })}
                onMouseLeave={() => this.setState({ minusHovered: false })}
                onMouseDown={() => this.setState({ minusClicked: true })}
                onMouseUp={() => this.setState({ minusClicked: false })}
              >
                {imageSizeFactor > 4 ? null : "-"}
              </div>
            </div>
          )}
        </Motion>

        <div
          style={{
            width: containerWidth + 10,
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.state.records.map((record, i) => {
            return (
              <Site
                index={i}
                record={record}
                siteMargin={siteMargin}
                imageHeight={imageHeight}
                imageWidth={imageWidth}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
