import React from 'react'

export default class ExtractParams extends React.Component{
    componentDidMount(){this.props.updateReceivedParams(this.props.paramsToBeExtracted)}
    render(){return(<React.Fragment></React.Fragment>)}
}