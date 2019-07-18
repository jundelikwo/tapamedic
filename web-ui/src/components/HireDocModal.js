import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactModal from 'react-responsive-modal'

import { initiateConsultation } from '../actions'
import Payment from './Payment'
import { ConsultationFee } from '../config'

class HireDocModal extends Component{
    state = {
        showPaystack: false,
    }
    constructor(){
        super()
        this.renderContent = this.renderContent.bind(this)
    }
    componentWillReceiveProps(newProps){
        if(newProps.hasEnoughMoney && !this.props.hasEnoughMoney){
            const { name, id, picture } = this.props
            this.props.dispatch(initiateConsultation(id,name,picture))
            this.setState({ showPaystack: false})
            this.props.closeModal()
        }
    }
    renderContent(){
        const { showHireForm, name, id, picture, wallet, hasEnoughMoney } = this.props
        const { showPaystack } = this.state
        console.log('wallet',wallet,'hasEnoughMoney',hasEnoughMoney)
        return !showPaystack ? (
            <div>
                <h2 className="text-center h4" style={{ fontWeight: 'bold' }}>Consult this Doctor</h2>
                <p>It will cost you &#8358;{ConsultationFee}</p>
                <p>Are you sure you want to continue?</p>
                <button className="btn btn-success" onClick={()=>{
                    if(hasEnoughMoney){
                        this.props.dispatch(initiateConsultation(id,name,picture))
                        this.props.closeModal()
                    }else{
                        this.setState({ showPaystack: true })
                    }
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