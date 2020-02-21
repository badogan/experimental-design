import React from 'react'
import API from '../API'

export default class PostSearchPage extends React.Component {

    state = {
        duration: null,
        postcode: null,
        places: null
    }

    componentDidMount() {
        this.presentPlacesAndFurtherOptions()
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
                            place.longitude = object.result.longitude
                            place.latitude = object.result.latitude
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
                <h1>I am here</h1>
            </React.Fragment>
        )
    }

}
