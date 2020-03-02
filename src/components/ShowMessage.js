import React from "react";

export default class ShowMessage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="searching-showmessage">
          {this.props.nextstep && <h2 className="check-for-message">&#10004;</h2>}

          <h4 className={!this.props.nextstep ? "blink_text" : ""}>
            {this.props.message}
          </h4>

        </div>
      </React.Fragment>
    );
  }
}
