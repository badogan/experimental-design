import React from 'react'

export default class EncouragingText extends React.Component {
    render() {
        return (
            <div className='encourage-text-each'>
                <h1 onClick={()=>this.props.populateWithSomeRandomPostcode()}>{this.props.content}</h1>
            </div>
        )
    }
}

