import React from 'react'

export default class ShowMessage extends React.Component {
    render(){
        return(
            <React.Fragment>
                <h4>{this.props.message}</h4>
            </React.Fragment>
        )
    }
}