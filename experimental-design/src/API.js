const lookUpAPostCodeURL = 'https://api.postcodes.io/postcodes/'
const getNearestPostCodeURL = 'https://api.postcodes.io/postcodes?'
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

// NOT WORKING ABOVE==============

const constructPhotoLink = (photoRef) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.REACT_APP_KEY}`
}

const extractPostCode = (address_components) => {return address_components.find(addressComponent=>addressComponent.types.includes("postal_code")).long_name}

const getPlaces = (requestObject) => getPlacesCoreCode(requestObject)
const lookUpAPostCode = (postcode) => getSimple(`${lookUpAPostCodeURL}${postcode}`)
const getNearestPostCode = (lon,lat) => getSimple(`${getNearestPostCodeURL}lon=${lon}&lat=${lat}`)

export default { getPlaces,lookUpAPostCode,getNearestPostCode,constructPhotoLink,extractPostCode }
