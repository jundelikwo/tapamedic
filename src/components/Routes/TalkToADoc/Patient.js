import React, { Component } from 'react'
import { connect } from 'react-redux'

import DoctorItem from '../../DoctorItem'
import IsLoggedIn from '../../IsLoggedIn'

class Patient extends Component{
    renderDoctors(field){
        let doctors = this.props.doctors[field]
        let doctorsId = Object.keys(doctors)
        return doctorsId.map(id=>{
            console.log('id',id,'doctor',doctors[id]);   
            return <DoctorItem key={id} doctor={doctors[id]} />
        })
    }

    render(){
        let doctors = this.props.doctors
        console.log('Patient',doctors)
        let numDoctors = Object.keys(doctors['online']).length + Object.keys(doctors['busy']).length
        return numDoctors ? (
            <div>
                <h2 className="text-center h2">Available Doctors</h2>
                {this.renderDoctors('online')}
                {this.renderDoctors('busy')}
            </div>
        ):(
            <div>
                <h2 className="text-center h2">Oops!! They are no doctors online. Please try again later</h2>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        doctors: state.doctors
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Patient))