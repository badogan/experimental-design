import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";

export default class KeyDataComm extends React.Component {
  copyCodeToClipboard = () => {
    const textField = document.createElement("textarea");
    document.querySelector('.key-data-each').appendChild(textField);
    // document.body.append(textField);
    textField.value = this.props.content;
    textField.focus();
    textField.select();
    document.execCommand("copy");
    textField.remove();
    ToastsStore.success("Copied to clipboard!");
  };

  render() {
    return (
      <React.Fragment>
        <h3>{this.props.message}</h3>
        <h2 onClick={() => this.copyCodeToClipboard()}>{this.props.content}</h2>
        <ToastsContainer store={ToastsStore} />
      </React.Fragment>
    );
  }
}
