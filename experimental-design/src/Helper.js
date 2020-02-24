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
    'Approximate Travel Time For Each Person',
    'Approximate Postcode In The Middle'
]

const decideOnTheItemsToPresent = (allItems) => {
    console.log("allitems: ", allItems)
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
    let domainToForward = 'https://47adaef1.ngrok.io'
    let urlPrep = `whatsapp://send?text=${domainToForward}/results?`
    urlPrep += `duration=${currentState.duration}:`
    urlPrep += `postcode=${currentState.postcode}:`
    urlPrep += `places=${
        currentState.places.filter(place => place.selected).map(place => place.place_id)
        }`
    return urlPrep
}

const CityMapper = (props) => {
    let citymapperLinkPre = 'https://citymapper.com/directions?endcoord='
    let cityMapperLinkMid = '%2C'
    return `${citymapperLinkPre}${props.latitude}${cityMapperLinkMid}${props.longitude}`
}

const bringPlacesObjects = (placesIdsArray) => {
    if (placesIdsArray.length===0) return []
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
                    if (place.photos) {
                        for (const photo of place.photos) {
                            place.photosURL.push(photo.getUrl({ maxHeight: 50 }))
                        }
                    }
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
    const placesInput = params.get('places').split(',')
    return { duration: durationInput, postcode: postcodeInput, places: placesInput }
}


export default { CityMapper, presentationDetailsFromQuery, bringPlacesObjects, checkIfNull, WhatsApp, extractAddress, processDuration, SearchingPageMessages, PostSearchPageMessages, decideOnTheItemsToPresent }