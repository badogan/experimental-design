import React from 'react'
import API from '../API'

export default class PostCodeInput extends React.Component {

    state ={
        postcodeEntered: null,
        postcodeValidated: false,
        userComm: 'enter postcode...'
    }

    updateEntry = (event) => this.setState({postcodeEntered:event.target.value})

    handlePostcode = (event) => {
        event.preventDefault()
        event.target.reset();
        // Check if the postcode is valid

        if (this.props.presearchEnteredPostcodes.includes(this.state.postcodeEntered.toUpperCase())) 
            {
                this.setState({userComm:'Already entered!'})
            }
        else 
            {
                API.validatePostCode(this.state.postcodeEntered)
                .then(data=>{
                    console.log("postcode validation result: ", data)
                    if (data.result === true) {this.setState({postcodeValidated: true})}
                    else {
                        this.setState({
                            postcodeValidated: false,
                            userComm: 'entry invalid!'
                        })
                    }
                })
                .then(()=>this.state.postcodeValidated && this.props.addPostcode(this.state.postcodeEntered))
                .then(data=>{if (data.error) {this.setState({userComm:data.message})}})
            }
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit={this.handlePostcode}>
                    <input onChange={this.updateEntry} type="text" placeholder={this.state.userComm}></input>
                    <button className="postcode-add-button">{this.props.presearchEnteredPostcodes.length>1 ? 'Add more postcode' : 'Add postcode'}</button>
                </form>
            </React.Fragment>
        )
    }
}