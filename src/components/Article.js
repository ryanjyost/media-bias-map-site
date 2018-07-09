import React, { Component } from "react";
import { XmlEntities } from "html-entities";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    const { article, i, hideSource } = this.props;
    const { hover } = this.state;

    const entities = new XmlEntities();
    return (
      <a
        key={i}
        rel="noreferrer"
        target={"_blank"}
        className={"articleLink"}
        href={article.link}
        style={{
          display: "flex",
          padding: "5px 0px",
          margin: 5,
          flexDirection: "column",
          borderBottom: "1px solid #f2f2f2"
        }}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <div
          style={{
            display: "flex"
          }}
        >
          <h3
            style={{
              fontSize: 15,
              // color: "rgba(0, 0, 0, 0.9)",
              textDecoration: hover ? "underline" : "none",
              padding: "0px 0px 3px 0px",
              margin: "0px 0px"
            }}
          >
            {entities.decode(article.title)}
          </h3>
        </div>
        <div
          style={{
            display: "flex"
          }}
        >
          <div
            className={"desc"}
            style={{
              fontSize: 12,

              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {entities.decode(article.description)}
          </div>
        </div>
        {hideSource ? null : (
          <div
            className={"source"}
            style={{
              textAlign: "right",
              fontSize: 12,
              marginTop: 5
            }}
          >
            {article.site.title}
          </div>
        )}
      </a>
    );
  }
}
