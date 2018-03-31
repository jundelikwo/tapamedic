import React from 'react'
import { connect } from 'react-redux'

let isLoggedIn = (Component) => {
    class LoggedIn extends React.Component{
        render(){
            if(this.props.isLoggedIn){
                return <Component { ...this.props }/>
            }else{
                return <div>You need to be Logged In to View This Component</div>
            }
        }
    }

    return connect(state => {
        return {
            isLoggedIn: state.user.uid
        }
    })(LoggedIn)
}

export default isLoggedIn