import React from 'react'
import API from '../API'
import ShowMessage from '../components/ShowMessage'
import Helper from '../Helper'

export default class SearchingPage extends React.Component {

    state = {
        showStep0: false,
        showStep1: false,
        showStep2: false,
        showStep3: false
    }

    componentDidMount() {
        // API.postToBackend(this.props.location)
        true && this.doSearchAndHandoverToPostSearch()
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
                let algoVersion = 'v1'
                const midPointObj = Helper.decideOnTheMidPointObject(responsesForAllPostcodes,algoVersion)
                return new Promise(resolve =>{
                    this.props.updateMidPointLongLat(midPointObj)
                    resolve(midPointObj)
                    }
                    )
                // let midPointLatitude = 0
                // let midPointLongitude = 0
                // responsesForAllPostcodes.forEach(response => {
                //     midPointLatitude = midPointLatitude + (response.result.latitude / responsesForAllPostcodes.length)
                //     midPointLongitude = midPointLongitude + (response.result.longitude / responsesForAllPostcodes.length)
                // })
                // let midPointObj = { latitude: midPointLatitude, longitude: midPointLongitude }
                // this.props.updateMidPointLongLat(midPointObj)
                // return (midPointObj)
            })
            .then(midPointObj => {
                this.setState({ showStep1: true })
                console.log(midPointObj)
                return API.getNearestPostCode(midPointObj)
            })
            .then(closestPostCodeObject => {
                console.log('closestPostCodeObject ',closestPostCodeObject)
                if (closestPostCodeObject.status === 200) {
                    if (closestPostCodeObject.result !== null) {
                        this.props.updateMidPointPostcode(closestPostCodeObject.result[0].postcode.replace(/ /g, '').toUpperCase())
                    } else { console.log('no close postcode from postcode.io') }
                }
                return true
            })
            .then(() => {
                Helper.bringDistanceMatrix(this.props.searchingOriginsArray, [this.props.searchingMidPointLongLat], this.props.presearchRadioCar).then(object => {
                    console.log("distance matrix object: ", object)
                    if (object.status === 'OK') {
                        object.response.rows.forEach(row => {
                            // console.log("the row is...", row)
                            if (row.elements[0].status !== 'ZERO_RESULTS') {
                                this.props.updateDurations(row.elements[0].duration.value / 60)
                            } else { this.props.history.push('/') }
                        })
                    } else { console.log('distance api call result NOT ok') }
                })
            })

            //CODE BELOW USED TO WORK
            //     let originsGoogleMapObjects = this.props.searchingOriginsArray.map(item => {
            //         return new window.google.maps.LatLng(item.latitude, item.longitude)
            //     })
            //     let destinationGoogleMapObject = new window.google.maps.LatLng(this.props.searchingMidPointLongLat.latitude, this.props.searchingMidPointLongLat.longitude)
            //     let distanceConfigObject = {
            //         origins: originsGoogleMapObjects,
            //         destinations: [destinationGoogleMapObject],
            //         travelMode: this.props.presearchRadioCar ? 'DRIVING' : 'TRANSIT'
            //     }
            //     let matrixService = new window.google.maps.DistanceMatrixService()

            //     return new Promise((resolve) => {

            //         matrixService.getDistanceMatrix(distanceConfigObject, (response, status) => {
            //             if (status === 'OK') {
            //                 response.rows.forEach(row => {
            //                     // console.log("the row is...", row)
            //                     if (row.elements[0].status !== 'ZERO_RESULTS') {
            //                         this.props.updateDurations(row.elements[0].duration.value / 60)
            //                     } else { this.props.history.push('/') }
            //                     resolve()
            //                 })
            //             } else { console.log('distance api call result NOT ok') }
            //         })
            //     })
            // })
            .then(() => {

                this.setState({ showStep2: true })
                let locationObj = {
                    lat: this.props.searchingMidPointLongLat.latitude,
                    lng: this.props.searchingMidPointLongLat.longitude
                }
                let keyword = this.props.presearchPlaceType
                return Helper.bringNearBySearchResults(locationObj, keyword)
                    .then(object => {
                        // console.log(object)
                        const chosenPlaces = Helper.decideOnTheItemsToPresent(object.results)
                        this.props.updateItemsToPresent(chosenPlaces.map(place => place.place_id))

                    })
                //
                // this.setState({ showStep2: true })
                // let request = {
                //     location: {
                //         lat: this.props.searchingMidPointLongLat.latitude,
                //         lng: this.props.searchingMidPointLongLat.longitude
                //     },
                //     radius: 1000,
                //     keyword: this.props.presearchPlaceType
                // };

                // let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));

                // return new Promise((resolve) => {
                //     service.nearbySearch(request, (results, status) => {
                //         if (results.length === null) { 
                //             console.log("results received from nearby search is null. status code is: ",status) 
                //             this.props.history.push('/')
                //         }
                //         if (results.length === 0) { 
                //             console.log('results received from nearby search is empty. status code is: ',status) 
                //             this.props.history.push('/')
                //         }
                //         else {
                //             console.log("results are...", results)
                //             Helper.decideOnTheItemsToPresent(results).forEach(place => {
                //                 this.props.updateItemsToPresent(place.place_id)
                //                 resolve()
                //             })
                //         }
                //     });
                // })
            })
            .then(() => {
                this.setState({ showStep3: true })
                this.props.updateConstructedURL()
            })
    }

    render() {
        return (
            <React.Fragment>
                <h2>Please wait ...</h2>
                <br />
                {this.state.showStep0 && <ShowMessage message={Helper.SearchingPageMessages()[0]} />}
                {this.state.showStep1 && <ShowMessage message={Helper.SearchingPageMessages()[1]} />}
                {this.state.showStep2 && <ShowMessage message={Helper.SearchingPageMessages()[2]} />}
                {this.state.showStep3 && <ShowMessage message={Helper.SearchingPageMessages()[3]} />}
            </React.Fragment>
        )
    }
}