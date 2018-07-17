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
import sites from "./sites";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "headlines",

      // data
      politicsArticles: [],
      opinionArticles: [],
      round: null,

      //other
      tag: null,
      source: null,

      // UI
      showOverlayMenu: false,
      scrollY: 0,
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
      .get(`https://birds-eye-news-api.herokuapp.com/get_latest`, {
        Accept: "application/json"
      })
      .then(response => {
        this.setState({
          politicsArticles: shuffle(response.data.articles.politics),
          opinionArticles: shuffle(response.data.articles.opinion),
          round: response.data.round,
          gotLinks: true,
          sources: shuffle(sites)
          // tag: response.data.round.tags[0].term
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
    this.setState({ tag: text, source: null, showOverlayMenu: false });
    // setTimeout(
    //   function() {
    //     this.setState({ pulse: false });
    //   }.bind(this),
    //   50
    // );

    this.scrollTop();

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
    this.setState({ showTopBar: true });
  }

  saveScrollPosition(scrollY) {
    this.setState({ scrollY: scrollY });
  }

  resetScroll() {
    setTimeout(
      function() {
        window.scrollTo(0, this.state.scrollY);
      }.bind(this),
      0
    );
  }

  shuffleTag() {
    this.setState({ source: null });
    let tag = this.state.round.tags[
      Math.floor(Math.random() * this.state.round.tags.length)
    ];

    this.setState({ tag: tag.term });
  }

  shuffleSource() {
    this.setState({ tag: null });
    let source = this.state.sources[
      Math.floor(Math.random() * this.state.sources.length)
    ];

    this.setState({ source });
  }

  render() {
    const {
      showError,
      showTopBar,
      showOverlayMenu,
      screenWidth,
      isMenuOpen
    } = this.state;

    const TagFilter = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            margin: "auto",
            padding: "0px 0px 0px 0px",
            borderTop: "2px solid #f2f2f2"
          }}
        >
          <div
            style={{
              // width: "100%",
              flex: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0px 10px 0px 20px",
              backgroundColor: this.state.tag ? "rgba(89, 207, 166, 0.1)" : "",
              opacity: showOverlayMenu === "sources" ? 0.2 : 1
            }}
            onClick={e => {
              if (!this.state.showOverlayMenu) {
                this.saveScrollPosition(window.scrollY);
                this.scrollTop();
                this.setState({
                  showOverlayMenu: "tags"
                });
              } else if (this.state.showOverlayMenu === "sources") {
                this.setState({
                  showOverlayMenu: "tags"
                });
              } else {
                this.resetScroll();
                this.setState({
                  showOverlayMenu: false
                });
              }
            }}
          >
            <div
              style={{
                color: "rgba(0,0,0,0.5)",
                fontSize: 10,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i
                className="fas fa-angle-right"
                style={{
                  marginRight: 3,
                  fontSize: 10,
                  color: "rgba(51, 55, 70, 0.5)",
                  transform:
                    this.state.showOverlayMenu === "tags"
                      ? "rotate(90deg)"
                      : "rotate(0deg)"
                }}
              />{" "}
              Buzzword
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0px 10px 0px 10px",
                height: 35,
                width: "100%",
                cursor: "pointer",
                fontSize: 13,
                textAlign: "center"
                // borderLeft: "1px solid #d8d8d8"
              }}
            >
              <div
                style={{
                  // borderBottom: "2px solid rgba(89, 207, 166, 1)",
                  // paddingBottom: 2,
                  // paddingRight: 5,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {this.state.tag ? this.state.tag : "All Buzzwords"}
              </div>
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
              minWidth: 60,
              flex: 0.2,
              opacity: showOverlayMenu === "sources" ? 0 : 1
            }}
            onClick={() => {
              if (this.state.showOverlayMenu) {
                this.setState({ showOverlayMenu: false });
                this.resetScroll();
              } else {
                this.shuffleTag();
                this.scrollTop();
              }
            }}
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
      );
    };

    const SourceFilter = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            margin: "auto",
            padding: "0px 0px 0px 0px",
            borderTop: "2px solid #f2f2f2"
          }}
        >
          <div
            style={{
              // width: "100%",
              flex: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0px 10px 0px 20px",
              backgroundColor: this.state.source
                ? "rgba(89, 207, 166, 0.1)"
                : "",
              opacity: showOverlayMenu === "tags" ? 0.2 : 1
            }}
            onClick={() => {
              if (!this.state.showOverlayMenu) {
                this.saveScrollPosition(window.scrollY);
                this.scrollTop();
                this.setState({
                  showOverlayMenu: "sources"
                });
              } else if (this.state.showOverlayMenu === "tags") {
                this.setState({
                  showOverlayMenu: "sources"
                });
              } else {
                this.resetScroll();
                this.setState({
                  showOverlayMenu: false
                });
              }
            }}
          >
            <div
              style={{
                color: "rgba(0,0,0,0.5)",
                fontSize: 10,
                display: "flex",
                alignItems: "center"
              }}
            >
              <i
                className="fas fa-angle-right"
                style={{
                  marginRight: 3,
                  fontSize: 10,
                  color: "rgba(51, 55, 70, 0.5)",
                  transform:
                    this.state.showOverlayMenu === "sources"
                      ? "rotate(90deg)"
                      : "rotate(0deg)"
                }}
              />{" "}
              Source
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0px 10px 0px 10px",
                height: 35,
                width: "100%",
                cursor: "pointer",
                fontSize: 13,
                textAlign: "center"
                // borderLeft: "1px solid #d8d8d8"
              }}
            >
              <div
                style={{
                  // borderBottom: "2px solid rgba(89, 207, 166, 1)",
                  // paddingBottom: 2,
                  // paddingRight: 5,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {this.state.source ? this.state.source.title : "All Sources"}
              </div>
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
              minWidth: 60,
              flex: 0.2,
              opacity: showOverlayMenu === "tags" ? 0 : 1
            }}
            onClick={() => {
              if (this.state.showOverlayMenu) {
                this.setState({ showOverlayMenu: false });
                this.resetScroll();
              } else {
                this.shuffleSource();
              }
            }}
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
                onClick={() => {
                  this.resetScroll();
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
      );
    };

    const TopBarMobile = () => {
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
                maxWidth: 800,
                zIndex: 10
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
                      opacity: 0,
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
                  fontSize: 15,
                  fontWeight: "bold",
                  letterSpacing: "0.03em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Bird's Eye News
              </div>
              <div
                style={{
                  textAlign: "right",
                  order: 3,
                  width: 100,
                  paddingRight: 20
                }}
                onClick={() =>
                  this.setState({
                    showOverlayMenu:
                      this.state.showOverlayMenu !== "info" ? "info" : null
                  })
                }
              >
                <i
                  className={
                    this.state.showOverlayMenu === "info"
                      ? `fas fa-times`
                      : `fas fa-info-circle`
                  }
                  style={{
                    color: "rgba(51, 55, 70, 0.4)",
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                />
              </div>
            </div>
          )}
          {/* Nav */}
          {this.state.view === "headlines" || this.state.view === "opinion" ? (
            <SourceFilter />
          ) : null}
          {this.state.view === "headlines" || this.state.view === "opinion" ? (
            <TagFilter />
          ) : null}
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
            borderTop: "1px solid #d8d8d8",
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
                flex: 0.33,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  this.state.view === "frontPages"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(51, 55, 70, 0.9)",
                padding: "10px 15px 10px 15px",
                backgroundColor:
                  this.state.view === "frontPages"
                    ? "rgba(51, 55, 70, 0.9)"
                    : "#fff",
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
                flex: 0.34,
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
                  this.state.view === "headlines"
                    ? "rgba(51, 55, 70, 0.9)"
                    : "#fff",
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
                flex: 0.33,
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
                  this.state.view === "opinion"
                    ? "rgba(51, 55, 70, 0.9)"
                    : "#fff",
                fontSize: 13,
                height: 20
              }}
              className={"clickBtn"}
            >
              Opinions
            </div>
            {/*<div*/}
            {/*onClick={() => {*/}
            {/*this.setState({*/}
            {/*view: "topics"*/}
            {/*});*/}
            {/*this.scrollTop();*/}
            {/*}}*/}
            {/*style={{*/}
            {/*flex: 0.25,*/}
            {/*textAlign: "center",*/}
            {/*display: "flex",*/}
            {/*alignItems: "center",*/}
            {/*justifyContent: "center",*/}
            {/*color:*/}
            {/*this.state.view === "topics"*/}
            {/*? "rgba(255, 255, 255, 1)"*/}
            {/*: "rgba(51, 55, 70, 0.7)",*/}
            {/*padding: "10px 15px 10px 15px",*/}
            {/*backgroundColor:*/}
            {/*this.state.view === "topics" ? "#59CFA6" : "#fff",*/}
            {/*fontSize: 13,*/}
            {/*height: 20*/}
            {/*}}*/}
            {/*className={"clickBtn"}*/}
            {/*>*/}
            {/*Buzzwords*/}
            {/*</div>*/}
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
            alignItems: "baseline",
            marginBottom: 10,
            position: "relative",
            padding: "70px 10px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              margin: "10px 0px"
            }}
          >
            {this.state.tag ? (
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  padding: "10px 20px",
                  marginLeft: 10,
                  borderRadius: 5,
                  borderColor: "1px solid #e5e5e5",
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ tag: null, showOverlayMenu: false });
                  this.scrollTop();
                }}
              >
                Clear Filter
              </div>
            ) : null}
          </div>
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
                          tag.term === this.state.tag
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
        </div>
      );
    };

    const Sources = () => {
      return (
        <div
          style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "baseline",
            // position: "relative",
            padding: "70px 0px"
            // width: "100%"
          }}
        >
          {this.state.source ? (
            <div
              style={
                {
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "flex-start",
                  // margin: "10px 0px"
                }
              }
            >
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#f2f2f2",
                  // padding: "10px 20px",
                  marginLeft: 10,
                  borderRadius: 5,
                  borderColor: "1px solid #e5e5e5",
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ source: null, showOverlayMenu: false });
                  this.scrollTop();
                }}
              >
                Clear Filter
              </div>
            </div>
          ) : null}
          {this.state.sources.map((source, i) => {
            return (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  height: 40,
                  borderBottom: "1px solid #e5e5e5",
                  // width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 20px"
                }}
                onClick={() => {
                  this.setState({
                    source: source,
                    tag: null,
                    showOverlayMenu: false
                  });
                  this.scrollTop();
                }}
              >
                {source.title}
              </div>
            );
          })}
        </div>
      );
    };

    const OverlayMenu = () => {
      if (this.state.showOverlayMenu === "info") {
        return (
          <div
            style={{
              backgroundColor: "rgba(51, 55, 70, 0.98)",
              zIndex: 3,
              width: "100%",
              position: "fixed",
              top: 0,
              paddingTop: 70,
              overflow: "auto",
              height: "100vh"
            }}
          >
            <div
              style={{
                fontSize: 16,
                position: "absolute",
                top: "20px",
                right: "20px",
                color: "rgba(255, 255, 255, 0.5)"
              }}
              onClick={() => this.setState({ showOverlayMenu: false })}
            >
              Go Back
            </div>
            <div
              className={"siteTitle"}
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: 30,
                fontWeight: "bold",
                letterSpacing: "0.03em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
              }}
            >
              Bird's Eye News
            </div>
            <h4
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.9)",
                marginTop: 10,
                fontWeight: "normal",
                lineHeight: "1.5em"
              }}
            >
              A balanced, healthy way to stay informed and <br />
              <strong>fly above the bullshit.</strong>
            </h4>
            <hr
              style={{
                width: "90%",
                margin: "auto",
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                color: "rgba(255, 255, 255, 0.8)"
              }}
            >
              {/*<p style={{ margin: 5, textAlign: "center" }}>*/}
              {/*Are you overwhelmed*/}
              {/*</p>*/}
              {/*<hr*/}
              {/*style={{*/}
              {/*width: "90%",*/}
              {/*margin: "10 auto",*/}
              {/*borderColor: "rgba(255, 255, 255, 0.5)"*/}
              {/*}}*/}
              {/*/>*/}
              <img
                src={"/headshot.jpg"}
                style={{
                  borderRadius: 50,
                  border: "2px solid rgba(255, 255, 255, 0.5)"
                }}
                height={50}
                width={50}
              />
              <p style={{ margin: 5 }}>Hi, I'm Ryan, maker of this app.</p>
              <p style={{ textAlign: "center" }}>
                <strong>
                  Shoot me a direct email with any questions, ideas, feedback,
                  thoughts or harsh truths you have about it.
                </strong>
              </p>
              <p>
                <a
                  style={{ color: "rgba(255, 255, 255, 1)" }}
                  href={"mailto:ryanjyost@gmail.com"}
                >
                  ryanjyost@gmail.com
                </a>
              </p>
              <h3>
                <strong>Seriously</strong> - I'll respond!
              </h3>
            </div>
          </div>
        );
      }
      return (
        <div
          style={{
            // backgroundColor: "rgba(255, 255, 255, 0.98)",
            // zIndex: 2,
            // width: "100%",
            // display: "flex",
            // position: "fixed",
            // top: 0,
            paddingTop: 60
            // overflow: "auto",
            // height: this.state.sources.length * 30 + 140
          }}
        >
          {this.state.showOverlayMenu === "tags" ? (
            <Tags round={this.state.round} />
          ) : (
            <Sources />
          )}
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
        <div>
          <TopBarMobile />

          <div
            style={
              {
                // WebkitFilter: `grayscale(30%)`,
                // filter: `grayscale(30%)`
              }
            }
          >
            {" "}
            {showOverlayMenu ? (
              <OverlayMenu {...this.props} />
            ) : (
              <Home {...this.props} {...this.state} />
            )}
          </div>

          {/* search menu */}
          {showOverlayMenu ? null : <BottomMenu />}
        </div>
      );
    }
  }
}
