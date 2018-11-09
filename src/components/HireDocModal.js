import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-responsive-modal'

import { initiateConsultation } from '../actions'
import Payment from './Payment'
import { ConsultationFee } from '../config'

class HireDocModal extends Component{
    renderContent(){
        let { showHireForm, name, id, wallet, hasEnoughMoney } = this.props
        console.log('wallet',wallet,'hasEnoughMoney',hasEnoughMoney)
        return hasEnoughMoney ? (
            <div>
                <h2 className="text-center h4" style={{ fontWeight: 'bold' }}>Hire this Doctor</h2>
                <p>Are you sure you want to talk to Dr. {name}?</p>
                <button className="btn btn-success" onClick={()=>{
                    this.props.dispatch(initiateConsultation(id))
                    this.props.closeModal()
                }}>Yes</button>
                &nbsp;
                <button className="btn btn-danger" onClick={this.props.closeModal}>No</button>
            </div>
        ) : (
            <div>
                <h2 className="text-center h4" style={{ fontWeight: 'bold' }}>Insufficient funds</h2>
                <p>You don't have sufficient funds</p>
                <Payment amount={ConsultationFee-wallet}/>
                &nbsp;
                <button className="btn btn-danger" onClick={this.props.closeModal}>Cancel</button>
            </div>
        )
    }
    render(){
        return (
            <ReactModal open={this.props.showHireForm} onClose={this.props.closeModal} center>
                {this.renderContent()}
            </ReactModal>
        )
    }
}

const mapStateToProps = ({ wallet }) => {
    return {
        wallet,
        hasEnoughMoney: wallet - ConsultationFee >= 0
    }
}

export default connect(mapStateToProps)(HireDocModal)