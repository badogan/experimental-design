import React from 'react';
import './App.css';
import API from './API'

  // Long lat for RG109NY
  const RG109NY_longitude = -0.867849
  const RG109NY_latitude = 51.478166
  const SW40NH_longitude = -0.146135
  const SW40NH_latitude = 51.464211
  let mid_longtitude = 0.5 * (RG109NY_longitude + SW40NH_longitude)
  let mid_latitude = 0.5 * (RG109NY_latitude + SW40NH_latitude)

  let P1 = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
  let P2 = `location=${RG109NY_latitude},${RG109NY_longitude}`
  let P3 = '&radius=1500'
  // let P4 = '&type=restaurant'
  let P5 = '&keyword=pub'
  let P6 = '&key=AIzaSyC_8LatciKA_MNCsHGgw97Cupja3kctAXA'
  let P7 = '&sensor=false'

  let url = P1 + P2 + P3 + P5 + P6 + P7

class App extends React.Component {

  state = {
    placesSampleData: [],
    lookUpAPostCodeData: {},
    getNearestPostCodeData: {},
    getDistanceMatrixData: {},
    showOrNoShow: false
  }

  // testDistanceMatrix = () =>{
  //   let postCode1 = 'RG109NY'
  //   let postCode2 = 'SW40NH'
  //   API.lookUpAPostCode(postCode1).then(data=>data[0].)
  // }


  componentDidMount(){
    this.state.showOrNoShow && this.testcode()
  }

  testcode = () => {

    // Route path="/options/:place_id1/:place_id2/:place_id3"
    // /options
    // this.props.match.params = { 
      // place_id1: ChIJOWxD186FdkgRSAu6GAKkmcY,
      // place_id2: ChIJOWxD186FdkgRSAu6GAKkmcY,
      // place_id3: ChIJOWxD186FdkgRSAu6GAKkmcY,
    // }

    // service.getPlaceById(place_id1)
    // service.getPlaceById(place_id2)
    // service.getPlaceById(place_id3)

    // setState places
    
    // NOW - console.log('Places API related: ',url)
    // API.getPlaces(url).then(placesSampleData=>{
    //   console.log(placesSampleData)
    //   this.setState({placesSampleData})
    // })
    // PLACES STARTS HERE ++++++++++++++++++++++++
    // let request = {
    //   location: {
    //     lat: RG109NY_latitude,
    //     lng: RG109NY_longitude
    //   },
    //   radius: 1500,
    //   keyword: 'pub'
    // };
  
    // let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));
    
    // service.nearbySearch(request, (results, status) => {
    //   if (status === window.google.maps.places.PlacesServiceStatus.OK) {
    //     this.setState({placesSampleData:results})
    // //     // SAMPLE LOGIC: window.history.pushState(null, '', `/options/${results[0].place_id}/${results[1].place_id}/${results[2].place_id}`)
    //     } 
    //   });
      // PLACES FINISHES HERE ++++++++++++++++++++++++
      // DISTANCE MATRIX STARTS HERE
      let origin1 = new window.google.maps.LatLng(RG109NY_latitude,RG109NY_longitude)
      let origin2 = new window.google.maps.LatLng(SW40NH_latitude,SW40NH_longitude)
      let destinationA = new window.google.maps.LatLng(mid_latitude,mid_longtitude)
      // let TransitOptions = {

      // }
      let distanceConfigObject = {
        origins: [origin1, origin2],
        destinations: [destinationA, origin1],
        travelMode: 'TRANSIT'
        // transitOptions: TransitOptions,
        // drivingOptions: DrivingOptions,
        // unitSystem: UnitSystem,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean,
        }
      let matrixService = new window.google.maps.DistanceMatrixService()
      matrixService.getDistanceMatrix(distanceConfigObject, (response,status)=>{
        if (status=== 'OK') { this.setState({getDistanceMatrixData:response}) }
      })
      
      // DISTANCE MATRIX FINISHES HERE
  // API.getPlaces(request).then(results=>this.setState({placesSampleData:results}))
  // API.lookUpAPostCode('RG109NY').then(data=>this.setState({lookUpAPostCodeData:data.result}))
  // API.getNearestPostCode(RG109NY_longitude,RG109NY_latitude).then(data=>this.setState({getNearestPostCodeData:data.result}))
  }


  render(){
    return (
      <div className="App">

      </div>
    );
    }
}

export default App;