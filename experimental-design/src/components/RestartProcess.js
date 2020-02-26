import React from 'react'
import { Link } from 'react-router-dom'

export default class RestartProcess extends React.Component {
    render(){
        return(
            <React.Fragment>
                <Link to={this.props.path}>Restart</Link>
            </React.Fragment>
        )
    }
}