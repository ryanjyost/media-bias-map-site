import React, { Component } from "react";
import axios from "axios/index";

import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";
import {
  mean,
  median,
  standardDeviation,
  zScore
} from "simple-statistics/index";
import ReactGA from "react-ga";
import Home from "./pages/Home";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "headlines",

      // data
      articles: [],
      round: null,

      //other
      tag: null,

      // UI
      showOverlayMenu: false,
      currentOverlay: null,
      showTopBar: true,
      gotLinks: false,
      splashLoaded: false,
      showLoadScreen: true,
      showError: false,
      screenWidth: 0,
      screenHeight: 0,
      showScrollTop: false,
      isMenuOpen: false
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:8000/get_headlines`, {
        Accept: "application/json"
      })
      .then(response => {
        this.setState({
          articles: shuffle(response.data.articles),
          round: response.data.round,
          gotLinks: true,
          search: response.data.round.tags[0].term
        });
      })
      .catch(error => {
        console.log("ERROR", error);
        this.setState({ showError: true });
      });

    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
    );

    window.addEventListener("scroll", this.handleScroll.bind(this));

    this.updateDimensions();

    // google analystics
    this.initReactGA();
  }

  initReactGA() {
    ReactGA.initialize("UA-97014671-4");
    ReactGA.pageview("/");
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  handleScroll(e) {
    let top = e.target.scrollTop;
    if (window.scrollY > 300 && !this.state.showScrollTop) {
      this.setState({ showScrollTop: true, showTopBar: false });
    } else if (
      window.scrollY < 301 &&
      this.state.showScrollTop &&
      !this.state.showOverlayMenu
    ) {
      this.setState({ showScrollTop: false, showTopBar: true });
    }
  }

  handleSearch(text) {
    this.setState({ tag: text, showOverlayMenu: false });
    // setTimeout(
    //   function() {
    //     this.setState({ pulse: false });
    //   }.bind(this),
    //   50
    // );

    this.reportSearchToGA(text);
  }

  reportSearchToGA(text) {
    ReactGA.event({
      category: "Input",
      action: "Searched headlines",
      value: text
    });
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

  scrollTop(isSmooth = false, top = 0) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isSmooth ? "smooth" : "auto"
    });
  }

  render() {
    const {
      batch,
      showScrollTop,
      showError,
      showTopBar,
      showOverlayMenu,
      screenWidth,
      isMenuOpen
    } = this.state;

    const TopBar = () => {
      return (
        <div
          style={{
            position: "fixed",
            top: "0px",
            width: "100%",
            // height: showScrollTop ? 40 : 80,
            backgroundColor: "#fff",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            opacity: 1,
            borderBottom: "1px solid #d8d8d8"
            // WebkitBoxShadow: "rgb(136, 136, 136) 1px 7px 13px -11px",
            // boxShadow: "rgb(136, 136, 136) 1px 7px 13px -11px"
          }}
        >
          {!showTopBar ? null : (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                height: 40,
                flexFlow: "row wrap",
                maxWidth: 800
              }}
            >
              {/* Hamburger menu */}
              <Motion
                defaultStyle={{
                  topBarRotation: 0,
                  topBarTop: -4,
                  wideMenuWidth: 0,
                  menuHeight: 0,
                  wideMenuPaddingRight: 0,
                  wideMenuPaddingLeft: 0,
                  wideMenuOpacity: 0,
                  borderRadius: 3,
                  buttonOpacity: 1
                }}
                style={{
                  topBarRotation: spring(isMenuOpen ? 45 : 0),
                  topBarTop: spring(isMenuOpen ? 0 : -4),
                  wideMenuWidth: spring(isMenuOpen ? 200 : 0),
                  menuHeight: spring(isMenuOpen ? 120 : 0),
                  wideMenuPaddingRight: spring(isMenuOpen ? 20 : 0),
                  wideMenuPaddingLeft: spring(isMenuOpen ? 30 : 0),
                  wideMenuOpacity: spring(isMenuOpen ? 1 : 0),
                  borderRadius: spring(isMenuOpen ? 0 : 3),
                  buttonOpacity: spring(isMenuOpen ? 1 : 0.8)
                }}
              >
                {style => (
                  <div
                    style={{
                      order: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      position: "relative",
                      paddingLeft: 20,
                      opacity: 1,
                      width: 100
                    }}
                    onClick={() =>
                      this.setState({
                        isMenuOpen: !isMenuOpen
                      })
                    }
                  >
                    <div
                      style={{
                        position: "relative"
                      }}
                      className={"clickBtn"}
                    >
                      <div
                        style={{
                          width: 15,
                          height: 2,
                          backgroundColor: isMenuOpen
                            ? "rgba(51, 55, 70, 0.7)"
                            : "rgba(51, 55, 70, 0.7)",
                          zIndex: 1,
                          position: "absolute",
                          top: isMenuOpen ? "0px" : `${-style.topBarTop}px`,
                          // marginTop: style.topBarMargin,
                          transform: `rotate(${style.topBarRotation}deg)`,
                          borderRadius: 9999
                        }}
                      />
                      <div
                        style={{
                          width: 15,
                          height: isMenuOpen ? 0 : 2,
                          backgroundColor: isMenuOpen
                            ? "rgba(51, 55, 70, 0.7)"
                            : "rgba(51, 55, 70, 0.7)",
                          zIndex: 1,
                          borderRadius: 9999
                        }}
                      />
                      <div
                        style={{
                          width: 15,
                          height: 2,
                          backgroundColor: isMenuOpen
                            ? "rgba(51, 55, 70, 0.7)"
                            : "rgba(51, 55, 70, 0.7)",
                          zIndex: 1,
                          // borderRadius: 30,
                          // marginBottom: isMenuOpen ? 5 : 0,
                          top: isMenuOpen ? "0px" : `${style.topBarTop}px`,
                          position: "absolute",
                          transform: `rotate(${-style.topBarRotation}deg)`,
                          borderRadius: 9999
                        }}
                      />
                    </div>
                  </div>
                )}
              </Motion>
              <div
                className={"siteTitle"}
                style={{
                  textAlign: "center",
                  order: 2,
                  flex: 3,
                  color: "rgb(51, 55, 70)",
                  fontSize: 20,
                  fontWeight: "bold",
                  letterSpacing: "0.03em"
                }}
              >
                newsbie
              </div>
              <div
                style={{
                  textAlign: "right",
                  order: 3,
                  color: "rgba(51, 55, 70, 0)",
                  width: 100,
                  paddingRight: 20
                }}
              >
                <i
                  className={"fa fa-cog"}
                  style={{ color: "rgba(51, 55, 70, 0.7)", fontSize: 14 }}
                />
              </div>
            </div>
          )}
          {/* Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              margin: "auto",
              padding: "0px 0px 0px 0px",
              borderTop: "2px solid #f2f2f2"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0px 10px 0px 15px",
                height: 35,
                width: "100%",
                cursor: "pointer",
                fontSize: 10,
                flex: 0.5,
                textAlign: "center"
              }}
              onClick={() =>
                this.setState({ showOverlayMenu: !this.state.showOverlayMenu })
              }
            >
              <div
                style={{
                  borderBottom: "2px solid rgba(89, 207, 166, 1)",
                  paddingBottom: 2,
                  paddingRight: 5
                }}
              >
                {" "}
                <i
                  className="fas fa-angle-right"
                  style={{ marginRight: 5, color: "rgba(51, 55, 70, 0.2)" }}
                />{" "}
                {this.state.tag ? `${this.state.tag}` : "All Topics"}
              </div>
            </div>
            <span style={{ color: "rgba(0,0,0,0.5)", fontSize: 10 }}>from</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0px 10px 0px 15px",
                height: 35,
                width: "100%",
                cursor: "pointer",
                fontSize: 10,
                flex: 0.5,
                textAlign: "center"
                // borderLeft: "1px solid #d8d8d8"
              }}
              onClick={() =>
                this.setState({
                  showOverlayMenu: !this.state.showOverlayMenu,
                  currentOverlay: "tags"
                })
              }
            >
              <div
                style={{
                  borderBottom: "2px solid rgba(89, 207, 166, 1)",
                  paddingBottom: 2,
                  paddingRight: 5
                }}
              >
                <i
                  className="fas fa-angle-right"
                  style={{
                    marginRight: 5,
                    color: "rgba(51, 55, 70, 0.2)",
                    transform: this.state.currentOverlay === "tags"
                  }}
                />{" "}
                All Sources
              </div>
            </div>
            <div
              className="clickBtn"
              style={{
                height: 35,
                borderLeft: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60
                // flex: 0.2
              }}
              onClick={() => this.setState({ showOverlayMenu: false })}
            >
              {this.state.showOverlayMenu ? (
                <div
                  style={{
                    transform: "rotate(45deg)",
                    fontSize: 30,
                    marginLeft: 5,
                    marginBottom: 4,
                    color: "rgba(51, 55, 70, 0.5)"
                  }}
                >
                  +
                </div>
              ) : (
                <i
                  className={"fa fa-random"}
                  style={{ fontSize: 16, color: "rgba(51, 55, 70, 0.8)" }}
                />
              )}
            </div>
          </div>
        </div>
      );
    };

    const BottomMenu = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            margin: "auto",
            padding: "0px 0px 0px 0px",
            borderTop: "1px solid #f2f2f2",
            position: "fixed",
            bottom: 0,
            zIndex: 1,
            backgroundColor: "#fff"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              margin: "auto",
              padding: "0px 0px 0px 0px"
              // borderTop: "1px solid #d8d8d8"
            }}
          >
            <div
              onClick={() => {
                this.setState({
                  view: "frontPages"
                });
                this.scrollTop();
              }}
              style={{
                flex: 0.25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  this.state.view === "frontPages"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                backgroundColor:
                  this.state.view === "frontPages" ? "#59CFA6" : "#fff",
                fontSize: 13,
                height: 20
              }}
              className={"clickBtn"}
            >
              Front Pages
            </div>
            <div
              onClick={() => {
                this.setState({
                  view: "headlines"
                });
                this.scrollTop();
              }}
              style={{
                flex: 0.25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  this.state.view === "headlines"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                backgroundColor:
                  this.state.view === "headlines" ? "#59CFA6" : "#fff",
                fontSize: 13,
                height: 20
              }}
              className={"clickBtn"}
            >
              Headlines
            </div>
            <div
              onClick={() => {
                this.setState({
                  view: "opinion"
                });
                this.scrollTop();
              }}
              style={{
                flex: 0.25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  this.state.view === "opinion"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                backgroundColor:
                  this.state.view === "opinion" ? "#59CFA6" : "#fff",
                fontSize: 13,
                height: 20
              }}
              className={"clickBtn"}
            >
              Opinions
            </div>
            <div
              onClick={() => {
                this.setState({
                  view: "topics"
                });
                this.scrollTop();
              }}
              style={{
                flex: 0.25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  this.state.view === "topics"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                backgroundColor:
                  this.state.view === "topics" ? "#59CFA6" : "#fff",
                fontSize: 13,
                height: 20
              }}
              className={"clickBtn"}
            >
              Buzzwords
            </div>
          </div>
        </div>
      );
    };

    const Tags = ({ round }) => {
      const tags = round ? round.tags.slice(0, 20) : [];
      const tagCounts = tags.length
        ? tags.map(tag => {
            return tag.tf;
          })
        : [];
      const tagMean = tagCounts.length ? mean(tagCounts) : null;
      const tagSD = tagMean ? standardDeviation(tagCounts) : null;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            position: "relative",
            padding: "50px 10px"
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              alignItems: "baseline",
              paddingLeft: 20
            }}
          >
            {tags.length > 0
              ? tags.map((tag, i) => {
                  let z = this.state.round ? zScore(tag.tf, tagMean, tagSD) : 1;
                  let factor = 1 + z;
                  return (
                    <span
                      key={i}
                      style={{
                        fontSize: median([Math.floor(30 * factor), 50, 16]),
                        margin: 5,
                        padding: "4px 9px",
                        borderRadius: 3,
                        backgroundColor:
                          tag.term === this.props.search
                            ? "rgba(51, 55, 70, 1)"
                            : "rgba(51, 55, 70, 0.7)",
                        color: "rgba(255,255,255,0.95)",
                        cursor: "pointer",
                        textAlign: "right"
                      }}
                      onClick={() => this.handleSearch(tag.term)}
                    >
                      {tag.term}
                    </span>
                  );
                })
              : null}
          </div>

          {/* SEARCH */}
          {/*<div*/}
          {/*style={{*/}
          {/*display: "flex",*/}
          {/*alignItems: "center",*/}
          {/*border: filterActive*/}
          {/*? "1px solid rgba(51, 55, 70, 1)"*/}
          {/*: "1px solid rgba(51, 55, 70, 0.3)",*/}
          {/*padding: "0px 10px",*/}
          {/*marginTop: 10,*/}
          {/*marginBottom: 10,*/}
          {/*borderRadius: 9999,*/}
          {/*color: filterActive*/}
          {/*? "rgba(51, 55, 70, 1)"*/}
          {/*: "rgba(51, 55, 70, 0.3)"*/}
          {/*}}*/}
          {/*className={"searchInput"}*/}
          {/*>*/}
          {/*<i*/}
          {/*className={"fa fa-search"}*/}
          {/*style={{*/}
          {/*color: filterActive*/}
          {/*? "rgba(51, 55, 70, 1)"*/}
          {/*: "rgba(51, 55, 70, 0.3)"*/}
          {/*}}*/}
          {/*/>*/}
          {/*<input*/}
          {/*type={"text"}*/}
          {/*value={this.props.search}*/}
          {/*placeholder={"Search headlines"}*/}
          {/*onChange={e => this.handleSearch(e.target.value.toLowerCase())}*/}
          {/*onFocus={() => this.setState({ filterActive: true })}*/}
          {/*onBlur={() => this.setState({ filterActive: false })}*/}
          {/*style={{*/}
          {/*width: "90%",*/}
          {/*maxWidth: 300,*/}
          {/*borderRadius: 3,*/}
          {/*border: "1px solid transparent",*/}
          {/*padding: "5px 10px",*/}
          {/*fontSize: 16,*/}
          {/*fontWeight: "400",*/}
          {/*textAlign: "left",*/}
          {/*letterSpacing: "0.03em"*/}
          {/*}}*/}
          {/*/>*/}
          {/*<i*/}
          {/*className={"fas fa-times"}*/}
          {/*style={{*/}
          {/*color:*/}
          {/*search.length > 0*/}
          {/*? "rgba(51, 55, 70, 0.8)"*/}
          {/*: "rgba(51, 55, 70, 0)",*/}
          {/*cursor: "pointer"*/}
          {/*}}*/}
          {/*onClick={() => this.handleSearch("")}*/}
          {/*/>*/}
          {/*</div>*/}
        </div>
      );
    };

    const OverlayMenu = () => {
      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            zIndex: 2,
            height: "100vh",
            width: "100%",
            display: "flex",
            position: "fixed",
            top: 0,
            paddingTop: 60,
            overflow: "auto"
          }}
        >
          <Tags round={this.state.round} />
        </div>
      );
    };

    if (showError && false) {
      return (
        <div id="root">
          <div id="div">
            <h4 id="text">Bummer! Something went wrong...</h4>
            <img
              src="https://d1dzf0mjm4jp11.cloudfront.net/apple-icon-180x180.png"
              height="180px"
              width="180px"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            height: "100vh",
            overflow: showOverlayMenu ? "hidden" : ""
          }}
        >
          <TopBar />
          {showOverlayMenu ? <OverlayMenu {...this.props} /> : null}

          {/* search menu */}
          <BottomMenu />

          {/*<Topics />*/}

          {/* scroll top */}
          {/*<div*/}
          {/*style={{*/}
          {/*position: "fixed",*/}
          {/*top: "60px",*/}
          {/*left: "10px",*/}
          {/*display: showScrollTop ? "flex" : "none",*/}
          {/*opacity: showScrollTop ? 0.8 : 0,*/}
          {/*flexDirection: "column",*/}
          {/*alignItems: "center",*/}
          {/*justifyContent: "center",*/}
          {/*zIndex: 1,*/}
          {/*height: 30,*/}
          {/*width: 30,*/}
          {/*borderRadius: 3,*/}
          {/*backgroundColor: "rgba(51, 55, 70, 1)",*/}
          {/*color: "rgba(255,255,255,1)",*/}
          {/*cursor: "pointer"*/}
          {/*}}*/}
          {/*className={"disableTextSelect"}*/}
          {/*onClick={() => this.scrollTop()}*/}
          {/*>*/}
          {/*<i className={"fas fa-arrow-up"} />*/}
          {/*</div>*/}

          <div
            style={
              {
                // WebkitFilter: `grayscale(30%)`,
                // filter: `grayscale(30%)`
              }
            }
          >
            <Home {...this.props} {...this.state} />
          </div>
        </div>
      );
    }
  }
}
