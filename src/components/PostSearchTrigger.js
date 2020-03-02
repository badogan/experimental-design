import React from 'react'

export default class PostSearchTrigger extends React.Component{
    render(){
        return(
            <React.Fragment>
                <button onClick={()=>this.props.updateConstructedURL()} className="button-postsearch-trigger">Ready! Click here for places details, to share with WhatsApp, and links to Google Maps and CityMapper</button>
            </React.Fragment>
        )
    }
}