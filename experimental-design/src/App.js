import React from 'react';
import { BrowserRouter as Router, Route, Switch, useParams, Link, withRouter } from 'react-router-dom';
import './App.css';
import API from './API'
import Card from './components/Card'
// import ExtractParamsStep1 from './components/ExtractParamsStep1';
import PreSearchPage from './pages/PreSearchPage'
import SearchingPage from './pages/SearchingPage'
import PostSearchPage from './pages/PostSearchPage'

class App extends React.Component {

  state = {
    presearchEnteredPostcodes: ['W21HB', 'EC2Y9AG', 'N18XX', 'W127RZ'],
    presearchPlaceType: 'Pub',
    presearchRadioCar: false,
    searchingInitiated: false,
    searchingOriginsArray: [],
    searchingMidPointLongLat: null,
    searchingMidPointPostcode: null, //Populated after search process completed only if available
    searchingDurations: [],
    searchingItemsToPresent: [],
    searchingConstructedURL: null,
    // 
    showOrNoShow: false,
    receivedParams: null
  }
  //// START: Searching Related
  initiateSearching = () => {
    this.props.history.push(`/search?postcodes=${this.state.presearchEnteredPostcodes.join()}`)
  }
  populateOriginsArray = (longLatObj) => this.setState({
    searchingOriginsArray: [...this.state.searchingOriginsArray, longLatObj]
  })
  updateMidPointLongLat = (midPointObj) => this.setState({ searchingMidPointLongLat: midPointObj })
  updateMidPointPostcode = (postcode) => this.setState({ searchingMidPointPostcode: postcode })
  updateDurations = (duration) => this.setState({ searchingDurations: [...this.state.searchingDurations, duration] })
  updateItemsToPresent = (placeId) => {
    this.setState({ searchingItemsToPresent: [...this.state.searchingItemsToPresent, placeId] })
  }
  updateConstructedURL = () => {
    let url = '/results?'
    const averageSearchingTime = this.state.searchingDurations.reduce((tot, dur) => tot + dur, 0) / this.state.searchingDurations.length
    url += `time=${averageSearchingTime}&`
    url += `postcode=${this.state.searchingMidPointPostcode}&`
    url += `places=${this.state.searchingItemsToPresent.join(',')}`
    this.props.history.push(url)
  }
  //// END: Searching Related

  //// START: preSearch Related
  addPostcode = (postcode) => {
    if (this.state.presearchEnteredPostcodes.includes(postcode.toUpperCase())) { return { error: true, message: 'Postcode already entered' } }
    else {
      this.setState({ presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes, postcode.toUpperCase()] });
      return { error: false }
    }
  }
  deletePostcode = (postcode) => this.setState({ presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes].filter(object => object !== postcode) })
  handlePlaceTypeSelection = (selection) => this.setState({ presearchPlaceType: selection })
  handleRadioSelection = () => this.setState({ presearchRadioCar: !this.state.presearchRadioCar })
  //// END: preSearch Related

  setInitialStates = () => {
    let initialStatesArray = []
    this.decideOnThe3ToUse().map(object => {
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
    this.setState({ target3Places: initialStatesArray });
  }

  getDetailsAndUpdateStateForTarget3 = () => {
    let tempArray = []
    let default_request_limited = {
      fields: ['name', 'rating', 'user_ratings_total', 'photo', 'formatted_address', 'address_components', 'international_phone_number', 'website', 'place_id', 'url', 'geometry']
    }
    let target3PlacesSummary = [...this.state.target3Places]
    target3PlacesSummary.map(object => {
      let request = default_request_limited
      request.placeId = object.place_id
      let service = new window.google.maps.places.PlacesService(document.querySelector('#places'))
      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          place.photosURL = []
          for (const photo of place.photos) {
            place.photosURL.push(photo.getUrl({ maxHeight: 300 }))
          }
          place.postcode = API.extractPostCode(place.address_components).replace(/\s+/g, '')
          API.lookUpAPostCode(place.postcode).then(object => {
            place.longitude = object.result.longitude
            place.latitude = object.result.latitude
          })
          tempArray.push(place)
        } else { console.log(status) }
      })
    })
    this.setState({ target3Places: tempArray })
    console.log(tempArray)
  }

  render() {
    return (
      <div>
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
          <div className="header wrapper">
            <div>
              <h5>________</h5>
              <h5>________</h5>
              <h5>________</h5>
            </div>
            <div>
              <br />
              <h1>Meet Me In The Middle</h1>
            </div>
          </div>
          <div className="presearch-container wrapper">
            <Route exact path="/" render={routerProps => {
              return <PreSearchPage
                content={API.contentForEncouragingText()} //EncouragingText
                presearchEnteredPostcodes={this.state.presearchEnteredPostcodes}
                deletePostcode={this.deletePostcode}
                addPostcode={this.addPostcode}
                handleRadioSelection={this.handleRadioSelection}
                stateOfCar={this.state.presearchRadioCar}
                handlePlaceTypeSelection={this.handlePlaceTypeSelection}
                initiateSearching={this.initiateSearching}
              />
            }} />
            <div className="searching-container wrapper">
              <Route path="/search" render={routerProps => {
                return <SearchingPage
                  {...routerProps}
                  updateMidPointLongLat={this.updateMidPointLongLat}
                  updateMidPointPostcode={this.updateMidPointPostcode}
                  populateOriginsArray={this.populateOriginsArray}
                  updateDurations={this.updateDurations}
                  updateItemsToPresent={this.updateItemsToPresent}
                  updateConstructedURL={this.updateConstructedURL}
                  searchingInitiated={this.state.searchingInitiated}
                  searchingMidPointLongLat={this.state.searchingMidPointLongLat}
                  searchingOriginsArray={this.state.searchingOriginsArray}
                  presearchRadioCar={this.state.presearchRadioCar}
                  presearchPlaceType={this.state.presearchPlaceType}
                />
              }} />
            </div>
          </div>

        </div>
      </div>
    );
  }

}

export default withRouter(App);