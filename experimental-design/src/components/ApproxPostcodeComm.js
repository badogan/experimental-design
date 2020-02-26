import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";

export default class KeyDataComm extends React.Component {

  copyCodeToClipboard = () => {
    this.textArea.select();
    document.execCommand("copy");
    ToastsStore.success("Copied to clipboard!");
  };

  render() {
    return (
      <React.Fragment>
        <h3>{this.props.message}</h3>
        <h2 onClick={() => this.copyCodeToClipboard()}>
          {this.props.content}
        </h2>
        <textarea onClick={() => this.copyCodeToClipboard()}
          className="textarea-to-be-hidden"
          ref={textarea => (this.textArea = textarea)}
          value={this.props.content}
        />
        <ToastsContainer store={ToastsStore} />
      </React.Fragment>
    );
  }
}
