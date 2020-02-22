import React from 'react'
import API from '../API'
import Helper from '../Helper'
import KeyDataComm from '../components/KeyDataComm'
import PlaceCard from '../components/PlaceCard'

export default class PostSearchPage extends React.Component {

    state = {
        duration: null,
        postcode: null,
        places: []
    }

    componentDidMount() {
        true && this.putAllTogether()
    }

    putAllTogether = () => {
        return new Promise ((resolve)=>{
            this.presentPlacesAndFurtherOptions()
            resolve()
        })
    }

    presentationDetailsFromQuery = (query) => {
        const params = new URLSearchParams(query)
        const durationInput = params.get('duration')
        const postcodeInput = params.get('postcode')
        const placesInput = params.get('places').split(',')
        return { duration: durationInput, postcode: postcodeInput, places: placesInput }
    }

    presentPlacesAndFurtherOptions = () => {
        this.setState({
            duration: this.presentationDetailsFromQuery(this.props.location.search).duration,
            postcode: this.presentationDetailsFromQuery(this.props.location.search).postcode
        })
        let default_request_limited = {
            fields: ['name', 'rating', 'user_ratings_total', 'photo', 'formatted_address', 'address_components', 'international_phone_number', 'website', 'place_id', 'url', 'geometry']
        }
        return new Promise((resolve) => {
            this.presentationDetailsFromQuery(this.props.location.search).places.map(placeId => {
                let request = default_request_limited
                request.placeId = placeId
                let service = new window.google.maps.places.PlacesService(document.querySelector('#places'))
                service.getDetails(request, (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        place.photosURL = []
                        for (const photo of place.photos) {
                            place.photosURL.push(photo.getUrl({ maxHeight: 300 }))
                        }
                        place.postcode = API.extractPostCode(place.address_components).replace(/\s+/g, '')
                        API.lookUpAPostCode(place.postcode).then(object => {
                            if (object.status === 200) {
                                place.longitude = object.result.longitude
                                place.latitude = object.result.latitude
                            } else { console.log("error in postcode io lookupApostcode. code is ", object.status) }
                        })
                        this.setState({ 
                            places: [...this.state.places,place]
                         })
                        resolve()
                        // console.log(place)
                    } else { console.log("Google PlacesService error (may be) code is...: ",status) }
                })
            })
        }
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className="key-data-comm-group wrapper">
                    <div className="key-data-each wrapper">
                        <KeyDataComm content={Helper.processDuration(this.state.duration)} message={Helper.PostSearchPageMessages()[0]} />
                    </div>
                    <div className="key-data-each wrapper">
                        <KeyDataComm content={this.state.postcode} message={Helper.PostSearchPageMessages()[1]} />
                    </div>
                </div>
                <div className="place-cards-all wrapper">
                    {this.state.places.length!==0 ? this.state.places.map(place => <PlaceCard key={place.place_id} place={place} />) :null}
                </div>
                <div className="PostSearch-Buttons">
                    <button className="whatsapp-button">WhatsApp Share</button>
                    <button className="google-maps-button">Get me there with Google Maps</button>
                    <button className="city-mapper-button">Get me there with City Mapper</button>
                </div>
            </React.Fragment>
        )
    }

}
