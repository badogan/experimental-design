const lookUpAPostCodeURL = 'https://api.postcodes.io/postcodes/'
const getNearestPostCodeURL = 'https://api.postcodes.io/postcodes?'
// ===============
const getWithAuth = (url) => fetch(url,{
  headers: {
    'mode':'no-cors'
    // 'Access-Control-Allow-Origin': '*'
    }
  }).then(resp => resp.json())

const getSimple = (url) => fetch(url).then(resp => resp.json())
// ================

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

// ==============
const getPlaces = (requestObject) => getPlacesCoreCode(requestObject)
const lookUpAPostCode = (postcode) => getSimple(`${lookUpAPostCodeURL}${postcode}`)
const getNearestPostCode = (lon,lat) => getSimple(`${getNearestPostCodeURL}lon=${lon}&lat=${lat}`)

export default { getPlaces,lookUpAPostCode,getNearestPostCode }
