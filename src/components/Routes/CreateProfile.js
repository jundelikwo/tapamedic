import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import Pikaday from 'pikaday'
import { addUserData } from '../../actions'
import IsLoggedIn from '../IsLoggedIn'

class CreateProfile extends Component{
    state = {
        redirect: false
    }
    constructor(props){
        super(props)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onFieldChange = this.onFieldChange.bind(this)
    }
    componentWillMount(){
        const {
            address,
            blood,
            diseases,
            dob,
            drugs,
            firstName,
            occupation,
            genotype,
            lastName,
            sex
        } = this.props

        this.setState({
            address,
            blood,
            diseases,
            dob,
            drugs,
            firstName,
            occupation,
            genotype,
            lastName,
            sex
        })
    }
    componentDidMount(){
        new Pikaday(
        {
            field: document.getElementById('datepicker1'),
            firstDay: 1,
            format: 'Do MMMM YYYY',
            yearRange: [1920,2018],
            minDate: new Date(1900,12,1),
            maxDate: new Date()
        });
    }
    onFieldChange(evt){
        evt.preventDefault()
        const { name,value } = evt.target
        let data = {}
        data[name] = value;
        data.dob = this.refs.dob.value
        this.setState(data)
    }
    onFormSubmit(e){
        e.preventDefault()
        var data = {
            address: this.refs.address.value,
            blood: this.refs.blood.value,
            diseases: this.refs.diseases.value,
            dob: moment(this.refs.dob.value, 'Do MMMM YYYY').unix(),
            drugs: this.refs.drugs.value,
            firstName: this.refs.firstName.value,
            occupation: this.refs.occupation.value,
            genotype: this.refs.genotype.value,
            lastName: this.refs.lastName.value,
            sex: this.refs.sex.value
        }
        this.setState({ redirect: true })
        this.props.dispatch(addUserData(data));
        //console.log("Form", data);
    }
    render(){
        const {
            address,
            blood,
            diseases,
            dob,
            drugs,
            firstName,
            occupation,
            genotype,
            lastName,
            sex
        } = this.state
        
        if(this.state.redirect){
            return <Redirect to="/dashboard" />
        }else if(this.props.name){
            return <Redirect to="/dashboard/profile" />
        }else{
            return(
                <div id="signupprofile" style={{ minHeight:"100vh" }}>
                    <div className="bg-agile">
                        <div className="book-appointment">
                        <h2 style={{ marginBottom: "10px" }}>Medical Information</h2>
                                <form action="#" method="post" onSubmit={this.onFormSubmit}>
                                    <h3 style={{ fontStyle: "italic", color: "red", marginBottom: "22px", paddingLeft: "1.5em" }}>This form is optional but it is recommended to fill it out inorder to help our doctors serve you better</h3>
                                    <div className="left-agileits-w3layouts same">
                                        <div className="gaps">
                                            <p>First Name</p>
                                            <input onChange={this.onFieldChange} type="text" ref="firstName" value={firstName} name="firstName" placeholder="" required=""/>
                                        </div>	
                                        <div className="gaps">
                                            <p>Last Name</p>
                                                <input onChange={this.onFieldChange} type="text" ref="lastName" value={lastName} name="lastName" placeholder="" required=""/>
                                        </div>
                                        <div className="gaps">
                                            <p>Sex</p>	
                                                <select onChange={this.onFieldChange} className="form-control" ref="sex" name="sex" value={sex}>
                                                    <option></option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                </select>
                                        </div>
                                        <div className="gaps">
                                            <p>Date of Birth</p>		
                                            <input onChange={this.onFieldChange} id="datepicker1" ref="dob" value={dob} name="dob" type="text" required="" />
                                        </div>
                                        <div className="gaps">
                                            <p>Diseases you suffer from</p>
                                            <textarea onChange={this.onFieldChange} id="message" ref="diseases" value={diseases} name="diseases" placeholder="" title="Please enter Diseases you suffer from"></textarea>
                                        </div> 
                                    </div>
                                    <div className="right-agileinfo same">
                                        <div className="gaps">
                                            <p>Occupation</p>
                                            <input onChange={this.onFieldChange} type="text" ref='occupation' value={occupation} name="occupation" placeholder="" required=""/>
                                        </div>
                                        <div className="gaps">
                                            <p>Blood Group</p>	
                                            <select onChange={this.onFieldChange} className="form-control" ref="blood" name="blood" value={blood}>
                                                <option></option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>AB</option>
                                                <option>O</option>
                                            </select>
                                        </div>
                                        <div className="gaps">
                                            <p>Genotype</p>	
                                            <select onChange={this.onFieldChange} className="form-control" ref="genotype" name="genotype" value={genotype}>
                                                <option></option>
                                                <option>AA</option>
                                                <option>AS</option>
                                                <option>SS</option>
                                            </select>
                                        </div>
                                        <div className="gaps">	
                                            <p>Address</p>
                                            <input onChange={this.onFieldChange} type="text" ref="address" value={address} name="address" placeholder="" required=""/>
                                        </div>
                                        <div className="gaps">
                                            <p>Drugs you are allergic to</p>
                                            <textarea onChange={this.onFieldChange} id="message" ref="drugs" value={drugs} name="drugs" placeholder="" title="Please enter Drugs you are allergic to"/>
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                    <input type="submit" value="Next" />
                                </form>
                            </div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    
    let address = state.profile.address
    let blood = state.profile.blood
    let diseases = state.profile.diseases
    let dob = state.profile.dob
    let drugs = state.profile.drugs
    let firstName = state.profile.firstName
    let occupation = state.profile.occupation
    let genotype = state.profile.genotype
    let lastName = state.profile.lastName
    let sex = state.profile.sex

    if(dob){
        dob = moment(dob).format('Do MMMM YYYY')
    }

    return {
        address,
        blood,
        diseases,
        dob,
        drugs,
        firstName,
        occupation,
        genotype,
        lastName,
        sex,
        name: state.user.name
    }
}

export default IsLoggedIn(connect(mapStateToProps)(CreateProfile))