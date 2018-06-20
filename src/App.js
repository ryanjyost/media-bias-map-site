import React, { Component } from "react";
import Site from "./components/Site";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      screenWidth: 0,
      screenHeight: 0
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
    const { records, screenHeight, screenWidth } = this.state;

    let imageSizeFactor = 2,
      siteMargin = 10,
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
          backgroundColor: "#f2f2f2"
        }}
      >
        <div
          style={{
            width: screenWidth,
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
