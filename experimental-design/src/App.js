import React from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
import API from './API'
import Helper from './Helper'
import PreSearchPage from './pages/PreSearchPage'
import SearchingPage from './pages/SearchingPage'
import PostSearchPage from './pages/PostSearchPage'

class App extends React.Component {

  state = {
    // presearchEnteredPostcodes: [],
    presearchEnteredPostcodes: ['EC2A1NT'],
    presearchPlaceType: 'Pub',
    presearchRadioCar: true,
    searchingInitiated: false,
    searchingOriginsArray: [],
    searchingMidPointLongLat: null,
    searchingMidPointPostcode: null, //Populate after search process completed only if available
    searchingDurations: [],
    searchingItemsToPresent: []
  }
  // RANDOM POSTCODE
  componentDidMount() {
    true && this.populateWithSomeRandomPostcode()
  }
  populateWithSomeRandomPostcode = () => this.getRandomPostcode().then(this.success, this.failure)
  success = (randompostcode) => {
      this.setState({
        presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes, randompostcode.toUpperCase().replace(' ','')]
      })
  }
  failure = () => null
  getRandomPostcode = () => API.getARandomPostcode()
  //RANDOM POSTCODE FUNCTIONALITY

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
  updateItemsToPresent = (searchingItemsToPresent) => {
    this.setState({ searchingItemsToPresent: [...this.state.searchingItemsToPresent, ...searchingItemsToPresent] })
  }
  updateConstructedURL = () => {
    let url = '/results?'
    const averageDuration = this.state.searchingDurations.reduce((sum, num) => sum + num, 0) / this.state.searchingDurations.length
    url += `duration=${averageDuration}:`
    url += `postcode=${this.state.searchingMidPointPostcode}:`
    url += `places=${this.state.searchingItemsToPresent.join(',')}`
    this.props.history.push(url)
  }
  //// END: Searching Related

  //// START: preSearch Related
  addPostcode = (postcode) => {
    this.setState({ presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes, postcode.toUpperCase().replace(' ','')] });
  }
  deletePostcode = (postcode) => this.setState({ presearchEnteredPostcodes: [...this.state.presearchEnteredPostcodes].filter(object => object !== postcode) })
  handlePlaceTypeSelection = (selection) => this.setState({ presearchPlaceType: selection })
  handleRadioSelection = () => this.setState({ presearchRadioCar: !this.state.presearchRadioCar })
  //// END: preSearch Related

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <div className="header wrapper">
            <div className="logo">
              <h5>M</h5>
            </div>
            <div className="name-of-app">
              <br/>
              <h1>Meet In The Middle</h1>
            </div>
          </div>
          <div className="presearch-container wrapper">
            <Route exact path="/" render={routerProps => {
              // console.log('presearch hitting /',routerprops)
              return <PreSearchPage
                content={Helper.contentForEncouragingText()} //EncouragingText
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
              // console.log('searching hitting /search',routerprops)
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
                searchingItemsToPresent={this.state.searchingItemsToPresent}
                searchingMidPointPostcode={this.state.searchingMidPointPostcode}

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
      </React.Fragment>
    );
  }

}

export default withRouter(App);