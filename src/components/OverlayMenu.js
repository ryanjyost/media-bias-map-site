import React, { Component } from "react";

const Tags = ({ round }) => {
  const tags = round.tags.slice(0, 20);
  const tagCounts = tags.map(tag => {
    return tag.tf;
  });
  const tagMean = mean(tagCounts);
  const tagSD = standardDeviation(tagCounts);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
                      tag.term === this.props.search
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
      {/*value={this.props.search}*/}
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
  );
};

const OverlayMenu = () => {
  return (
    <div
      style={{
        backgroundColor: "red",
        zIndex: 1,
        height: "100vh",
        width: "100%"
      }}
    >
      hey
    </div>
  );
};

export default OverlayMenu;
