import React from 'react'

export default class SearchInitiation extends React.Component{
    render(){
        return(
            <React.Fragment>
                <button onClick={()=>this.props.initiateSearching()} className="button-magic-formatting">Magic button</button>
            </React.Fragment>
        )
    }
}