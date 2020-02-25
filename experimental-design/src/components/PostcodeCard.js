import React from 'react'

export default class PostcodeCard extends React.Component {
    render(){
        const {data,deletePostcode} = this.props
        return(
            <React.Fragment>
                <div className='each-card-div-style'>
                    <button onClick={()=>deletePostcode(data)}>X</button>
                    <h4>{data}</h4>
                </div>
            </React.Fragment>
        )
    }
}