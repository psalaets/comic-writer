import React, { Component } from "react";

import './Metadata.css'

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
        return (
          <div className="c-metadata u-font-size--saya">
            <pre className="c-metadata__content">
              <b>{this.props.type}:</b> {this.props.children}
            </pre>
          </div>
        );
    }

  }
}
