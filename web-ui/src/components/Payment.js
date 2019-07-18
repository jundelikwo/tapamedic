import React, { Component } from 'react'
import PaystackButton from 'react-paystack'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { PaystackPublicKey } from '../config'

class Payment extends Component {
    state = {
        key: PaystackPublicKey, //PAYSTACK PUBLIC KEY
    }

    callback = (response) => {
        const { role, uid } = this.props
        console.log(response); // card charged successfully, get reference here
        firebase.database().ref(`${role}s/${uid}/payment`).set({ ...response })
    }

    close = () => {
        console.log("Payment closed");
    }

    getReference = () => {
        //you can put any unique reference implementation code here
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

        for( let i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

  render() {
    return (
        <PaystackButton
            text="Make Payment"
            class="payButton btn btn-info"
            callback={this.callback}
            close={this.close}
            reference={this.getReference()}
            //disabled={true}
            embed={true}
            email={this.props.email}
            amount={this.props.amount*100}
            paystackkey={this.state.key}
        />
    );
  }
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        role: state.user.role,
        email: state.user.phoneNumber + '@payments.tapamedic.com'
    }
}

export default connect(mapStateToProps)(Payment);