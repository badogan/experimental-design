import React from 'react'
import Helper from '../Helper'
import KeyDataComm from '../components/KeyDataComm'
import ApproxPostcodeComm from '../components/ApproxPostcodeComm'
import PlaceCard from '../components/PlaceCard'
import WhatsAppButton from '../components/WhatsAppButton'

export default class PostSearchPage extends React.Component {

    state = {
        duration: null,
        places: []
    }

    handleWhatsAppClick = () => {
        window.open((Helper.WhatsApp(this.state)), '_blank')
    }

    handleSelect = (idOfPlaceToUpdate) => {
        return new Promise((resolve) => {
            let copyOfCurrentStateForPlaces = [...this.state.places]
            let targetObject = copyOfCurrentStateForPlaces.find(place => place.place_id === idOfPlaceToUpdate)
            let targetIndex = this.state.places.indexOf(targetObject)
            targetObject.selected = !targetObject.selected
            copyOfCurrentStateForPlaces[targetIndex] = targetObject
            this.setState({
                places: copyOfCurrentStateForPlaces
            })
            resolve()
        }
        )
    }

    componentDidMount() {
        true && this.presentPlacesAndFurtherOptions().then(() => {
            if (Helper.presentationDetailsFromQuery(this.props.location.search).postcode.toString() === 'null') {
                this.setState({ postcode: this.state.places[0].postcode })
            } else {
                this.setState({
                    postcode: Helper.presentationDetailsFromQuery(this.props.location.search).postcode
                })
            }
        })
    }

    presentPlacesAndFurtherOptions = () => {
        const details = Helper.presentationDetailsFromQuery(this.props.location.search)
        
        this.setState({
            duration: details.duration,
            postcode: details.postcode
        })
        return Helper.bringPlacesObjects(details.places)
            .then((places) => {
                this.setState({
                    places: [...places]
                })
            })
    }

    render() {

        return (
            <React.Fragment>
                <div className="key-data-comm-group wrapper">
                    <div className="key-data-each wrapper">
                        <KeyDataComm content={Helper.processDuration(this.state.duration)} message={Helper.PostSearchPageMessages()[0]} />
                    </div>
                    <div className="key-data-each wrapper">
                        { <ApproxPostcodeComm
                            content={this.state.postcode} message={Helper.PostSearchPageMessages()[1]} />}
                    </div>
                </div>
                <div className="place-cards-all wrapper">
                    {this.state.places.length !== 0 ? this.state.places.map(place => <PlaceCard key={place.place_id} place={place} handleSelect={this.handleSelect} />) : null}
                </div>
                <br />
                <div>
                    <WhatsAppButton handleWhatsAppClick={this.handleWhatsAppClick} />
                </div>
            </React.Fragment>
        )
    }

}
