import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'

class Patient extends Component{
    renderDoctors(field){
        let doctors = this.props.doctors[field]
        let doctorsId = Object.keys(doctors)
        return doctorsId.map(id=>{
            console.log('id',id,'doctor',doctors[id]);   
            const { name, picture } = doctors[id]
            return (
                <div key={id} style={{ borderBottom: '2px solid grey', marginBottom: '10px', paddingBottom: '10px' }}>
                    <div style={{ padding: '0' }}>
                        <div style={{ float: 'none' }}>
                            <div className="profile_img">
                                <span className="prfil-img"><img style={{ height: '75px', width: '75px' }} src={picture} alt=""/> </span> 
                                <div className="user-name">
                                    <p>Dr. {name}</p>
                                    <button className="btn btn-primary">Start</button>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
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