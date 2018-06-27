import React, { Component } from "react";
import { Motion, spring } from "react-motion";
import shuffle from "shuffle-array";
import axios from "axios";
import _array from "lodash/array";
import Link from "./Link";
import Loader from "react-loader-spinner";

export default class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      search: "",
      filterActive: false,
      pulse: false,
      gotLinks: false
    };
  }

  componentDidMount() {
    axios
      .get(`https://media-bias-map.herokuapp.com/records/get_recent_links`, {
        Accept: "application/json"
      })
      .then(response => {
        //let results = response.body.results;
        // console.log("hey", response.data.records);
        const records = response.data.records;

        let allLinks = [];
        for (let record of records) {
          let links = record.content.links
            .filter(link => {
              return link.text.length > 5;
            })
            .map(link => {
              return { ...link, site: record.site };
            });
          allLinks.push(links);
        }

        const flattened = allLinks.reduce(function(accumulator, currentValue) {
          return accumulator.concat(currentValue);
        }, []);

        const shuffled = shuffle(flattened, { copy: true });

        this.setState({
          links: shuffled,
          batch: response.data.batch,
          gotLinks: true
        });
      })
      .catch(error => {
        console.log("ERROR", error);
      });
  }

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

  handleSearch(text) {
    this.setState({ search: text, pulse: true });
    setTimeout(
      function() {
        this.setState({ pulse: false });
      }.bind(this),
      50
    );
  }

  render() {
    const { filterActive, links, search } = this.state;

    const cleanSearch = search
      .toLowerCase()
      .replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");

    const filteredLinks = links.filter(link => {
      let cleanTitle = link.text
        .toLowerCase()
        .replace(/[,\/#!$%\^&\*;:{}=_`~()]/g, "");
      return cleanTitle.includes(cleanSearch);
    });

    if (!this.state.gotLinks) {
      return (
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
      );
    } else {
      return (
        <div
          style={{
            padding: "80px 5% 20px 5%",
            maxWidth: 700,
            width: "96%",
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
                paddingLeft: 20
              }}
            >
              {this.state.batch
                ? this.state.batch.tags.map((tag, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: 18,
                          margin: 3,
                          padding: "4px 9px",
                          borderRadius: 3,
                          backgroundColor: "rgb(51, 55, 70, 1)",
                          color: "rgba(255,255,255,0.95)",
                          cursor: "pointer"
                        }}
                        onClick={() =>
                          this.handleSearch(tag.term.toLowerCase())
                        }
                      >
                        {tag.term}
                      </div>
                    );
                  })
                : null}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: filterActive
                  ? "1px solid rgba(51, 55, 70, 1)"
                  : "1px solid rgba(51, 55, 70, 0.3)",
                padding: "0px 10px",
                marginTop: 10,
                marginBottom: 10,
                borderRadius: 9999,
                color: filterActive
                  ? "rgba(51, 55, 70, 1)"
                  : "rgba(51, 55, 70, 0.3)"
              }}
              className={"searchInput"}
            >
              <i
                className={"fa fa-search"}
                style={{
                  color: filterActive
                    ? "rgba(51, 55, 70, 1)"
                    : "rgba(51, 55, 70, 0.3)"
                }}
              />
              <input
                type={"text"}
                value={this.state.search}
                placeholder={"Search headlines"}
                onChange={e => this.handleSearch(e.target.value.toLowerCase())}
                onFocus={() => this.setState({ filterActive: true })}
                onBlur={() => this.setState({ filterActive: false })}
                style={{
                  width: "90%",
                  maxWidth: 300,
                  borderRadius: 3,
                  border: "1px solid transparent",
                  padding: "5px 10px",
                  fontSize: 16,
                  fontWeight: "400",
                  textAlign: "left",
                  letterSpacing: "0.03em"
                }}
              />
              <i
                className={"fas fa-times"}
                style={{
                  color:
                    search.length > 0
                      ? "rgba(51, 55, 70, 0.8)"
                      : "rgba(51, 55, 70, 0)",
                  cursor: "pointer"
                }}
                onClick={() => this.handleSearch("")}
              />
            </div>
          </div>

          <Motion
            defaultStyle={{ pulseOpacity: 0 }}
            style={{ pulseOpacity: spring(this.state.pulse ? 0.5 : 0) }}
          >
            {style => (
              <div
                style={{
                  backgroundColor: `rgba(89, 207, 166, ${style.pulseOpacity})`,
                  padding: 10,
                  borderRadius: 5
                }}
              >
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link, i) => {
                    return (
                      <Link
                        link={link}
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
                      style={{ textAlign: "center", color: "rgba(0,0,0,0.7)" }}
                    >
                      We couldn't find any headlines that match your search
                    </h4>
                  </div>
                )}
              </div>
            )}
          </Motion>
        </div>
      );
    }
  }
}
