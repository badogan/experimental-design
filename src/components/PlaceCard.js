import React from "react";
import Helper from "../Helper";
import API from "../API";

export default class PlaceCard extends React.Component {
  handleCityMapper = () => {
    API.lookUpAPostCode(this.props.place.postcode).then(object => {
      if (object.status === 200) {
        window.open(
          Helper.CityMapper({
            longitude: object.result.longitude,
            latitude: object.result.latitude
          }),
          "_blank"
        );
      } else {
        console.log(
          "error in postcode io lookupApostcode. code is ",
          object.status
        );
      }
    });
  };

  render() {
    const {
      name,
      formatted_address,
      rating,
      user_ratings_total,
      international_phone_number,
      place_id,
      selected,
      longitude,
      latitude,
      url,
      photos
    } = this.props.place;
    return (
      <React.Fragment>
        <div className="place-card-each">
          <div className="place-card-img">
            {/* <img src={this.props.place.photosURL[0]} alt='' /> */}
            <img
              src={photos ? photos[0].getUrl({ maxHeight: 50 }) : null}
              alt="No photo. Please see below."
            />
          </div>
          <div className="place-card-name">
            <h4>{name}</h4>
          </div>
          <div className="place-card-formatted_address">
            <h5>{formatted_address}</h5>
          </div>
          <div className="place-card-rating">
            <h5>Rating: {rating}</h5>
          </div>
          <div className="place-card-user_ratings_total">
            <h5>Users Rated: {user_ratings_total} </h5>
          </div>
          <div className="place-card-international_phone_number">
            <h5>{international_phone_number}</h5>
          </div>
          <br />
          <div className="google-maps-button-div">
            {selected && (
              <button
                className="google-maps-button"
                onClick={() => window.open(url, "_blank")}
              >
                Visit this place on Google Maps
              </button>
            )}
            {/* {selected &&
                            <a href={url}>
                                Take me to Google Maps</a>
                        } */}
          </div>
          <br />
          <div className="city-mapper-button-div">
            {selected && (
              <button
                className="city-mapper-button"
                onClick={() =>
                  window.open(
                    Helper.CityMapper({
                      longitude,
                      latitude,
                      name,
                      formatted_address
                    }),
                    "_blank"
                  )
                }
              >
                Travel there with CityMapper
              </button>
            )}
          </div>
          <div className="place-card-select-checkbox">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => this.props.handleSelect(place_id)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
