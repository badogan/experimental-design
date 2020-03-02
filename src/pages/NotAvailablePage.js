import React from "react";
import Helper from '../Helper'

export default class NotAvailablePage extends React.Component {
  render() {
    return (
      <React.Fragment>
          <div className="spacefiller">
          {Helper.spaceFillerArray(10).map((k, i) => (
            <div key={i}>
              {" "}
              <br />
            </div>
          ))}
        </div>
        <h1>Service not available!</h1>
        <h1>Please try again later.</h1>
        <div className="spacefiller">
          {Helper.spaceFillerArray(40).map((k, i) => (
            <div key={i}>
              {" "}
              <br />
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
