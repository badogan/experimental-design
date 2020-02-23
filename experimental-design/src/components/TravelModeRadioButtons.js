import React from 'react'

export default class TravelModeRadioButtons extends React.Component {
    render(){

        return(
            <React.Fragment>
                <div className='travel-mode-main'>
                    <div className='travel-mode-public-transport'>
                        <input type='radio' value='Public Transport' checked={!this.props.stateOfCar} onChange={this.props.handleRadioSelection}/>
                        <label>Public Transport</label>
                    </div>
                    <div className='travel-mode-car'>
                        <input type='radio' value='Car' checked={this.props.stateOfCar} onChange={this.props.handleRadioSelection}/>
                        <label>Car</label>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}