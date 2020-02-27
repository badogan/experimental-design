// use this for config also. decide if I'd better move to something else later

import API from './API'

async function checkIfNull(x) {
    return true && (x === null)
}

const SearchingPageMessages = () => [
    'Calculating midpoint ...',
    'Assessing midpoint postcode ...',
    'Shortlisting places ...',
    'Generating links for WhatsApp, CityMapper, Google Maps ...'
]

const PostSearchPageMessages = () => [
    'Average Travel Time For Each Person',
    'Approximate Postcode In The Middle'
]

const decideOnTheItemsToPresent = (allItems) => {
    // console.log("allitems: ", allItems)
    let maxNumberOfResults = 3
    let targetGroup = allItems.sort((a, b) => a.user_ratings_total > b.user_ratings_total ? -1 : 1).sort((a, b) => a.rating > b.rating ? -1 : 1)
    if (targetGroup.length >= maxNumberOfResults) {
        return (targetGroup.slice(0, maxNumberOfResults))
    } else { return targetGroup }
}

const processDuration = (min) => {
    let h = Math.floor(min / 60)
    let m = Math.floor(min - h * 60)
    let message
    if (h === 0) {
        message = `${m}min`
    }
    else {
        message = `${h}h ${m}min`
    }
    return message
}

const extractAddress = (address_components) => {
    let addressComponentsToReturn = ['street_number', 'route', 'neighborhood', 'postal_town']
    let resultsObject = []
    for (const component of addressComponentsToReturn) {
        let data = address_components.find(addressComponent => addressComponent.types.includes(`${component}`)).long_name
        resultsObject = [...resultsObject, { component: data }]
        console.log("resultsObject: ", resultsObject)
    }
    return resultsObject
}

const WhatsApp = (currentState) => {
    let domainToForward = 'https://27c418c4.ngrok.io'
    let urlPrep = `whatsapp://send?text=${domainToForward}/results?`
    urlPrep += `duration=${currentState.duration}:`
    urlPrep += `postcode=${currentState.postcode}:`
    urlPrep += `places=${
        currentState.places.filter(place => place.selected).map(place => place.place_id)
        }:`
    urlPrep += `postcodes=${currentState.postcodes}`
    return urlPrep
}

const CityMapper = (props) => {
    let citymapperLinkPre = 'https://citymapper.com/directions?endcoord='
    let cityMapperLinkMid = '%2C'
    return `${citymapperLinkPre}${props.latitude}${cityMapperLinkMid}${props.longitude}`
}

const bringPlacesObjects = (placesIdsArray) => {
    if (placesIdsArray.length === 0) return []
    let default_request_limited = {
        fields: ['name', 'rating', 'user_ratings_total', 'photo', 'formatted_address', 'address_components', 'international_phone_number', 'website', 'place_id', 'url', 'geometry']
    }
    return Promise.all(placesIdsArray.map(placeId => {
        let request = default_request_limited
        request.placeId = placeId
        let service = new window.google.maps.places.PlacesService(document.querySelector('#places'))
        return new Promise((resolve) => {
            service.getDetails(request, (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    place.photosURL = []
                    //BUGFIX sometimes places.photos does not exist
                    // if (place.photos) {
                    //     for (const photo of place.photos) {
                    //         place.photosURL.push(photo.getUrl({ maxHeight: 50 }))
                    //     }
                    // }
                    place.selected = true
                    place.postcode = API.extractPostCode(place.address_components).replace(/\s+/g, '')
                    API.lookUpAPostCode(place.postcode)
                        .then(object => {
                            if (object.status === 200) {
                                place.longitude = object.result.longitude
                                place.latitude = object.result.latitude
                            } else { console.log("error in postcode io lookupApostcode. code is ", object.status) }

                            resolve(place)
                        })

                } else { console.log("Google PlacesService error (may be) code is...: ", status) }
            })
        })
    })
    )
}

const presentationDetailsFromQuery = (query) => {
    const params = new URLSearchParams(query.replace(/:/g, '&'))
    const durationInput = params.get('duration')
    const postcodeInput = params.get('postcode')
    const postcodesInput = params.get('postcodes') ? params.get('postcodes').split(',') : null
    const placesInput = params.get('places') ? params.get('places').split(',') : null
    return { duration: durationInput, postcodes: postcodesInput, postcode: postcodeInput, places: placesInput }
}

