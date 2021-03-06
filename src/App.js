import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "./App.css";
import API from "./API";
import Helper from "./Helper";
import PreSearchPage from "./pages/PreSearchPage";
import SearchingPage from "./pages/SearchingPage";
import PostSearchPage from "./pages/PostSearchPage";
import NotAvailablePage from "./pages/NotAvailablePage";

const default_state = {
  // presearchEnteredPostcodes: [],
  presearchEnteredPostcodes: [],
  presearchPlaceType: "Pub",
  presearchRadioCar: true,
  searchingInitiated: false,
  searchingOriginsArray: [],
  searchingMidPointLongLat: null,
  searchingMidPointPostcode: null, //Populate after search process completed only if available
  searchingDurations: [],
  searchingItemsToPresent: []
};

class App extends React.Component {
  state = {
    ...default_state
  };

  componentDidMount() {
    API.getConfigFromServerless().then(panic => {
      if (panic.status) {
        this.handleNotAvailable();
      }
    });
    const queryObject = Helper.presentationDetailsFromQuery(
      this.props.location.search
    );
    if (queryObject.postcodes) {
      this.setState({
        presearchEnteredPostcodes: [...queryObject.postcodes]
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.location.pathname === "/results" &&
      this.props.location.pathname === "/"
    ) {
      this.setState({
        ...default_state
      });
      const queryObject = Helper.presentationDetailsFromQuery(
        this.props.location.search
      );
      if (queryObject.postcodes) {
        this.setState({
          ...default_state,
          presearchEnteredPostcodes: [...queryObject.postcodes]
        });
      }
    }
  }

  // UNUSED! GoogleAPI related
  connectToGoogleAPIs = () => {
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_KEY}&libraries=places`;
    document.head.append(scriptTag);
  };

  // RANDOM POSTCODE
  populateWithSomeRandomPostcode = () =>
    this.getRandomPostcode().then(this.success, this.failure);
  success = randompostcode => {
    this.setState({
      presearchEnteredPostcodes: [
        ...this.state.presearchEnteredPostcodes,
        randompostcode.toUpperCase().replace(" ", "")
      ]
    });
  };
  failure = () => null;
  getRandomPostcode = () => API.getARandomPostcode();
  //RANDOM POSTCODE FUNCTIONALITY

  // START: NotAvailable related
  handleNotAvailable = () => this.props.history.push("/notavailable");
  // END

  //// START: Searching Related
  initiateSearching = () => {
    this.props.history.push(
      `/search?postcodes=${this.state.presearchEnteredPostcodes.join()}`
    );
  };
  populateOriginsArray = longLatObj =>
    this.setState({
      searchingOriginsArray: [...this.state.searchingOriginsArray, longLatObj]
    });
  updateMidPointLongLat = midPointObj =>
    this.setState({ searchingMidPointLongLat: midPointObj });
  updateMidPointPostcode = postcode =>
    this.setState({ searchingMidPointPostcode: postcode });
  updateDurations = duration => {
    this.setState({
      searchingDurations: [...this.state.searchingDurations, duration]
    });
  };
  updateItemsToPresent = searchingItemsToPresent => {
    this.setState({
      searchingItemsToPresent: [
        ...this.state.searchingItemsToPresent,
        ...searchingItemsToPresent
      ]
    });
  };
  updateConstructedURL = () => {
    let url = "/results?";
    const averageDuration =
      this.state.searchingDurations.reduce((sum, num) => sum + num, 0) /
      this.state.searchingDurations.length;
    url += `duration=${averageDuration}:`;
    url += `postcode=${this.state.searchingMidPointPostcode}:`;
    url += `places=${this.state.searchingItemsToPresent.join(",")}:`;
    url += `postcodes=${this.state.presearchEnteredPostcodes.join(",")}`;
    this.props.history.push(url);
  };
  //// END: Searching Related finishes here

  //// START: preSearch Related
  addPostcode = postcode => {
    this.setState({
      presearchEnteredPostcodes: [
        ...this.state.presearchEnteredPostcodes,
        postcode.toUpperCase().replace(" ", "")
      ]
    });
  };
  deletePostcode = postcode =>
    this.setState({
      presearchEnteredPostcodes: [
        ...this.state.presearchEnteredPostcodes
      ].filter(object => object !== postcode)
    });
  handlePlaceTypeSelection = selection =>
    this.setState({ presearchPlaceType: selection });
  handleRadioSelection = () =>
    this.setState({ presearchRadioCar: !this.state.presearchRadioCar });
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
              <br />
              <h1>Meet In The Middle</h1>
            </div>
          </div>
          <div className="presearch-container wrapper">
            <Route
              exact
              path="/"
              render={routerProps => {
                // console.log('presearch hitting /',routerprops)
                return (
                  <PreSearchPage
                    content={Helper.contentForEncouragingText()} //EncouragingText
                    populateWithSomeRandomPostcode={
                      this.populateWithSomeRandomPostcode
                    }
                    presearchEnteredPostcodes={
                      this.state.presearchEnteredPostcodes
                    }
                    deletePostcode={this.deletePostcode}
                    addPostcode={this.addPostcode}
                    handleRadioSelection={this.handleRadioSelection}
                    stateOfCar={this.state.presearchRadioCar}
                    handlePlaceTypeSelection={this.handlePlaceTypeSelection}
                    initiateSearching={this.initiateSearching}
                  />
                );
              }}
            />
          </div>

          <div className="searching-container wrapper">
            <Route
              path="/search"
              render={routerProps => {
                // console.log('searching hitting /search',routerprops)
                return (
                  <SearchingPage
                    {...routerProps}
                    updateMidPointLongLat={this.updateMidPointLongLat}
                    updateMidPointPostcode={this.updateMidPointPostcode}
                    populateOriginsArray={this.populateOriginsArray}
                    updateDurations={this.updateDurations}
                    updateItemsToPresent={this.updateItemsToPresent}
                    updateConstructedURL={this.updateConstructedURL}
                    searchingInitiated={this.state.searchingInitiated}
                    searchingMidPointLongLat={
                      this.state.searchingMidPointLongLat
                    }
                    searchingOriginsArray={this.state.searchingOriginsArray}
                    presearchRadioCar={this.state.presearchRadioCar}
                    presearchPlaceType={this.state.presearchPlaceType}
                    searchingItemsToPresent={this.state.searchingItemsToPresent}
                    searchingMidPointPostcode={
                      this.state.searchingMidPointPostcode
                    }
                  />
                );
              }}
            />
          </div>

          <div className="postsearch-container wrapper">
            <Route
              path="/results"
              render={routerProps => {
                return <PostSearchPage {...routerProps} />;
              }}
            />
          </div>

          <div className="notavailable-container wrapper">
            <Route
              path="/notavailable"
              render={routerProps => {
                return <NotAvailablePage {...routerProps} />;
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
