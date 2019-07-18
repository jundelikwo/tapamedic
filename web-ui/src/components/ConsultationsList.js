import React, { Component } from 'react'
import { connect } from 'react-redux'

import ConsultationItem from './ConsultationItem'

class ConsultationsList extends Component{
    render(){
        const { consultationsList } = this.props
        let accepted, pending = []
        consultationsList.forEach(key => {
            if(accepted === true){
                accepted.push((<ConsultationItem key={key} consultId={key} />))
            }else{
                pending.push((<ConsultationItem key={key} consultId={key} />))
            }
        })

        return (
            <div>
                <h2 className="text-center h2">My Consultations</h2>
                {pending}
                {accepted}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        consultationsList: Object.keys(state.consultations)
    }
}

export default connect(mapStateToProps)(ConsultationsList)