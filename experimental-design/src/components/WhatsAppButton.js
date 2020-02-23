import React from 'react'

export default class WhatsAppButton extends React.Component {
    render() {
        return (
            <React.Fragment>
                <button onClick={()=>this.props.handleWhatsAppClick()}>
                    WhatsApp Share
                </button>
            </React.Fragment>
        )
    }
}