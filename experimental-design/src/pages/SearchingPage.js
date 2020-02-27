import React from "react";
import API from "../API";
import ShowMessage from "../components/ShowMessage";
import Helper from "../Helper";
import PostSearchTrigger from "../components/PostSearchTrigger";

export default class SearchingPage extends React.Component {
  state = {
    showStep0: false,
    showStep1: false,
    showStep2: false,
    showStep3: false,
    showStep4: false,
    showStep5: false,
    triggerPostSearch: false
  };

  componentDidMount() {
    // API.postToBackend(this.props.location)
    true && this.doSearchAndHandoverToPostSearch();
  }

  postcodesFromQuery = query => {
    const params = new URLSearchParams(query);
    const postcodeString = params.get("postcodes");
    return postcodeString.split(",");
  };

  doSearchAndHandoverToPostSearch = () => {
    this.setState({ showStep0: true });
    Promise.all(
      this.postcodesFromQuery(this.props.location.search).map(postcode =>
        API.lookUpAPostCode(postcode)
      )
    )
      .then(responsesForAllPostcodes => {
        this.setState({ showStep1: true });
        responsesForAllPostcodes.forEach(response => {
          this.props.populateOriginsArray({
            latitude: response.result.latitude,
            longitude: response.result.longitude
          });
        });
        return responsesForAllPostcodes;
      })
      .then(responsesForAllPostcodes => {
        let algoVersion = "v1";
        const midPointObj = Helper.decideOnTheMidPointObject(
          responsesForAllPostcodes,
          algoVersion
        );
        return new Promise(resolve => {
          this.props.updateMidPointLongLat(midPointObj);
          resolve(midPointObj);
        });
      })
      .then(midPointObj => {
        this.setState({ showStep2: true });
        return API.getNearestPostCode(midPointObj);
      })
      .then(closestPostCodeObject => {
        if (closestPostCodeObject.status === 200) {
          if (closestPostCodeObject.result !== null) {
            this.props.updateMidPointPostcode(
              closestPostCodeObject.result[0].postcode
                .replace(/ /g, "")
                .toUpperCase()
            );
          } else {
            console.log("no close postcode from postcode.io");
          }
        }
        return true;
      })
      .then(() => {
        return Helper.bringDistanceMatrix(
          this.props.searchingOriginsArray,
          [this.props.searchingMidPointLongLat],
          this.props.presearchRadioCar
        );
      })
      .then(object => {
        console.log("distance matrix object: ", object);
        if (object.status === "OK") {
          object.response.rows.forEach(row => {
            if (row.elements[0].status !== "ZERO_RESULTS") {
              this.props.updateDurations(row.elements[0].duration.value / 60);
            } else {
              this.props.history.push("/");
            }
          });
        } else {
          console.log("distance api call result NOT ok");
        }
      })

      //CODE BELOW USED TO WORK
      //     let originsGoogleMapObjects = this.props.searchingOriginsArray.map(item => {
      //         return new window.google.maps.LatLng(item.latitude, item.longitude)
      //     })
      //     let destinationGoogleMapObject = new window.google.maps.LatLng(this.props.searchingMidPointLongLat.latitude, this.props.searchingMidPointLongLat.longitude)
      //     let distanceConfigObject = {
      //         origins: originsGoogleMapObjects,
      //         destinations: [destinationGoogleMapObject],
      //         travelMode: this.props.presearchRadioCar ? 'DRIVING' : 'TRANSIT'
      //     }
      //     let matrixService = new window.google.maps.DistanceMatrixService()

      //     return new Promise((resolve) => {

      //         matrixService.getDistanceMatrix(distanceConfigObject, (response, status) => {
      //             if (status === 'OK') {
      //                 response.rows.forEach(row => {
      //                     // console.log("the row is...", row)
      //                     if (row.elements[0].status !== 'ZERO_RESULTS') {
      //                         this.props.updateDurations(row.elements[0].duration.value / 60)
      //                     } else { this.props.history.push('/') }
      //                     resolve()
      //                 })
      //             } else { console.log('distance api call result NOT ok') }
      //         })
      //     })
      // })
      .then(() => {
        this.setState({ showStep3: true });
        let locationObj = {
          lat: this.props.searchingMidPointLongLat.latitude,
          lng: this.props.searchingMidPointLongLat.longitude
        };
        let keyword = this.props.presearchPlaceType;
        return Helper.bringNearBySearchResults(locationObj, keyword);

        //
        // this.setState({ showStep2: true })
        // let request = {
        //     location: {
        //         lat: this.props.searchingMidPointLongLat.latitude,
        //         lng: this.props.searchingMidPointLongLat.longitude
        //     },
        //     radius: 1000,
        //     keyword: this.props.presearchPlaceType
        // };

        // let service = new window.google.maps.places.PlacesService(document.querySelector('#places'));

        // return new Promise((resolve) => {
        //     service.nearbySearch(request, (results, status) => {
        //         if (results.length === null) {
        //             console.log("results received from nearby search is null. status code is: ",status)
        //             this.props.history.push('/')
        //         }
        //         if (results.length === 0) {
        //             console.log('results received from nearby search is empty. status code is: ',status)
        //             this.props.history.push('/')
        //         }
        //         else {
        //             console.log("results are...", results)
        //             Helper.decideOnTheItemsToPresent(results).forEach(place => {
        //                 this.props.updateItemsToPresent(place.place_id)
        //                 resolve()
        //             })
        //         }
        //     });
        // })
      })
      .then(object => {
        this.setState({
          showStep4: true,
          showStep5: true
        });
        const chosenPlaces = Helper.decideOnTheItemsToPresent(object.results);
        this.props.updateItemsToPresent(
          chosenPlaces.map(place => place.place_id)
        );
      })
      .then(() => {
        this.setState({ triggerPostSearch: true });
        // this.props.updateConstructedURL();
      });
  };

  render() {
    const messages = Helper.SearchingPageMessages();
    const {
      showStep0,
      showStep1,
      showStep2,
      showStep3,
      showStep4,
      showStep5,
      triggerPostSearch
    } = this.state;
    const { updateConstructedURL } = this.props;
    return (
      <React.Fragment>
        <br />
        {showStep0 && (
          <ShowMessage nextstep={showStep1} key={0} message={messages[0]} />
        )}
        {showStep1 && (
          <ShowMessage nextstep={showStep2} key={1} message={messages[1]} />
        )}
        {showStep2 && (
          <ShowMessage nextstep={showStep3} key={2} message={messages[2]} />
        )}
        {showStep3 && (
          <ShowMessage nextstep={showStep4} key={3} message={messages[3]} />
        )}
        {showStep4 && (
          <ShowMessage nextstep={showStep5} key={4} message={messages[4]} />
        )}
        {showStep5 && (
          <ShowMessage
            nextstep={triggerPostSearch}
            key={5}
            message={messages[5]}
          />
        )}
        {triggerPostSearch && (
          <PostSearchTrigger updateConstructedURL={updateConstructedURL} />
        )}
        <div className="spacefiller">
          {Helper.spaceFillerArray(40).map((k, i) => (
            <div key={i}>
              {" "}
              <br />
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

// <div className="encourage-text-div wrapper">
// {content.map((text,index)=><EncouragingText key={index} content={text} populateWithSomeRandomPostcode={populateWithSomeRandomPostcode}/>)}
// </div>

// {content.map((text,index)=><EncouragingText key={index} content={text} populateWithSomeRandomPostcode={populateWithSomeRandomPostcode}/>)}
