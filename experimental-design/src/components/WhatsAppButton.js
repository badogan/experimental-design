import React from 'react'

export default class WhatsAppButton extends React.Component {
    render() {
        return (
            <React.Fragment>
                <button className="whatsapp-button" onClick={()=>this.props.handleWhatsAppClick()}>
                    WhatsApp Share Selected Places
                </button>
            </React.Fragment>
        )
    }
}