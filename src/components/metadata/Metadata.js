import React, { Component } from "react";

import './Metadata.css'

export default class Metadata extends Component {
  render() {
    switch (this.props.name.toLowerCase()) {
      case "title":
        return <h1 className="u-font-size--marcus">{this.props.value}</h1>;
      case "author":
      case "email":
      case "phone":
      case "url":
        return <div className="u-font-size--saya">{this.props.value}</div>;
      default:
        return (
          <div className="c-metadata u-font-size--saya">
            <pre className="c-metadata__content">
              <b>{this.props.name}:</b> {this.props.value}
            </pre>
          </div>
        );
    }

  }
}
