import React from 'react'

export default class SearchInitiation extends React.Component{
    render(){
        return(
            <React.Fragment>
                <button onClick={()=>this.props.initiateSearching()} className="button-magic-formatting">Search. Browse. Share. Meet.</button>
            </React.Fragment>
        )
    }
}