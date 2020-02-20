import React from 'react'
import API from '../API'
import ShowMessage from '../components/ShowMessage'

export default class SearchingPage extends React.Component {

    componentDidMount(){
        this.props.findTheMiddlePoint()
    }

    render(){
        return(
            <React.Fragment>
                <h2>Please wait ...</h2>
                <br/>
                {API.searchingMessages().map((message,index)=><ShowMessage key={index} message={message}/>)}
            </React.Fragment>
        )
    }
}