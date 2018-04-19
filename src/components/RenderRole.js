import React from 'react';
import { connect } from 'react-redux'

const RenderRole = ({ role, patient: Patient, doctor: Doctor, public: Public, ...rest }) => {
    if(role === 'patient'){
        return <Patient {...rest} />
    }else if(role === 'doctor'){
        return <Doctor {...rest} />
    }else{
        return <Public {...rest} />
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.user.role
    }
}

export default connect(mapStateToProps)(RenderRole)