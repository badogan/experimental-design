import React from 'react'
import Helper from '../Helper'
import API from '../API'

export default class PlaceCard extends React.Component {

    handleCityMapper = () => {
        return API.lookUpAPostCode(this.props.place.postcode)
            .then(object => {
                let longitudeFound
                let latitudeFound
                if (object.status === 200) {
                    longitudeFound = object.result.longitude
                    latitudeFound = object.result.latitude
                    return window.open((Helper.CityMapper({
                        longitude: longitudeFound,
                        latitude: latitudeFound
                    })), '_blank')
                } else { console.log("error in postcode io lookupApostcode. code is ", object.status) } 
            })
    }

    render() {
        const { name, formatted_address, rating, user_ratings_total, international_phone_number, place_id, selected, url } = this.props.place
        return (
            <React.Fragment>
                <div className="place-card-each wrapper">
                    <img src={this.props.place.photosURL[0]} alt='' />
                    <h4>{name}</h4>
                    <h5>{formatted_address}</h5>
                    <h5>Rating: {rating}</h5>
                    <h5>Number of Users Rated: {user_ratings_total}  </h5>
                    <h5>{international_phone_number}</h5>
                    <div >
                        <input type="checkbox" checked={selected} onChange={() => this.props.handleSelect(place_id)} />
                    </div>
                    <br />
                    <div>
                        {selected &&
                            <a href={url}>
                                Take me to Google Maps</a>
                        }
                    </div>
                    <br />
                    <div>
                        {selected && <button onClick={()=>this.handleCityMapper()}>CityMapper</button>}
                    </div>
                </div>

            </React.Fragment>
        )
    }
}