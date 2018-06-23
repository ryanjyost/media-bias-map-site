import React, { Component } from "react";
import Site from "./components/Site";
import axios from "axios";
import Slider from "react-rangeslider";
import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";

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
      isMenuOpen: true,
      isWideView: true,

      // drag scroll
      isMouseDown: false,
      startX: 0,
      startY: 0
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
      .get(
        `https://media-bias-map.herokuapp.com/records/batch/${1529282237311}`,
        {
          Accept: "application/json"
        }
      )
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records;
        const random = shuffle(records, { copy: true });
        this.setState({ records: random });
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

  handleMouseDown(e) {
    this.setState({ isMouseDown: true, startX: e.clientX, startY: e.clientY });
  }

  handleMouseMove(e) {
    window.scrollTo({
      left: window.scrollX + this.state.startX - e.clientX,
      top: window.scrollY + this.state.startY - e.clientY,
      behavior: "smooth"
    });
  }

  handleMouseUp(e) {
    this.setState({ isMouseDown: false });
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
      isMenuOpen,
      linksView,
      isWideView,
      isMouseDown
    } = this.state;

    let siteMargin = 1,
      sitesWide = 5,
      containerWidth = screenWidth;

    let imageHeight = 1024 / imageSizeFactor;
    let imageWidth = 1024 / imageSizeFactor;

    sitesWide = Math.max(Math.floor(screenWidth / imageWidth), 6);
    containerWidth = (imageWidth + siteMargin * 2) * sitesWide;

    return (
      <div>
        {/* Hamburger menu */}
        <Motion
          defaultStyle={{
            topBarRotation: 0,
            topBarTop: 0,
            wideMenuWidth: 180,
            wideMenuPaddingRight: 20,
            wideMenuPaddingLeft: 30,
            wideMenuOpacity: 1
          }}
          style={{
            topBarRotation: spring(isMenuOpen ? 45 : 0),
            topBarTop: spring(isMenuOpen ? 0 : -6),
            wideMenuWidth: spring(isMenuOpen ? 180 : 0),
            wideMenuPaddingRight: spring(isMenuOpen ? 20 : 0),
            wideMenuPaddingLeft: spring(isMenuOpen ? 30 : 0),
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
                  backgroundColor: isMenuOpen ? "#fafafa" : "#59CFA6",
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

              {/* Wide Menu Horz */}
              <div
                style={{
                  backgroundColor: !linksView ? "#59CFA6" : "#e5e5e5",
                  height: 50,
                  width: style.wideMenuWidth,
                  borderRadius: 9999,
                  // position: "fixed",
                  zIndex: 10,
                  // top: "20px",
                  // left: "20px",
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  padding: `0px ${0}px 0px ${style.wideMenuPaddingLeft}px`,
                  boxShadow: " 8px 11px 28px -12px rgba(0,0,0,1)",
                  border: "1px solid #d8d8d8",
                  cursor: "pointer",
                  position: "absolute",
                  opacity: style.wideMenuOpacity
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.55,
                    borderTopRightRadius: 9999,
                    borderBottomRightRadius: 9999,
                    fontSize: 24,
                    borderRight: "1px solid #d8d8d8",
                    marginRight: -20,
                    // paddingLeft: 30,
                    zIndex: 20,
                    backgroundColor: !linksView ? "#59CFA6" : "#e5e5e5",
                    color: !linksView ? "#fff" : "#888"
                  }}
                  onClick={() => this.setState({ linksView: false })}
                >
                  <i className={"far fa-images"} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.45,
                    borderTopRightRadius: 9999,
                    borderBottomRightRadius: 9999,
                    paddingLeft: 15,
                    backgroundColor: linksView ? "#59CFA6" : "#e5e5e5",
                    color: linksView ? "#fff" : "#888",
                    fontSize: 24
                  }}
                  onClick={() => this.setState({ linksView: true })}
                >
                  <i className={"fas fa-link"} />
                </div>
              </div>

              {/* Wide Menu Vert */}
              <div
                style={{
                  backgroundColor: !linksView ? "#59CFA6" : "#e5e5e5",
                  height: style.wideMenuWidth,
                  width: 50,
                  borderRadius: 9999,
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "center",
                  padding: `${style.wideMenuPaddingLeft}px ${0}px 0px 0px`,
                  boxShadow: " 8px 11px 28px -12px rgba(0,0,0,1)",
                  border: "1px solid #d8d8d8",
                  cursor: "pointer",
                  position: "absolute",
                  opacity: style.wideMenuOpacity
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.55,
                    borderBottomRightRadius: 9999,
                    borderBottomLeftRadius: 9999,
                    fontSize: 24,
                    borderBottom: "1px solid #d8d8d8",
                    marginBottom: -20,
                    // paddingTop: 30,
                    zIndex: 20,
                    backgroundColor: isWideView ? "#59CFA6" : "#e5e5e5",
                    color: isWideView ? "#fff" : "#888"
                  }}
                  onClick={() => this.setState({ isWideView: true })}
                >
                  <i className={"fas fa-expand-arrows-alt"} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.45,
                    borderBottomLeftRadius: 9999,
                    borderBottomRightRadius: 9999,
                    paddingTop: 15,
                    backgroundColor: !isWideView ? "#59CFA6" : "#e5e5e5",
                    color: !isWideView ? "#fff" : "#888",
                    fontSize: 24
                    // borderRight: "1px solid #d8d8d8",
                    // marginRight: -20
                  }}
                  onClick={() => this.setState({ isWideView: false })}
                >
                  <i className={"fas fa-arrows-alt-v"} />
                </div>
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
                  backgroundColor: plusClicked ? "#59CFA6CC" : "#59CFA6",
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
                        ? imageSizeFactor - 0.5
                        : imageSizeFactor
                  })
                }
                onMouseEnter={() => this.setState({ plusHovered: true })}
                onMouseLeave={() => this.setState({ plusHovered: false })}
                onMouseDown={() => this.setState({ plusClicked: true })}
                onMouseUp={() => this.setState({ plusClicked: false })}
              >
                {imageSizeFactor < 1.5 ? null : "+"}
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
                  backgroundColor: minusClicked ? "#d8d8d8" : "#fafafa",
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
                        ? imageSizeFactor + 0.5
                        : imageSizeFactor
                  })
                }
                onMouseEnter={() => this.setState({ minusHovered: true })}
                onMouseLeave={() => this.setState({ minusHovered: false })}
                onMouseDown={() => this.setState({ minusClicked: true })}
                onMouseUp={() => this.setState({ minusClicked: false })}
              >
                {imageSizeFactor > 4.5 ? null : "-"}
              </div>
            </div>
          )}
        </Motion>

        <div
          style={{
            width: isWideView ? containerWidth + 10 : screenWidth,
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseMove={e => {
            if (isMouseDown) {
              this.handleMouseMove(e);
            }
          }}
          onMouseUp={e => this.handleMouseUp(e)}
          onDoubleClick={() => {
            this.setState({
              imageSizeFactor:
                imageSizeFactor > 1 ? imageSizeFactor - 0.5 : imageSizeFactor
            });
          }}
          className={"grabbable"}
          id={"main"}
        >
          {this.state.records.map((record, i) => {
            return (
              <Site
                key={i}
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
