import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: []
    };
  }

  componentDidMount() {
    //get recent posts
    axios
      .get("http://localhost:8000/records", {
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
  }

  render() {
    return (
      <div style={{ overflow: "auto", height: "100vh" }}>
        <h1>test</h1>
        {this.state.records.map((record, i) => {
          return (
            <img key={i} src={record.image.url} width="500" height="400" />
          );
        })}
      </div>
    );
  }
}
