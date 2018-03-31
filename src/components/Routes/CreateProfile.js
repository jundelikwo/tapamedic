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
        this.onDateFocus = this.onDateFocus.bind(this)
        this.onDateBlur = this.onDateBlur.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }
    componentDidMount(){
        new Pikaday(
        {
            field: document.getElementById('datepicker1'),
            firstDay: 1,
            minDate: new Date(1900,12,1),
            maxDate: new Date()
        });
        // window.$( "#datepicker,#datepicker1,#datepicker2,#datepicker3" ).datepicker();
    }
    onDateFocus(){
        this.refs.dob.value = ''
    }
    onDateBlur(){
        if (this.refs.dob.value == '') {this.refs.dob.value = 'mm/dd/yyyy'}
    }
    onFormSubmit(e){
        e.preventDefault()
        var data = {
            address: this.refs.address.value,
            blood: this.refs.blood.value,
            diseases: this.refs.diseases.value,
            dob: moment(this.refs.dob.value).unix(),
            drugs: this.refs.drugs.value,
            firstName: this.refs.firstName.value,
            occupation: this.refs.occupation.value,
            genotype: this.refs.genotype.value,
            lastName: this.refs.lastName.value,
            sex: this.refs.sex.value
        }
        this.setState({ redirect: true })
        this.props.dispatch(addUserData(data));
        console.log("Form", data);
    }
    render(){
        return (this.state.redirect) ?
            <Redirect to="/dashboard" />:
            <div id="signupprofile" style={{ minHeight:"100vh" }}>
                <div className="bg-agile">
                    <div className="book-appointment">
                    <h2 style={{ marginBottom: "10px" }}>Medical Information</h2>
                            <form action="#" method="post" onSubmit={this.onFormSubmit}>
                                <h3 style={{ fontStyle: "italic", color: "red", marginBottom: "22px", paddingLeft: "1.5em" }}>This form is optional but it is recommended to fill it out inorder to help our doctors serve you better</h3>
                                <div className="left-agileits-w3layouts same">
                                    <div className="gaps">
                                        <p>First Name</p>
                                        <input type="text" ref="firstName" name="First Name" placeholder="" required=""/>
                                    </div>	
                                    <div className="gaps">
                                        <p>Last Name</p>
                                            <input type="text" ref="lastName" name="Last Name" placeholder="" required=""/>
                                    </div>
                                    <div className="gaps">
                                        <p>Sex</p>	
                                            <select className="form-control" ref="sex">
                                                <option></option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                    </div>
                                    <div className="gaps">
                                        <p>Date of Birth</p>		
                                        <input  id="datepicker1" ref="dob" name="Text" type="text" value="" onFocus={this.onDateFocus} onBlur={this.onDateBlur} required="" />
                                    </div>
                                    <div className="gaps">
                                        <p>Diseases you suffer from</p>
                                        <textarea id="message" ref="diseases" name="diseases" placeholder="" title="Please enter Diseases you suffer from"></textarea>
                                    </div> 
                                </div>
                                <div className="right-agileinfo same">
                                    <div className="gaps">
                                        <p>Occupation</p>
                                        <input type="text" ref='occupation' name="occupation" placeholder="" required=""/>
                                    </div>
                                    <div className="gaps">
                                        <p>Blood Group</p>	
                                        <select className="form-control" ref="blood">
                                            <option></option>
                                            <option>A</option>
                                            <option>B</option>
                                            <option>AB</option>
                                            <option>O</option>
                                        </select>
                                    </div>
                                    <div className="gaps">
                                        <p>Genotype</p>	
                                        <select className="form-control" ref="genotype">
                                            <option></option>
                                            <option>AA</option>
                                            <option>AS</option>
                                            <option>SS</option>
                                        </select>
                                    </div>
                                    <div className="gaps">	
                                        <p>Address</p>
                                        <input type="text" ref="address" name="address" placeholder="" required=""/>
                                    </div>
                                    <div className="gaps">
                                        <p>Drugs you are allergic to</p>
                                        <textarea id="message" ref="drugs" name="drugs" placeholder="" title="Please enter Drugs you are allergic to"></textarea>
                                    </div>
                                </div>
                                <div className="clear"></div>
                                <input type="submit" value="Next" />
                            </form>
                        </div>
                </div>
            </div>
        
    }
}

export default IsLoggedIn(connect()(CreateProfile))