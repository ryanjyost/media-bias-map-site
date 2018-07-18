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

  render() {
    const {
      search,
      round,
      articles,
      tag,
      screenWidth,
      source,
      isWide
    } = this.props;

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

    let filteredArticles = articles
      .filter(item => {
        let allText = item.title + " " + item.description;
        let cleanText = item.title
          .toLowerCase()
          .replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");

        let titleWithoutHyphens = cleanText.replace("-", " ");

        if (tag) {
          return cleanText.includes(
            tag.toLowerCase().replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "")
          );
        } else if (source) {
          return item.siteName === source.name;
        } else {
          return true;
        }
      })
      .slice(0, 50);

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
              padding: "110px 0% 100px 0%",
              paddingTop: isWide ? 90 : 110,
              maxWidth: 700,
              width: "100%",
              margin: "auto"
            }}
          >
            <div
              style={{
                padding: "10px 0px",
                borderRadius: 5,
                minHeight: "100vh"
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
                    margin: "20px 5px",
                    flexDirection: "column",
                    height: "100vh",
                    alignItems: "center"
                  }}
                >
                  <i
                    className={"fa fa-frown"}
                    style={{ fontSize: 40, color: "rgba(51, 55, 70, 0.8)" }}
                  />
                  <h4
                    style={{
                      textAlign: "center",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.3
                    }}
                  >
                    {`Our database doesn't seem to have any ${
                      this.props.view === "headlines"
                        ? "headlines"
                        : "opinion pieces"
                    } ${this.props.tag ? "containing the word" : "from"} ${
                      this.props.tag ? this.props.tag : this.props.source.title
                    }...`}
                    <br />
                  </h4>
                  <h4
                    style={{
                      textAlign: "center",
                      color: "rgba(0,0,0,0.7)",
                      lineHeight: 1.3
                    }}
                  >
                    Email me to complain so I know to make Bird's Eye News
                    better!
                  </h4>

                  <a href={"mailto:ryan@birdseyenews.org"}>
                    ryan@birdseyenews.org
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}
