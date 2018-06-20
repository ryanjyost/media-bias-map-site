import React, { Component } from "react";

export default class Site extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const { siteMargin, imageHeight, imageWidth, record, index } = this.props;
    const { hover } = this.state;
    return (
      <a
        href={record.site.url}
        target={"_blank"}
        key={index}
        style={{
          margin: siteMargin,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: imageHeight,
          width: imageWidth,
          backgroundColor: "#333",
          position: "relative",
          border: "1px solid #d8d8d8"
        }}
        // onMouseEnter={() => this.setState({ hover: true })}
        // onMouseLeave={() => this.setState({ hover: false })}
      >
        <div
          style={{
            height: imageHeight,
            width: imageWidth,
            backgroundImage: `url(${record.image.url})`,
            backgroundSize: "contain",
            opacity: hover ? 0.2 : 1
          }}
        />
        {hover && (
          <div
            style={{
              color: "#fafafa",
              position: "absolute",
              bottom: "5px",
              left: "5px",
              padding: "10px"
            }}
          >
            {record.site.title}
          </div>
        )}
        {/*<img*/}
        {/*src={*/}
        {/*"logo" in record*/}
        {/*? record.logo*/}
        {/*: "http://res.cloudinary.com/ryanjyost/image/upload/v1529254420/logos/cnn-logo.jpg"*/}
        {/*}*/}
        {/*style={{*/}
        {/*margin: "auto",*/}
        {/*position: "absolute",*/}
        {/*top: 0,*/}
        {/*left: 0,*/}
        {/*bottom: 0,*/}
        {/*right: 0*/}
        {/*}}*/}
        {/*height={30}*/}
        {/*/>*/}
      </a>
    );
  }
}
