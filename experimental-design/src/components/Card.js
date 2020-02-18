import React from 'react'

let whatsappLinkPre = 'whatsapp://send?text='
let citymapperLinkPre = 'https://citymapper.com/directions?endcoord='
let cityMapperLinkMid = '%2C'

class Card extends React.Component {

    render(){
        const {name,url,postcode,latitude,longitude} = this.props.place
        
        return(
            <div>
                <h3>{name}</h3>
                <a href={url}>Google Maps Link for {name}</a>
                <br/><br/><br/>
                <a href={whatsappLinkPre + url}>WhatsApp link</a>
                <br/><br/><br/>
                <h1>{postcode}</h1>
                <br/><br/><br/>
                <a href={citymapperLinkPre + latitude + cityMapperLinkMid + longitude}>CityMapper Link</a>
                <br/><br/><br/>
                <img src={this.props.place.photos[0].getUrl({maxHeight:60})} />

            </div>
        )
    }
}

export default Card;