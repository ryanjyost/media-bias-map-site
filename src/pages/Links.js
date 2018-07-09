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
    this.state = {
      search: "",
      tag: null,
      filterActive: false,
      pulse: false,
      articles: [],
      gotLinks: false
    };
  }

  componentDidMount() {
    //get recent posts
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
  }

  handleSearch(text) {
    this.setState({ search: text });
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

  render() {
    const { filterActive, search, round, articles, tag } = this.state;

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

    if (!this.state.gotLinks) {
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
            <Loader type="Oval" color="#59CFA6" height="100" width="100" />
          </div>
        </div>
      );
    } else {
      const tags = round.tags.slice(0, 20);
      const tagCounts = tags.map(tag => {
        return tag.tf;
      });
      const tagMean = mean(tagCounts);
      const tagSD = standardDeviation(tagCounts);

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
              padding: "60px 5% 20px 5%",
              maxWidth: 700,
              width: "90%",
              margin: "auto"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginBottom: 10
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
                      let z = zScore(tag.tf, tagMean, tagSD);
                      let factor = 1 + z;
                      return (
                        <span
                          key={i}
                          style={{
                            fontSize: median([Math.floor(20 * factor), 30, 12]),
                            margin: 3,
                            padding: "4px 9px",
                            borderRadius: 3,
                            backgroundColor:
                              tag.term === this.state.search
                                ? "rgba(51, 55, 70, 1)"
                                : "rgba(51, 55, 70, 0.7)",
                            color: "rgba(255,255,255,0.95)",
                            cursor: "pointer"
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
              {/*value={this.state.search}*/}
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

            <Motion
              defaultStyle={{ pulseOpacity: 0 }}
              style={{ pulseOpacity: spring(this.state.pulse ? 0.5 : 0) }}
            >
              {style => (
                <div
                  style={{
                    backgroundColor: `rgba(89, 207, 166, ${
                      style.pulseOpacity
                    })`,
                    padding: 10,
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
