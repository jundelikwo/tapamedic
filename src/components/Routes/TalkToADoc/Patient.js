import React, { Component } from 'react'
import { connect } from 'react-redux'

import DoctorItem from '../../DoctorItem'
import HireDocModal from '../../HireDocModal'
import IsLoggedIn from '../../IsLoggedIn'

class Patient extends Component{
    state = {
        showHireForm: false,
        id: 0,
        name: ''
    }

    constructor(){
        super()
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    showModal(name,id){
        this.setState({ name, id, showHireForm: true })
    }

    closeModal(){
        this.setState({ name: '', id: 0, showHireForm: false })
    }

    renderDoctors(field){
        let doctors = this.props.doctors[field]
        let doctorsId = Object.keys(doctors)
        return doctorsId.map(id=>{
            console.log('id',id,'doctor',doctors[id]);   
            return <DoctorItem showModal={this.showModal} key={id} doctor={{ id,...doctors[id] }} />
        })
    }

    render(){
        let doctors = this.props.doctors
        const { showHireForm, name, id } = this.state
        console.log('Patient',doctors)
        let numDoctors = Object.keys(doctors['online']).length + Object.keys(doctors['busy']).length
        return numDoctors ? (
            <div>
                <h2 className="text-center h2">Available Doctors</h2>
                {this.renderDoctors('online')}
                {this.renderDoctors('busy')}
                <HireDocModal closeModal={this.closeModal} showHireForm={showHireForm} name={name} id={id} />
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