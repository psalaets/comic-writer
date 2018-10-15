import React, { Component } from "react";

export default class Metadata extends Component {
  render() {
    switch (this.props.type.toLowerCase()) {
      case "title":
        return <h1 className="u-font-size--marcus">{this.props.children}</h1>;
      case "author":
      case "email":
      case "phone":
      case "url":
        return <div className="u-font-size--saya">{this.props.children}</div>;
      default:
        return null;
    }

  }
}