const bringNearBySearchResults = (locationObj, keywordReceived, radius = 1000) => {

    let request = {
        location: locationObj,
        radius,
        keyword: keywordReceived
    };

    return executeGoogleNearBySearch(request)
        .then(data => {
            if (data.results.length === 0) {
                console.log("extending radius from: ", radius)
                return bringNearBySearchResults(locationObj, keywordReceived, radius + 2000)
            } else {
                return data
            }
        })
}

const executeGoogleNearBySearch = (request) => {
    let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));
    return new Promise(resolve =>
        service.nearbySearch(request, (results, status) => resolve({ results, status }))
    )
}

const bringDistanceMatrix = (originsArray, destinationsArray, booleanForTravelModeForCar) => {
    return new Promise(resolve => {
        let originsGoogleMapObjects = originsArray.map(item => {
            return new window.google.maps.LatLng(item.latitude, item.longitude)
        })
        let destinationsGoogleMapObjects = destinationsArray.map(item => {
            return new window.google.maps.LatLng(item.latitude, item.longitude)
        })
        let distanceConfigObject = {
            origins: originsGoogleMapObjects,
            destinations: destinationsGoogleMapObjects,
            travelMode: booleanForTravelModeForCar ? 'DRIVING' : 'TRANSIT'
        }
        let matrixService = new window.google.maps.DistanceMatrixService()
        matrixService.getDistanceMatrix(distanceConfigObject, (response, status) => resolve({ response, status }))
    }
    )
}

const decideOnTheMidPointObject = (responsesForLongLatForOriginPostcodes, algoVersion) => {
    // console.log('responsesForLongLatForOriginPostcodes ',responsesForLongLatForOriginPostcodes)
    // Note for my future self: responsesForLongLatForOriginPostcodes includes the whole response from postcode.io. Not ideal I know :)
    if (algoVersion === 'v1') {
        let midPointLatitude = 0
        let midPointLongitude = 0
        responsesForLongLatForOriginPostcodes.forEach(response => {
            midPointLatitude = midPointLatitude + (response.result.latitude / responsesForLongLatForOriginPostcodes.length)
            midPointLongitude = midPointLongitude + (response.result.longitude / responsesForLongLatForOriginPostcodes.length)
        })
        return { latitude: midPointLatitude, longitude: midPointLongitude }
    }

    if (algoVersion === 'v2') {
        //Find the furthest from the midpoint- furthest
        let midPointLatitude = 0
        let midPointLongitude = 0
        responsesForLongLatForOriginPostcodes.forEach(response => {
            midPointLatitude = midPointLatitude + (response.result.latitude / responsesForLongLatForOriginPostcodes.length)
            midPointLongitude = midPointLongitude + (response.result.longitude / responsesForLongLatForOriginPostcodes.length)
        })
        let arrayOfAllCoordinates = []
        responsesForLongLatForOriginPostcodes.forEach(response => {
            arrayOfAllCoordinates.push({
                latitude: response.result.latitude,
                longitude: response.result.longitude,
                distanceFromMid: 0
            })
        })
        arrayOfAllCoordinates.forEach(item => {
            item.distanceFromMid = Math.sqrt(
                Math.pow((item.latitude - midPointLatitude), 2)
                + Math.pow((item.longitude - midPointLatitude), 2)
            )
        })
        //NOTE TO SELF: START FROM HERE. Midpoint calculation might be wrong!
        console.log('arrayOfAllCoordinates ', arrayOfAllCoordinates)
        console.log('midpoint: ', { latitude: midPointLatitude, longitude: midPointLongitude })
        //find each unit by simply dividing the difference in between midpoint and the furthest point (of long and then lat) to 100
        // use that u x N to find 4 more points
        //get the distance matrix
        //find the column that has the minimum difference
        // use that columns long,lat as the "midpoint"
        return { latitude: midPointLatitude, longitude: midPointLongitude }
    }
}

const spaceFillerArray = (n) => {
    let arr = [];
    for (let i = 0; i <= n; i++) {
        arr = arr.concat(i);
    };
    return arr
}
const contentForEncouragingText = () => [
    'Meet with friends!',
    'In the middle',
    'In carefully selected places',
    'Start here...'
]

export default { spaceFillerArray, contentForEncouragingText, decideOnTheMidPointObject, bringDistanceMatrix, bringNearBySearchResults, CityMapper, presentationDetailsFromQuery, bringPlacesObjects, checkIfNull, WhatsApp, extractAddress, processDuration, SearchingPageMessages, PostSearchPageMessages, decideOnTheItemsToPresent }