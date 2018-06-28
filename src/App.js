import React, { Component } from "react";
import Site from "./components/Site";
import axios from "axios";
import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";
import Links from "./components/Links";
import SimpleStorage from "react-simple-storage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linksView: false,
      hideSources: false,
      isWideView: true,
      isFirstVisit: true,

      // nonsaved
      isMenuOpen: false,
      showMenuText: false,
      records: [],
      screenWidth: 0,
      screenHeight: 0,
      imageSizeFactor: 5,
      plusHovered: false,
      plusClicked: false,
      minusHovered: false,
      minusClicked: false,

      showScrollTop: false,

      // drag scroll
      isMouseDown: false,
      startX: 0,
      startY: 0
    };
  }

  componentDidMount() {
    //get recent posts
    axios
      .get(`https://media-bias-map.herokuapp.com/records/get_recent`, {
        Accept: "application/json"
      })
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

    window.addEventListener(
      "scroll",
      this.throttle(this.handleScroll.bind(this), 200)
    );

    document.addEventListener("keydown", this.handleKeyZoom.bind(this), false);

    this.handleShowMenu();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  handleKeyZoom(e) {
    if (!this.state.linksView) {
      if (e.keyCode === 187 && e.metaKey) {
        let imageSizeFactor = this.state.imageSizeFactor;
        e.preventDefault();
        this.setState({
          imageSizeFactor:
            imageSizeFactor > 1 ? imageSizeFactor - 0.5 : imageSizeFactor
        });
      } else if (e.keyCode === 189 && e.metaKey) {
        let imageSizeFactor = this.state.imageSizeFactor;
        e.preventDefault();
        this.setState({
          imageSizeFactor:
            imageSizeFactor < 5 ? imageSizeFactor + 0.5 : imageSizeFactor
        });
      }
    }
  }

  handleScroll(e) {
    if (window.scrollY > 100 && !this.state.showScrollTop) {
      this.setState({ showScrollTop: true });
    } else if (window.scrollY < 99 && this.state.showScrollTop) {
      this.setState({ showScrollTop: false });
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

  scrollTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  handleShowMenu() {
    if (this.state.isMenuOpen) {
      this.setState({ isMenuOpen: false, showMenuText: false });
      if (this.state.isFirstVisit) {
        this.setState({ isFirstVisit: false });
      }
    } else {
      this.setState({ isMenuOpen: true });
      setTimeout(
        function() {
          this.setState({ showMenuText: true });
        }.bind(this),
        300
      );
    }
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
      showMenuText,
      isMouseDown,
      showScrollTop,
      hideSources,
      isFirstVisit
    } = this.state;

    let siteMargin = 5,
      sitesWide = 5,
      imageContainerWidth = screenWidth;

    let imageHeight = 1024 / imageSizeFactor;
    let imageWidth = 1024 / imageSizeFactor;

    sitesWide = Math.max(Math.floor(screenWidth / imageWidth), 6);
    imageContainerWidth = (imageWidth + siteMargin * 2) * sitesWide;

    return (
      <div>
        {isFirstVisit ? (
          <Motion
            defaultStyle={{
              height: 0,
              width: 0,
              opacity: 0
            }}
            style={{
              height: spring(isFirstVisit ? 118 : 0),
              width: spring(isFirstVisit ? 198 : 0),
              opacity: spring(isFirstVisit ? 1 : 0)
            }}
          >
            {style => (
              <div
                style={{
                  position: "fixed",
                  width: style.width,
                  height: style.height,
                  opacity: style.opacity,
                  zIndex: 99,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  top: "60px",
                  left: "60px",
                  boxShadow: "8px 11px 28px -12px rgba(0,0,0,0.5)",
                  backgroundColor: "rgba(240,240,240,0.98)",
                  border: "1px solid #f2f2f2",
                  borderBottomRightRadius: 3
                }}
              >
                <div
                  style={{
                    padding: "0px 10px 0px 10px",
                    fontSize: 12,
                    opacity: style.opacity,
                    color: "rgba(0,0,0,0.6)"
                  }}
                >
                  Welcome to
                </div>
                <div
                  style={{
                    padding: "0px 10px",
                    fontSize: 20,
                    opacity: style.opacity,
                    fontWeight: "bold"
                  }}
                >
                  Bird's Eye News
                </div>
                <div
                  style={{
                    padding: "0px 12px",
                    fontSize: 14,
                    opacity: style.opacity,
                    color: "rgba(0,0,0,0.5)"
                  }}
                >
                  where you can{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#59CFA6",
                      letterSpacing: "0.05em",
                      fontSize: 16,
                      opacity: style.opacity
                    }}
                  >
                    fly above the bullshit.
                  </span>
                </div>
              </div>
            )}
          </Motion>
        ) : null}
        <SimpleStorage
          parent={this}
          blacklist={[
            "isFirstVisit",
            "records",
            "screenWidth",
            "screenHeight",
            "plusHovered",
            "plusClicked",
            "minusHovered",
            "minusClicked",
            "showScrollTop",
            "isMouseDown",
            "startX",
            "startY",
            "isMenuOpen",
            "showMenuText"
          ]}
        />

        {/* Hamburger menu */}
        <Motion
          defaultStyle={{
            topBarRotation: 0,
            topBarTop: 0,
            wideMenuWidth: 0,
            menuHeight: 0,
            wideMenuPaddingRight: 0,
            wideMenuPaddingLeft: 0,
            wideMenuOpacity: 0,
            borderRadius: 3,
            buttonOpacity: 0
          }}
          style={{
            topBarRotation: spring(isMenuOpen ? 45 : 0),
            topBarTop: spring(isMenuOpen ? 0 : -6),
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
                zIndex: 100,
                top: "20px",
                left: "20px",
                position: "fixed",
                display: "flex"
              }}
            >
              <div
                style={{
                  backgroundColor: isMenuOpen ? "#59CFA6" : "#59CFA6",
                  height: 40,
                  width: 40,
                  borderTopRightRadius: style.borderRadius,
                  borderTopLeftRadius: 3,
                  borderBottomLeftRadius: style.borderRadius,
                  borderBottomRightRadius: style.borderRadius,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isMenuOpen
                    ? ""
                    : "8px 11px 28px -12px rgba(0,0,0,1)",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 20,
                  opacity: style.buttonOpacity
                }}
                onClick={() => this.handleShowMenu()}
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
                      backgroundColor: isMenuOpen
                        ? "rgba(255, 255, 255, 0.8)"
                        : "#fff",
                      zIndex: 20,
                      position: "absolute",
                      top: isMenuOpen ? "0px" : `${-style.topBarTop}px`,
                      // marginTop: style.topBarMargin,
                      transform: `rotate(${style.topBarRotation}deg)`
                    }}
                  />
                  <div
                    style={{
                      width: 25,
                      height: isMenuOpen ? 0 : 2,
                      backgroundColor: isMenuOpen
                        ? "rgba(255, 255, 255, 0.8)"
                        : "#fff",
                      zIndex: 20
                      // borderRadius: 30
                    }}
                  />
                  <div
                    style={{
                      width: 25,
                      height: 2,
                      backgroundColor: isMenuOpen
                        ? "rgba(255, 255, 255, 0.8)"
                        : "#fff",
                      zIndex: 20,
                      // borderRadius: 30,
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
                  height: 40,
                  width: style.wideMenuWidth,
                  // position: "fixed",
                  zIndex: 10,
                  // top: "20px",
                  left: "40px",
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: isFirstVisit ? 0 : 3,
                  boxShadow: isFirstVisit
                    ? ""
                    : "8px 11px 28px -12px rgba(0,0,0,1)",
                  cursor: "pointer",
                  position: "absolute",
                  opacity: style.wideMenuOpacity,
                  backgroundColor: "rgb(51, 55, 70)"
                }}
              >
                <a
                  className={"menuLink"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.5,
                    fontSize: 12,
                    letterSpacing: "0.03em",
                    zIndex: 20,
                    color: showMenuText
                      ? !linksView
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                    borderTop: !linksView
                      ? "3px solid #59CFA6"
                      : "3px solid rgb(51, 55, 70)",
                    opacity: style.wideMenuOpacity
                  }}
                  onClick={() => this.setState({ linksView: false })}
                >
                  {"Front \n Pages"}
                </a>
                <a
                  className={"menuLink"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.5,
                    fontSize: 12,
                    letterSpacing: "0.03em",
                    borderTopRightRadius: 3,
                    zIndex: 20,
                    color: showMenuText
                      ? linksView
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                    borderTop: linksView
                      ? "3px solid #59CFA6"
                      : "3px solid rgb(51, 55, 70)",
                    opacity: style.wideMenuOpacity
                  }}
                  onClick={() => this.setState({ linksView: true })}
                >
                  {"Headlines"}
                </a>
              </div>

              {/* Wide Menu Vert */}
              <div
                style={{
                  height: style.menuHeight,
                  width: 40,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: isFirstVisit ? 0 : 3,
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "center",
                  boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.8)",
                  cursor: "pointer",
                  position: "absolute",
                  opacity: style.wideMenuOpacity,
                  top: "40px",
                  backgroundColor: "rgb(51, 55, 70)"
                }}
              >
                <a
                  className={"menuLink"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.35,
                    fontSize: 18,
                    zIndex: 20,
                    color: showMenuText
                      ? (!linksView && isWideView) ||
                        (linksView && !hideSources)
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                    borderLeft:
                      (!linksView && isWideView) || (linksView && !hideSources)
                        ? "3px solid #59CFA6"
                        : "3px solid rgb(51, 55, 70)",
                    opacity: style.wideMenuOpacity
                  }}
                  onClick={() => {
                    if (linksView) {
                      this.setState({ hideSources: false });
                    } else {
                      this.setState({ isWideView: true });
                    }
                  }}
                >
                  {linksView ? (
                    <i className={"fas fa-eye"} />
                  ) : (
                    <i className={"fas fa-expand-arrows-alt"} />
                  )}
                </a>
                <a
                  className={"menuLink"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 0.35,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    color: showMenuText
                      ? (!linksView && !isWideView) ||
                        (linksView && hideSources)
                        ? "#fff"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                    fontSize: 18,
                    borderLeft:
                      (!linksView && !isWideView) || (linksView && hideSources)
                        ? "3px solid #59CFA6"
                        : "3px solid rgb(51, 55, 70)",
                    opacity: style.wideMenuOpacity
                  }}
                  onClick={() => {
                    if (linksView) {
                      this.setState({ hideSources: true });
                    } else {
                      this.setState({ isWideView: false });
                    }
                  }}
                >
                  {linksView ? (
                    <i className={"fas fa-eye-slash"} />
                  ) : (
                    <i className={"fas fa-arrows-alt-v"} />
                  )}
                </a>
              </div>
            </div>
          )}
        </Motion>

        {/* Resize */}
        {!linksView ? (
          <Motion defaultStyle={{ x: 0 }} style={{ x: spring(10) }}>
            {style => (
              <div
                style={{
                  position: "fixed",
                  bottom: "20px",
                  left: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 50,
                  height: 100,
                  width: 40,
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  boxShadow: "8px 11px 28px -12px rgba(0,0,0,1)",
                  opacity: 0.95
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
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
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
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
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
        ) : (
          <Motion
            defaultStyle={{ scrollBtnOpacity: 0 }}
            style={{ scrollBtnOpacity: spring(showScrollTop ? 0.8 : 0) }}
          >
            {style => (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  display: showScrollTop ? "flex" : "none",
                  opacity: showScrollTop ? 0.8 : 0,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 50,
                  height: 40,
                  width: 40,
                  borderRadius: 3,
                  backgroundColor: "rgb(51, 55, 70, 1)",
                  color: "rgba(255,255,255,1)",
                  cursor: "pointer"
                }}
                className={"disableTextSelect"}
                onClick={() => this.scrollTop()}
              >
                <i className={"fas fa-arrow-up"} />
              </div>
            )}
          </Motion>
        )}

        {!linksView ? (
          <div
            style={{
              width: isWideView
                ? imageContainerWidth + 10
                : screenWidth < imageWidth
                  ? imageWidth
                  : screenWidth,
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
        ) : (
          <div
            style={{
              width: "100%",
              margin: "auto",
              display: "flex",
              flexWrap: "wrap",
              backgroundColor: "#fcfcfc"
            }}
          >
            <Links records={records} hideSources={hideSources} />
          </div>
        )}
      </div>
    );
  }
}
