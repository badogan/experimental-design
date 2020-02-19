import React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link } from 'react-router-dom';
import './App.css';
import API from './API'
import Card from './components/Card'
import ExtractParamsStep1 from './components/ExtractParamsStep1';
import PreSearchPage from './pages/PreSearchPage'
import SearchingPage from './pages/SearchingPage'

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
  let P6 = `&key=${process.env.REACT_APP_KEY}`
  let P7 = '&sensor=false'

  let url = P1 + P2 + P3 + P5 + P6 + P7

class App extends React.Component {

  state = {
    presearchEnteredPostcodes: [],
    presearchPlaceType: 'Pub',
    presearchRadioCar: true,
    seachingInitiated: false,
    // 
    placesSampleData: [],
    lookUpAPostCodeData: {},
    getNearestPostCodeData: {},
    getDistanceMatrixData: {},
    showOrNoShow: false,
    target3Places: [],
    showCards: false,
    receivedParams: null,
  }

  initiateSearching = () => this.setState({seachingInitiated:true})

  addPostcode = (postcode) => {
    if (this.state.presearchEnteredPostcodes.includes(postcode.toUpperCase())) {return {error: true, message: 'Postcode already entered'}}
    else {
    this.setState({presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes, postcode.toUpperCase()]});
    return {error:false}
    }
  }

  deletePostcode = (postcode) => this.setState({presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes].filter(object=>object!==postcode)})

  handlePlaceTypeSelection = (selection) => this.setState({presearchPlaceType:selection})

  handleRadioSelection = () => this.setState({presearchRadioCar: !this.state.presearchRadioCar})

  componentDidMount(){
    this.state.showOrNoShow && this.testcode()
  }

  decideOnThe3ToUse = () => {
    // TODO: How to decide which 3 to use?
    return this.state.placesSampleData.slice(0,3)
  }

  setInitialStates = () => {
    let initialStatesArray = []
    this.decideOnThe3ToUse().map(object=>{
      let currentObject = {
        place_id: object.place_id,
        name: object.name,
        rating: object.rating,
        user_ratings_total: object.user_ratings_total,
        photo: null,
        formatted_address: null,
        // 
        address_component: null,
        international_phone_number: null,
        website: null,
        url: null,
        //
        postcode: null,
        longitude: null,
        latitude: null
      };
      initialStatesArray.push(currentObject)
      });
      this.setState({target3Places: initialStatesArray});
  }

  getDetailsAndUpdateStateForTarget3 = () => {
    let tempArray = []
    let default_request_limited = {
      fields: ['name', 'rating','user_ratings_total', 'photo','formatted_address','address_components','international_phone_number','website','place_id','url','geometry']
    }
    let target3PlacesSummary = [...this.state.target3Places]
    target3PlacesSummary.map(object=>{
      let request = default_request_limited
      request.placeId = object.place_id
      let service = new window.google.maps.places.PlacesService(document.querySelector('#places'))
      service.getDetails(request,(place,status)=>{
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        place.photosURL = []
        for (const photo of place.photos) {
          place.photosURL.push(photo.getUrl({maxHeight:300}))
        }
        place.postcode = API.extractPostCode(place.address_components).replace(/\s+/g, '')
        API.lookUpAPostCode(place.postcode).then(object=>{
              place.longitude = object.result.longitude
              place.latitude = object.result.latitude
            })
        tempArray.push(place)
      } else {console.log(status)}
    })
    })
    // this.setState({target3Places: null})
    // // Whaat!
    this.setState({target3Places:tempArray})
    console.log(tempArray)
  }

  buildCards = () => this.setState({showCards:true})

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
    
    let request = {
      location: {
        lat: RG109NY_latitude,
        lng: RG109NY_longitude
      },
      radius: 1500,
      keyword: 'pub'
    };
    let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({placesSampleData:results})
    //     // SAMPLE LOGIC: window.history.pushState(null, '', `/options/${results[0].place_id}/${results[1].place_id}/${results[2].place_id}`)
        } 
      });
      
      // PLACES FINISHES HERE ++++++++++++++++++++++++
      // DISTANCE MATRIX STARTS HERE
      // let origin1 = new window.google.maps.LatLng(RG109NY_latitude,RG109NY_longitude)
      // let origin2 = new window.google.maps.LatLng(SW40NH_latitude,SW40NH_longitude)
      // let destinationA = new window.google.maps.LatLng(mid_latitude,mid_longtitude)
      // // let TransitOptions = {

      // // }
      // let distanceConfigObject = {
      //   origins: [origin1, origin2],
      //   destinations: [destinationA, origin1],
      //   travelMode: 'TRANSIT'
      //   // transitOptions: TransitOptions,
      //   // drivingOptions: DrivingOptions,
      //   // unitSystem: UnitSystem,
      //   // avoidHighways: Boolean,
      //   // avoidTolls: Boolean,
      //   }
      // let matrixService = new window.google.maps.DistanceMatrixService()
      // matrixService.getDistanceMatrix(distanceConfigObject, (response,status)=>{
      //   if (status=== 'OK') { this.setState({getDistanceMatrixData:response}) }
      // })
      
      // DISTANCE MATRIX FINISHES HERE
  API.lookUpAPostCode('RG109NY').then(data=>this.setState({lookUpAPostCodeData:data.result}))
  API.getNearestPostCode(RG109NY_longitude,RG109NY_latitude).then(data=>this.setState({getNearestPostCodeData:data.result}))
  }

  updateReceivedParams = (receivedParams) => this.setState({receivedParams})

  render(){
    return (
      <Router>
      <div className="App">
            {/* BELOW WAS TEST CODE */}
            {/* <button onClick={()=>this.setInitialStates()}>Decide on the 3 and get initial states for the 3 targeted items</button>
            <br/><br/>
            <button onClick={()=>this.getDetailsAndUpdateStateForTarget3()}>Get the details of the 3 </button>
            <br/><br/>
            <button onClick={()=>this.buildCards()}> Show the photo or photoS!</button>
            {this.state.showCards && this.state.target3Places.map(object=><Card key={object.place_id} place={object}/>)}
            <br/><br/>
            {this.state.receivedParams && <h4>Received Params - To be regexed: {this.state.receivedParams}</h4>} */}
            {/* ABOVE WAS TEST CODE */}
          <div className="header">
            <h4>burger menu OR logo</h4>
            <h4>Meet In The Middle</h4>
          </div>
          <div className="presearch-container wrapper">
            {!this.state.seachingInitiated && <PreSearchPage 
              content={API.contentForEncouragingText()} //EncouragingText
              presearchEnteredPostcodes={this.state.presearchEnteredPostcodes}
              deletePostcode={this.deletePostcode}
              addPostcode={this.addPostcode}
              handleRadioSelection={this.handleRadioSelection}
              stateOfCar={this.state.presearchRadioCar}
              handlePlaceTypeSelection={this.handlePlaceTypeSelection}
              initiateSearching={this.initiateSearching}
            />}
            <div className="searching-container wrapper">
              {this.state.seachingInitiated && <SearchingPage/>}
            </div>
          </div>

      </div>
      <Switch>
        <Route path="/:id" children={<ExtractParamsStep1 updateReceivedParams={this.updateReceivedParams}/>} />
      </Switch>
      </Router>
    );
    }

  }

export default App;