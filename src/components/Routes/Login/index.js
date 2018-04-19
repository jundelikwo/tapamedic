import React from 'react';
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'

const Login = ()=>(
    <div style={{ marginTop: '30px' }}>
        <RenderRole patient={Patient} doctor={Doctor} />
    </div>
)

export default Login