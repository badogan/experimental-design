import React from 'react'

export default class PostcodeCard extends React.Component {
    render(){
        const {data,deletePostcode} = this.props
        return(
            <React.Fragment>
                <div className='each-card-div-style'>
                    <button className="each-card-delete-button" onClick={()=>deletePostcode(data)}>
                        <span className="each-card-delete-X">X</span>
                        </button>
                    <h4>{data}</h4>
                </div>
            </React.Fragment>
        )
    }
}