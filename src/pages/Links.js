import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";
import axios from "axios";
import _array from "lodash/array";
import Article from "../components/Article";
import Loader from "react-loader-spinner";
import ReactGA from "react-ga";
import { mean, standardDeviation, zScore, median } from "simple-statistics";

export default class Links extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //get recent posts
  }

  // handleSearch(text) {
  //   this.setState({ search: text });
  //   // setTimeout(
  //   //   function() {
  //   //     this.setState({ pulse: false });
  //   //   }.bind(this),
  //   //   50
  //   // );
  //
  //   this.reportSearchToGA(text);
  // }

  // reportSearchToGA(text) {
  //   ReactGA.event({
  //     category: "Input",
  //     action: "Searched headlines",
  //     value: text
  //   });
  // }

  render() {
    const { search, round, articles, tag, screenWidth } = this.props;

    // const filteredLinks = allArticles.filter(item => {
    //   let allText = item.title + " " + item.description;
    //   let cleanText = allText
    //     .toLowerCase()
    //     .replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");
    //
    //   let titleWithoutHyphens = cleanText.replace("-", " ");
    //   return (
    //     cleanText.includes(cleanSearch) ||
    //     titleWithoutHyphens.includes(cleanSearch)
    //   );
    // });

    let filteredArticles = articles.filter(item => {
      let allText = item.title + " " + item.description;
      let cleanText = item.title
        .toLowerCase()
        .replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");

      let titleWithoutHyphens = cleanText.replace("-", " ");

      if (search) {
        return cleanText.includes(
          search.toLowerCase().replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "")
        );
      } else {
        return true;
      }
    });

    if (!this.props.gotLinks) {
      return (
        <div
          style={{
            width: "100%",
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            backgroundColor: "#fcfcfc"
          }}
        >
          <div
            style={{
              height: "100vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Loader type="TailSpin" color="#59CFA6" height="100" width="100" />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            backgroundColor: "#fcfcfc"
          }}
        >
          <div
            style={{
              padding: "80px 0% 20px 0%",
              maxWidth: 700,
              width: "100%",
              margin: "auto"
            }}
          >
            <Motion
              defaultStyle={{ pulseOpacity: 0 }}
              style={{ pulseOpacity: spring(this.props.pulse ? 0.5 : 0) }}
            >
              {style => (
                <div
                  style={{
                    backgroundColor: `rgba(89, 207, 166, ${
                      style.pulseOpacity
                    })`,
                    padding: "10px 0px",
                    borderRadius: 5
                  }}
                >
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((link, i) => {
                      return (
                        <Article
                          article={link}
                          key={i}
                          i={i}
                          hideSource={this.props.hideSources}
                          screenWidth={screenWidth}
                        />
                      );
                    })
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        padding: "5px 10px",
                        margin: 5,
                        flexDirection: "column"
                      }}
                    >
                      <h4
                        style={{
                          textAlign: "center",
                          color: "rgba(0,0,0,0.7)"
                        }}
                      >
                        We couldn't find any headlines that match your search
                      </h4>
                    </div>
                  )}
                </div>
              )}
            </Motion>
          </div>
        </div>
      );
    }
  }
}
