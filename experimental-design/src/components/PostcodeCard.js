import React from 'react'

export default class PostcodeCard extends React.Component {
    render(){
        const {data,deletePostcode} = this.props
        return(
            <React.Fragment>
                <div className='each-card-div-style'>
                    <h3>Postcode Card</h3>
                    <h4>{data}</h4>
                    <button onClick={()=>deletePostcode(data)}>Delete this - X</button>
                </div>
            </React.Fragment>
        )
    }
}