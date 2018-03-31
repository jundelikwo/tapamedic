import React, { Component } from 'react'
import PaystackButton from 'react-paystack'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { PaystackPublicKey } from '../../config'

class Payment extends Component {

    state = {
        key: PaystackPublicKey, //PAYSTACK PUBLIC KEY
        amount: 10000 //equals NGN100,
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
        <div id="page-wrapper">
            <div className="main-page">
                <div className="panel-group tool-tips widget-shadow" id="accordion" role="tablist" aria-multiselectable="true">
                <p>
                <PaystackButton
                    text="Make Payment"
                    class="payButton"
                    callback={this.callback}
                    close={this.close}
                    reference={this.getReference()}
                    email={this.props.email}
                    amount={this.state.amount}
                    paystackkey={this.state.key}
                />
                </p>
            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        role: state.user.role,
        email: state.user.uid + '@payments.tapamedic.com'
    }
}

export default connect(mapStateToProps)(Payment);