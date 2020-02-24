// use this for config also. decide if I'd better move to something else later

import API from './API'

async function checkIfNull(x) {
    return true && (x===null)
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
    console.log("allitems: ",allItems)
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
    let addressComponentsToReturn = ['street_number','route','neighborhood','postal_town']
    let resultsObject = []
    for (const component of addressComponentsToReturn){
        let data = address_components.find(addressComponent=>addressComponent.types.includes(`${component}`)).long_name
        resultsObject = [...resultsObject,{component:data}]
        console.log("resultsObject: ",resultsObject)
    }
    return resultsObject
}

const WhatsApp = (currentState) => {
    let domainToForward = 'https://fc5a9262.ngrok.io'
    let urlPrep = `whatsapp://send?text=${domainToForward}/results?`
    urlPrep += `duration=${currentState.duration}:`
    urlPrep += `postcode=${currentState.postcode}:`
    urlPrep += `places=${
        currentState.places.filter(place=>place.selected).map(place=>place.place_id)
    }`
    return urlPrep
} 


export default { checkIfNull, WhatsApp, extractAddress, processDuration, SearchingPageMessages, PostSearchPageMessages, decideOnTheItemsToPresent }