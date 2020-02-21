import React from 'react'
import API from '../API'
import ShowMessage from '../components/ShowMessage'
import Helper from '../Helper'
// import { BrowserRouter as Router, Route, Switch, useParams, Link, withRouter } from 'react-router-dom';


export default class SearchingPage extends React.Component {

    state = {
        showStep0: false,
        showStep1: false,
        showStep2: false,
        showStep3: false
    }

    init = () => {
        this.doSearchAndHandoverToPostSearch()
    }

    postcodesFromQuery = (query) => {
        const params = new URLSearchParams(query)
        const postcodeString = params.get('postcodes')
        return postcodeString.split(',')
    }

    doSearchAndHandoverToPostSearch = () => {
        this.setState({ showStep0: true })
        Promise.all(
            this.postcodesFromQuery(this.props.location.search).map(postcode => API.lookUpAPostCode(postcode))
        )
            .then((responsesForAllPostcodes) => {
                responsesForAllPostcodes.forEach(response => {
                    this.props.populateOriginsArray({ latitude: response.result.latitude, longitude: response.result.longitude })
                })
                return (responsesForAllPostcodes)
            })
            .then((responsesForAllPostcodes) => {
                let midPointLatitude = 0
                let midPointLongitude = 0
                responsesForAllPostcodes.forEach(response => {
                    midPointLatitude = midPointLatitude + (response.result.latitude / responsesForAllPostcodes.length)
                    midPointLongitude = midPointLongitude + (response.result.longitude / responsesForAllPostcodes.length)
                })
                let midPointObj = { latitude: midPointLatitude, longitude: midPointLongitude }
                this.props.updateMidPointLongLat(midPointObj)
                return (midPointObj)
            })
            .then(midPointObj => {
                this.setState({ showStep1: true })
                return API.getNearestPostCode(midPointObj)
            })
            .then(closestPostCodeObject => {
                if (closestPostCodeObject.status === 200) {
                    if (closestPostCodeObject.result !== null) {
                        this.props.updateMidPointPostcode(closestPostCodeObject.result[0].postcode.replace(/ /g, '').toUpperCase())
                    } else { console.log('no close postcode from postcode.io') }
                }
                return true
            })
            .then(() => {
                let originsGoogleMapObjects = this.props.searchingOriginsArray.map(item => {
                    return new window.google.maps.LatLng(item.latitude, item.longitude)
                })
                let destinationGoogleMapObject = new window.google.maps.LatLng(this.props.searchingMidPointLongLat.latitude, this.props.searchingMidPointLongLat.longitude)
                let distanceConfigObject = {
                    origins: originsGoogleMapObjects,
                    destinations: [destinationGoogleMapObject],
                    travelMode: this.props.presearchRadioCar ? 'DRIVING' : 'TRANSIT'
                }
                let matrixService = new window.google.maps.DistanceMatrixService()

                return new Promise((resolve) => {

                    matrixService.getDistanceMatrix(distanceConfigObject, (response, status) => {
                        if (status === 'OK') {
                            response.rows.forEach(row => {
                                this.props.updateDurations(row.elements[0].duration.value / 60)
                                resolve()
                            })
                        } else { console.log('distance api call result NOT ok') }
                    })
                })
            })
            .then(() => {
                this.setState({ showStep2: true })
                let request = {
                    location: {
                        lat: this.props.searchingMidPointLongLat.latitude,
                        lng: this.props.searchingMidPointLongLat.longitude
                    },
                    radius: 1000,
                    keyword: this.props.presearchPlaceType
                };
                let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));

                return new Promise((resolve) => {
                    service.nearbySearch(request, (results, status) => {
                        if (results.length === null) { console.log("results received from nearby search is null") }
                        if (results.length === 0) { console.log('results received from nearby search is empty') }
                        else {
                            Helper.decideOnTheItemsToPresent(results).forEach(place => {
                                this.props.updateItemsToPresent(place.place_id)
                                resolve()
                            })
                        }
                    });
                })
            })
            .then(() => {
                console.log("entering last bit...")
                this.setState({ showStep3: true })
                this.props.updateConstructedURL()
            })
        //   END: Shoukld handover to react router, update state clarifying where the link came from - searching or link router
    }

    componentDidMount() {
        this.init()
    }

    render() {
        return (
            <React.Fragment>
                <h2>Please wait ...</h2>
                <br />
                {/* {API.searchingMessages().map((message,index)=><ShowMessage key={index} message={message}/>)} */}
                {this.state.showStep0 && <ShowMessage message={Helper.SearchingPageMessages()[0]} />}
                {this.state.showStep1 && <ShowMessage message={Helper.SearchingPageMessages()[1]} />}
                {this.state.showStep2 && <ShowMessage message={Helper.SearchingPageMessages()[2]} />}
                {this.state.showStep3 && <ShowMessage message={Helper.SearchingPageMessages()[3]} />}
                {/* {this.props.constructedURL && <Link to="/about">About</Link>} */}
            </React.Fragment>
        )
    }
}