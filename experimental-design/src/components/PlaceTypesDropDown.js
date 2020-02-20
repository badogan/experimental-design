import React from 'react'

export default class PlaceTypesDropDown extends React.Component {
    render(){
        return(
            <React.Fragment>
                <form>
                <select onChange={(e)=>this.props.handlePlaceTypeSelection(e.target.value)}>
                    <option value="Pub">Pub</option>
                    <option value="Restaurant">Restaurant</option>
                </select>
                </form>
            </React.Fragment>
        )
    }
}