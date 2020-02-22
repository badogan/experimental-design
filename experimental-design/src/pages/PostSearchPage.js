import React from 'react'
import API from '../API'
import Helper from '../Helper'
import KeyDataComm from '../components/KeyDataComm'

export default class PostSearchPage extends React.Component {

    state = {
        duration: null,
        postcode: null,
        places: null
    }

    componentDidMount() {
        true && this.presentPlacesAndFurtherOptions()
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
        let tempArray = []
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
                        resolve()
                        console.log(place)
                        tempArray.push(place)
                    } else { console.log(status) }
                })
                return tempArray
            })
            this.setState({ places: tempArray })
        }
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className="key-data-comm-group wrapper">
                    <div className="key-data-each wrapper">
                    <KeyDataComm content={Helper.processDuration(this.state.duration)} message={Helper.PostSearchPageMessages()[0]}/>
                    </div>
                    <h3>Approximate Postcode In The Middle</h3>
                </div>
                <div className="place-cards-all wrapper">
                    <h4> Place-1  with checkbox</h4>
                    <h4> Place-2  with checkbox</h4>
                    <h4> Place-3  with checkbox</h4>
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
