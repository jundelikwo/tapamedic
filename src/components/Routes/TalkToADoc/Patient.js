import React, { Component } from 'react'
import { connect } from 'react-redux'

import ConsultationsList from '../../ConsultationsList'
import DoctorItem from '../../DoctorItem'
import HireDocModal from '../../HireDocModal'
import IsLoggedIn from '../../IsLoggedIn'

class Patient extends Component{
    state = {
        showAvailableDoctors: false,
        showHireForm: false,
        id: 0,
        name: '',
        picture: ''
    }

    constructor(){
        super()
        this.showModal = this.showModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    showModal(name,id,picture){
        this.setState({ name, id, picture, showHireForm: true })
    }

    closeModal(){
        this.setState({ name: '', id: 0, picture: '', showHireForm: false })
    }

    renderDoctorsList(field){
        let doctors = this.props.doctors[field]
        let doctorsId = Object.keys(doctors)
        return doctorsId.map(id=>{
            console.log('id',id,'doctor',doctors[id]);   
            return <DoctorItem showModal={this.showModal} key={id} doctor={{ id,...doctors[id] }} />
        })
    }

    renderDoctors(){
        let doctors = this.props.doctors
        const { showHireForm, name, id, picture } = this.state
        console.log('Patient',doctors)
        let numDoctors = Object.keys(doctors['online']).length + Object.keys(doctors['busy']).length
        return numDoctors ? (
            <div>
                <h2 className="text-center h2">Available Doctors</h2>
                {this.renderDoctorsList('online')}
                {this.renderDoctorsList('busy')}
                <HireDocModal closeModal={this.closeModal} showHireForm={showHireForm} name={name} id={id} picture={picture} />
            </div>
        ):(
            <div>
                <h2 className="text-center h2">Oops!! They are no doctors online. Please try again later</h2>
            </div>
        )
    }

    renderConsultations = () => {
        return (
            <div>
                <ConsultationsList/>
                {this.state.showAvailableDoctors ? this.renderDoctors()
                    :<button className="btn btn-info" onClick={
                        () => this.setState({ showAvailableDoctors: true })
                    }>
                        Search Available Doctors
                    </button>    
                }
            </div>
        )
    }

    render(){
        console.log('Consultation TalkToADoc',this.props.consultations)
        console.log('ConsultationList TalkToADoc',this.props.consultationsList)
        return this.props.consultationsList.length ? this.renderConsultations() : this.renderDoctors()
    }
}

const mapStateToProps = state => {
    return {
        consultationsList: Object.keys(state.consultations),
        doctors: state.doctors
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Patient))