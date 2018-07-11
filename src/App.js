import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";
import moment from "moment";
import ReactGA from "react-ga";
import sites from "./sites";

import Site from "./components/Site";

import FrontPages from "./pages/FrontPages";
import Links from "./pages/Links";
import Home from "./pages/Home";
import axios from "axios/index";

// const TopBarWithRouter = withRouter(props => <TopBar {...props} />);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "headlines",

      // data
      articles: [],
      round: null,

      //other
      search: "",

      // UI
      showTopBar: true,
      gotLinks: false,
      splashLoaded: false,
      showLoadScreen: true,
      showError: false,
      screenWidth: 0,
      screenHeight: 0,
      showScrollTop: false
    };
  }

  componentDidMount() {
    axios
      .get(`https://birds-eye-news-api.herokuapp.com/get_headlines`, {
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

    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener(
      "resize",
      this.throttle(this.updateDimensions.bind(this), 1000)
    );

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
    if (window.scrollY > 300 && !this.state.showScrollTop) {
      this.setState({ showScrollTop: true, showTopBar: false });
    } else if (window.scrollY < 301 && this.state.showScrollTop) {
      this.setState({ showScrollTop: false, showTopBar: true });
    }
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
      screenWidth
    } = this.state;
    let isMenuOpen = false;

    const TopBar = () => {
      return (
        <div
          style={{
            position: "fixed",
            top: "0px",
            width: "100%",
            // height: showScrollTop ? 40 : 80,
            backgroundColor: "#fff",
            zIndex: 100,
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
                justifyContent: "flex-end",
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
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                      marginLeft: 10,
                      opacity: 0,
                      width: 100
                    }}
                    onClick={() =>
                      this.setState({
                        menuOpen: isMenuOpen ? null : "main"
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
                          zIndex: 20,
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
                          zIndex: 20,
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
                          zIndex: 20,
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
                  width: 100
                }}
              >
                How It Works
              </div>
            </div>
          )}
          {/* Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "94%",
              margin: "auto",
              padding: "0px 0px 0px 0px"
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
                    ? "rgba(51, 55, 70, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                borderTop:
                  this.state.view === "frontPages"
                    ? "3px solid #59CFA6"
                    : "3px solid rgba(51, 55, 70, 0.3)",
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
                    ? "rgba(51, 55, 70, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                borderTop:
                  this.state.view === "headlines"
                    ? "3px solid #59CFA6"
                    : "3px solid rgba(51, 55, 70, 0.3)",
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
                    ? "rgba(51, 55, 70, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                borderTop:
                  this.state.view === "opinion"
                    ? "3px solid #59CFA6"
                    : "3px solid rgba(51, 55, 70, 0.3)",
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
                    ? "rgba(51, 55, 70, 1)"
                    : "rgba(51, 55, 70, 0.7)",
                padding: "10px 15px 10px 15px",
                borderTop:
                  this.state.view === "topics"
                    ? "3px solid #59CFA6"
                    : "3px solid rgba(51, 55, 70, 0.3)",
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

    const Topics = () => {
      if (this.state.view === "frontPages") {
        return null;
      } else {
        return (
          <div
            style={{
              height: 50,
              backgroundColor: "rgba(51, 55, 70, 1)",
              position: "fixed",
              bottom: 0,
              zIndex: 90000,
              width: "100%"
            }}
          >
            hey
          </div>
        );
      }
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
        <div style={{ height: "100vh" }}>
          <TopBar />

          {/* search menu */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              margin: "auto",
              padding: "0px 0px 0px 0px",
              borderTop: "2px solid #f2f2f2",
              position: "fixed",
              bottom: 0,
              zIndex: 90000,
              backgroundColor: "#fff"
            }}
            className={"clickBtn"}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0px 10px 0px 15px",
                height: 50
              }}
            >
              <div>
                <i
                  className={"fa fa-chevron-right"}
                  style={{
                    marginRight: 10,
                    fontSize: 18,
                    color: "rgba(51, 55, 70, 0.5)"
                  }}
                />
              </div>
              All Sources
            </div>
            <div
              className="clickBtn"
              style={{
                height: 50,
                borderLeft: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80
              }}
            >
              <i
                className={"fa fa-random"}
                style={{ fontSize: 20, color: "rgba(51, 55, 70, 0.8)" }}
              />
            </div>
          </div>

          {/*<Topics />*/}

          {/* scroll top */}
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              display: showScrollTop ? "flex" : "none",
              opacity: showScrollTop ? 0.8 : 0,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              height: 30,
              width: 30,
              borderRadius: 3,
              backgroundColor: "rgba(51, 55, 70, 1)",
              color: "rgba(255,255,255,1)",
              cursor: "pointer"
            }}
            className={"disableTextSelect"}
            onClick={() => this.scrollTop()}
          >
            <i className={"fas fa-arrow-up"} />
          </div>

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
