import React from 'react'

export default class KeyDataComm extends React.Component {

    render() {
        return (
            <React.Fragment>
                <h3>{this.props.message}</h3>
                {console.log("content is... ",this.props.content)}
                <h2>{this.props.content}</h2>
            </React.Fragment>
        )
    }
}