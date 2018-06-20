import React, { Component } from "react";
import Site from "./components/Site";
import axios from "axios";
import Slider from "react-rangeslider";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      screenWidth: 0,
      screenHeight: 0,
      imageSizeFactor: 1
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
    const { records, screenHeight, screenWidth, imageSizeFactor } = this.state;

    let siteMargin = 3,
      sitesWide = 5,
      containerWidth = screenWidth;

    let imageHeight = 1024 / imageSizeFactor;
    let imageWidth = 1024 / imageSizeFactor;

    sitesWide = Math.max(Math.floor(screenWidth / imageWidth), 5);
    containerWidth = (imageWidth + siteMargin * 2) * sitesWide;

    console.log(screenWidth, containerWidth);

    // http://res.cloudinary.com/ryanjyost/image/upload/v1529254420/logos/cnn-logo.jpg
    //
    // imageHeight = "100vw";
    // imageWidth = "100vw";

    //let innerWidth =

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
        <div
          style={{
            backgroundColor: "#59CFA6",
            height: 50,
            width: 50,
            borderRadius: 9999,
            position: "fixed",
            zIndex: 10,
            top: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border: "1px solid #d8d8d8",
            boxShadow: " 8px 11px 28px -12px rgba(0,0,0,1)",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                width: 25,
                height: 2,
                backgroundColor: "#fff",
                zIndex: 20,
                marginBottom: 5,
                borderRadius: 50
              }}
            />
            <div
              style={{
                width: 25,
                height: 2,
                backgroundColor: "#fff",
                zIndex: 20,
                marginBottom: 5,
                borderRadius: 50
              }}
            />
            <div
              style={{
                width: 25,
                height: 2,
                backgroundColor: "#fff",
                zIndex: 20,
                borderRadius: 50
              }}
            />
          </div>
        </div>

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
            height: 250,
            width: 50,
            borderRadius: 9999,
            backgroundColor: "#fff",
            boxShadow: "8px 11px 28px -12px rgba(0,0,0,1)"
          }}
        >
          <div
            style={{
              flex: 0.2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => this.setState({ imageSizeFactor: 1 })}
          >
            1
          </div>
          <div
            style={{
              flex: 0.2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => this.setState({ imageSizeFactor: 2 })}
          >
            2
          </div>
          <div
            style={{
              flex: 0.2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => this.setState({ imageSizeFactor: 3 })}
          >
            3
          </div>
          <div
            style={{
              flex: 0.2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => this.setState({ imageSizeFactor: 4 })}
          >
            4
          </div>
          <div
            style={{
              flex: 0.2,
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => this.setState({ imageSizeFactor: 5 })}
          >
            5
          </div>
        </div>
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
