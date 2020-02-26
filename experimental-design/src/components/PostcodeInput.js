import React from 'react'
import API from '../API'

export default class PostCodeInput extends React.Component {

    state = {
        postcodeEntered: null,
        postcodeValidated: false,
        userComm: 'enter postcode...'
    }

    updateEntry = (event) => this.setState({ postcodeEntered: event.target.value })

    handlePostcode = (event) => {
        event.preventDefault()
        event.target.reset();

        if (this.state.postcodeEntered !== null) {

            if (this.props.presearchEnteredPostcodes.includes(this.state.postcodeEntered.toUpperCase())) {
                this.setState({ userComm: 'Already entered!' })
            }
            else {
                API.validatePostCode(this.state.postcodeEntered)
                    .then(data => {
                        console.log("postcode validation result: ", data)
                        if (data.result === true) {
                            this.props.addPostcode(this.state.postcodeEntered)
                            this.setState({ userComm: 'enter postcode...' })
                            this.setState({ postcodeEntered: null })
                        }
                        else {
                            this.setState({
                                postcodeValidated: false,
                                userComm: 'entry invalid!'
                            })
                        }
                    })
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <form className="form22" onSubmit={this.handlePostcode}>
                    <input className='postcode-text-input-field' onChange={this.updateEntry} type="text" placeholder={this.state.userComm}></input>
                    <button className='postcode-add-button'>{this.props.presearchEnteredPostcodes.length > 1 ? 'Add' : 'Add'}</button>
                </form>
            </React.Fragment>
        )
    }
}