import React from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import API from './API'
import Card from './components/Card'
import PreSearchPage from './pages/PreSearchPage'
import SearchingPage from './pages/SearchingPage'
import PostSearchPage from './pages/PostSearchPage'

class App extends React.Component {

  state = {
    // presearchEnteredPostcodes: [],
    presearchEnteredPostcodes: ['W21HB', 'EC2Y9AG', 'N18XX'],
    presearchPlaceType: 'Pub',
    presearchRadioCar: false,
    searchingInitiated: false,
    searchingOriginsArray: [],
    searchingMidPointLongLat: null,
    searchingMidPointPostcode: null, //Populate after search process completed only if available
    searchingDurations: [],
    searchingItemsToPresent: [],
    searchingConstructedURL: null
  }
// TODO: ASK TO SAM WHY THIS IS NOT WORKING
  componentDidMount() {
    true && this.populateWithSomeRandomPostcode()
  }

  populateWithSomeRandomPostcode = () => this.getRandomPostcode().then(this.success,this.failure)

  success = (randompostcode) => {
    return new Promise ((resolve)=>{
    this.setState({
      presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes, randompostcode.toUpperCase()]
    })
    resolve()
  })
  }

  failure = () => null

  getRandomPostcode = () => {
    return new Promise((resolve)=>{
      API.getARandomPostcode()
      resolve()
    })
}
//END OF TODO

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
  const averageDuration = this.state.searchingDurations.reduce((sum, num) => sum + num, 0) / this.state.searchingDurations.length
  url += `duration=${averageDuration}&`
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

render() {
  return (
    <div>
      <div className="App">
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
        </div>

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

        <div className="postsearch-container wrapper">
          <Route path="/results" render={routerProps => {
            return <PostSearchPage
              {...routerProps}
            />
          }} />

        </div>

      </div>
    </div>
  );
}

}

export default withRouter(App);