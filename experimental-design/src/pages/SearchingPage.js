import React from 'react'
import API from '../API'
import ShowMessage from '../components/ShowMessage'
import Helper from '../Helper'



export default class SearchingPage extends React.Component {

    state = {
        showStep0: false,
        showStep1: false,
        showStep2: false,
        showStep3: false
    }

    init =() => {
        this.doSearchAndHandoverToPostSearch()
    }

    doSearchAndHandoverToPostSearch = () => {
        this.setState({step0:true})
        Promise.all(
          this.props.presearchEnteredPostcodes.map(postcode=> API.lookUpAPostCode(postcode))
        )
        .then((responseForAllPostcodes)=> {
          let midPointLatitude = 0
          let midPointLongitude = 0
          responseForAllPostcodes.map(response=>{
            midPointLatitude = midPointLatitude + (response.result.latitude / responseForAllPostcodes.length)
            midPointLongitude = midPointLongitude + (response.result.longitude / responseForAllPostcodes.length)
          })
          let midPointObj = {latitude:midPointLatitude,longitude:midPointLongitude}
          this.props.updateMidPointLongLat(midPointObj)
          return (midPointObj)
        })
        .then(midPointObj=>{
            this.setState({step1:true })
          return API.getNearestPostCode(midPointObj)
        }).then(closestPostCodeObject=>{
          if (closestPostCodeObject.status === 200) {
            if (closestPostCodeObject.result !== null) {
              this.props.updateMidPointPostcode(closestPostCodeObject.result[0].postcode.replace(/ /g,'').toUpperCase())
            } else { console.log('no close postcode from postcode.io')}
          }
          }) 
        //   END: Shoukld handover to react router, update state clarifying where the link came from - searching or link router
        }

    componentDidMount(){
        this.init()
    }

    render(){
        return(
            <React.Fragment>
                <h2>Please wait ...</h2>
                <br/>
                {/* {API.searchingMessages().map((message,index)=><ShowMessage key={index} message={message}/>)} */}
                { this.state.showStep0 && <ShowMessage message={Helper.SearchingPageMessages()[0]}/>}
                { this.state.showStep1 && <ShowMessage message={Helper.SearchingPageMessages()[1]}/>}
                { this.state.showStep2 && <ShowMessage message={Helper.SearchingPageMessages()[2]}/>}
                { this.state.showStep3 && <ShowMessage message={Helper.SearchingPageMessages()[3]}/>}
            </React.Fragment>
        )
    }
}