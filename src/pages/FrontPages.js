import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import sites from "../sites";
import axios from "axios/index";
import shuffle from "shuffle-array";

import Site from "../components/Site";

export default class FrontPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: 0,
      screenHeight: 0,
      records: []
    };
  }

  componentDidMount() {
    //get recent posts
    axios
      .get(`https://birds-eye-news-api.herokuapp.com/get_front_pages`, {
        Accept: "application/json"
      })
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records;
        const randomOrder = shuffle(records, { copy: true });

        this.setState({
          records: randomOrder,
          batch: response.data.batch
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
    this.updateDimensions();
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

  updateDimensions() {
    let screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // let update_height = Math.round(update_width)

    this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
  }

  render() {
    const { screenWidth, screenHeight, records } = this.state;

    let siteMargin = 5,
      sitesWide = 5,
      imageContainerWidth = screenWidth;

    let imageWidth = Math.min(screenWidth, 500);

    sitesWide = Math.max(Math.floor(screenWidth / imageWidth), 6);
    imageContainerWidth = (imageWidth + siteMargin * 2) * sitesWide;

    return (
      <div
        style={{
          width: screenWidth <= imageWidth ? imageWidth : screenWidth,
          margin: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          // WebkitFilter: `grayscale(${style.grayscale}%)`,
          // filter: `grayscale(${style.grayscale}%)`,
          paddingTop: 35
        }}
        // onDoubleClick={() => {
        //   this.setState({
        //     imageSizeFactor:
        //       imageSizeFactor > 1 ? imageSizeFactor - 0.5 : imageSizeFactor
        //   });
        // }}
        // className={"grabbable"}
        id={"main"}
      >
        {this.state.records.length
          ? this.state.records.map((record, i) => {
              return (
                <Site
                  key={i}
                  index={i}
                  record={record}
                  siteMargin={siteMargin}
                  imageWidth={imageWidth}
                />
              );
            })
          : sites.map((site, i) => {
              return (
                <Site
                  key={i}
                  index={i}
                  record={null}
                  siteMargin={siteMargin}
                  imageWidth={imageWidth}
                />
              );
            })}
      </div>
    );
  }
}
