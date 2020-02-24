import React from 'react'

import API from '../API'

import EncouragingText from '../components/EncouragingText'
import PostcodeCard from '../components/PostcodeCard'
import PostcodeInput from '../components/PostcodeInput'
import TravelModeRadioButtons from '../components/TravelModeRadioButtons'
import PlaceTypesDropDown from '../components/PlaceTypesDropDown'
import SearchInitiation from '../components/SearchInitiation'

export default class PreSearchPage extends React.Component {

    componentDidMount() {
        // API.postToBackend(this.props.location)
    }

    render(){
        const {content, presearchEnteredPostcodes, deletePostcode, addPostcode, handleRadioSelection, stateOfCar, handlePlaceTypeSelection, initiateSearching } = this.props
        return(
            <React.Fragment>
                <div className="encourage-text wrapper">
                    <EncouragingText content={content} />
                </div>
                <div className="postcode-cards wrapper">
                    {presearchEnteredPostcodes.map((postcode,index)=><PostcodeCard key={index} data={postcode} deletePostcode={deletePostcode}/>)}
                </div>
                <div className="postcode-entry">
                    <PostcodeInput presearchEnteredPostcodes={presearchEnteredPostcodes} addPostcode={addPostcode}/>
                </div>
                <div className="travel-mode-and-place-type-selector wrapper">
                    {presearchEnteredPostcodes.length>1 
                        ? <TravelModeRadioButtons handleRadioSelection={handleRadioSelection} stateOfCar={stateOfCar}/> 
                        : null}
                    {presearchEnteredPostcodes.length>1 
                        ? <PlaceTypesDropDown handlePlaceTypeSelection={handlePlaceTypeSelection}/> 
                        : null}
                </div>
                <div className="buttons-add-and-magic">
                    {presearchEnteredPostcodes.length>1 
                        ? <SearchInitiation initiateSearching={initiateSearching}/> 
                        : null}
                </div>
            </React.Fragment>
        )
    }
}