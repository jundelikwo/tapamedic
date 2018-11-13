import React, { Component } from 'react'

class DoctorItem extends Component {
    render(){
        const { name, picture,id } = this.props.doctor
        return (
            <div style={{ borderBottom: '2px solid grey', marginBottom: '10px', paddingBottom: '10px' }}>
                <div style={{ padding: '0' }}>
                    <div style={{ float: 'none' }}>
                        <div className="profile_img">
                            <span className="prfil-img"><img style={{ height: '75px', width: '75px' }} src={picture} alt=""/> </span> 
                            <div className="user-name">
                                <p>Dr. {name}</p>
                                <button className="btn btn-primary" onClick={() => {
                                    this.props.showModal(name,id,picture)
                                }}>Consult</button>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DoctorItem