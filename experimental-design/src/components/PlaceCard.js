import React from 'react'

export default class PlaceCard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h4>{this.props.place.name}</h4>
            </React.Fragment>
        )
    }
}