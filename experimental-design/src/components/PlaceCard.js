import React from 'react'
import Helper from '../Helper'
import API from '../API'

export default class PlaceCard extends React.Component {

    handleCityMapper = () => {

        API.lookUpAPostCode(this.props.place.postcode).then(object => {
                if (object.status === 200) {
                    window.open( (Helper.CityMapper({
                        longitude: object.result.longitude,
                        latitude: object.result.latitude
                    })),'_blank')
                } else { console.log("error in postcode io lookupApostcode. code is ", object.status) } 
            })
    }

    render() {
        const { name, formatted_address, rating, user_ratings_total, international_phone_number, place_id, selected, longitude, latitude, url,photos } = this.props.place
        return (
            <React.Fragment>
                <div className="place-card-each wrapper">
                    {/* <img src={this.props.place.photosURL[0]} alt='' /> */}
                    <img src={photos ? photos[0].getUrl({ maxHeight: 50 }) :null} alt='' />
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

                        {selected && <button onClick={()=>window.open(url,'_blank')}>> Google Maps</button>}
                        {/* {selected &&
                            <a href={url}>
                                Take me to Google Maps</a>
                        } */}
                    </div>
                    <br />
                    <div>
                        {selected && <button onClick={()=>window.open(Helper.CityMapper({longitude,latitude})
                            ,'_blank')}>> CityMapper</button>}
                        
                    </div>
                </div>

            </React.Fragment>
        )
    }
}