const lookUpAPostCodeURL = 'https://api.postcodes.io/postcodes/'
const getNearestPostCodeURL = 'https://api.postcodes.io/postcodes?'
const validatePostCodeURL_P1 = 'https://api.postcodes.io/postcodes/'
const randomPostCodeURL = 'https://api.postcodes.io/random/postcodes'
// ===============


const getSimple = (url) => fetch(url).then(resp => resp.json())
// NOT WORKING BELOW ================

const getPlacesCoreCode = (requestObject) => {
  var service = new window.google.maps.places.PlacesService(document.querySelector('#places'));

  service.nearbySearch(requestObject, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      // this.setState({placesSampleData:results})
      return results
      // window.history.pushState(null, '', `/options/${results[0].place_id}/${results[1].place_id}/${results[2].place_id}`)
    }
  });
}

const postToBackend = (thisProps) => {
  let url = 'http://localhost:3000/history'
  let dataObject = {
    history: {
      search: thisProps.search,
      path: thisProps.pathname
    }
  }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataObject)
  }).then(resp => resp.json())
}
// NOT WORKING ABOVE==============

const constructPhotoLink = (photoRef) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.REACT_APP_KEY}`
}

const extractPostCode = (address_components) => { return address_components.find(addressComponent => addressComponent.types.includes("postal_code")).long_name }

const getPlaces = (requestObject) => getPlacesCoreCode(requestObject)
const lookUpAPostCode = (postcode) => getSimple(`${lookUpAPostCodeURL}${postcode}`)

const getNearestPostCode = (object) => getSimple(`${getNearestPostCodeURL}lon=${object.longitude}&lat=${object.latitude}&radius=500`)
const validatePostCode = (postcode) => getSimple(`${validatePostCodeURL_P1}${postcode}/validate`)
const getARandomPostcode = () => getSimple(randomPostCodeURL).then(data => data.result.postcode)
// FUNCTIONAL - NOT SURE IF THEY NEED TO BE HERE OR IN SOME OTHER API-LIKE STRUCTURE

const searchingMessages = () => [
  'Calculating midpoint ...',
  'Assessing midpoint postcode ...',
  'Shortlisting places ...',
  'Generating links for WhatsApp, CityMapper, Google Maps ...'
]
// FUNCTIONAL APIs ABOVE

export default { postToBackend, getPlaces, lookUpAPostCode, getNearestPostCode, constructPhotoLink, extractPostCode, validatePostCode, searchingMessages, getARandomPostcode }
