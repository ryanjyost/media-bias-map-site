import React, { Component } from "react";
import { XmlEntities } from "html-entities";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = { hover: false, imageLoaded: false, showImage: true };
  }

  componentDidMount() {
    setTimeout(
      function() {
        if (!this.state.imageLoaded) {
          this.setState({ showImage: false });
        }
      }.bind(this),
      5000
    );
  }

  render() {
    const { article, i, hideSource, screenWidth } = this.props;
    const { hover } = this.state;

    const entities = new XmlEntities();
    return (
      <a
        key={i}
        rel="noreferrer"
        className={"articleLink"}
        href={article.link}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "15px 20px 10px 20px",
          borderBottom: "1px solid #f2f2f2"
        }}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        {/*{article.image && this.state.showImage ? (*/}
        {/*this.state.imageLoaded ? (*/}
        {/*// get screen width and calculate*/}
        {/*<img*/}
        {/*src={article.image.url}*/}
        {/*width={screenWidth}*/}
        {/*height={screenWidth}*/}
        {/*onLoad={() => this.setState({ imageLoaded: true })}*/}
        {/*/>*/}
        {/*) : (*/}
        {/*<div*/}
        {/*style={{*/}
        {/*width: screenWidth - 20,*/}
        {/*height: screenWidth - 20,*/}
        {/*backgroundColor: "red"*/}
        {/*}}*/}
        {/*/>*/}
        {/*)*/}
        {/*) : null}*/}
        <div>
          <div
            style={{
              display: "flex",
              width: "auto"
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: "normal",
                textDecoration: hover ? "underline" : "none",
                padding: "0px 0px 3px 0px",
                margin: "0px 0px 0px 0px",
                lineHeight: 1.2,
                color: "rgba(0, 0, 0, .90)"
              }}
            >
              {entities.decode(article.title)}
            </h3>
          </div>
          {article.description.length > 0 ? (
            <div
              style={{
                display: "flex"
              }}
            >
              <div
                className={"desc"}
                style={{
                  fontSize: 14,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  color: "rgba(0, 0, 0, .60)",
                  lineHeight: 1.4,
                  letterSpacing: "0.01em"
                }}
              >
                {entities.decode(article.description)}
              </div>
            </div>
          ) : null}
          {hideSource ? null : (
            <div
              className={"source"}
              style={{
                textAlign: "right",
                fontSize: 12,
                marginTop: 10
              }}
            >
              {article.site.title}
            </div>
          )}
        </div>
      </a>
    );
  }
}
