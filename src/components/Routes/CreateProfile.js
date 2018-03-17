import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

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
        new window.Pikaday(
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
        console.log("Form", this.refs)
        this.setState({ redirect: true })
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
                                        <p>Gender</p>	
                                            <select className="form-control" ref="gender">
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
                                        <textarea id="message" refs="drugs" name="message" placeholder="" title="Please enter Diseases you suffer from"></textarea>
                                    </div> 
                                </div>
                                <div className="right-agileinfo same">
                                    <div className="gaps">
                                        <p>Occupation</p>
                                        <input type="text" name="occupation" placeholder="" required=""/>
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
                                        <textarea id="message" refs="diseases" name="diseases" placeholder="" title="Please enter Drugs you are allergic to"></textarea>
                                    </div>                                    
                                    {/* <div className="gaps">
                                        <p>State</p>	
                                        <select className="form-control">
                                            <option></option>
                                            <option>State-1</option>
                                            <option>State-2</option>
                                            <option>State-3</option>
                                            <option>State-4</option>
                                            <option>State-5</option>
                                        </select>
                                    </div>
                                    <div className="gaps">
                                        <p>Country</p>	
                                        <select className="form-control">
                                            <option></option>
                                            <option>Country-1</option>
                                            <option>Country-2</option>
                                            <option>Country-3</option>
                                            <option>Country-4</option>
                                            <option>Country-5</option>
                                        </select>
                                    </div> */}
                                </div>
                                <div className="clear"></div>
                                <input type="submit" value="Next" />
                            </form>
                        </div>
                </div>
            </div>
        
    }
}

export default CreateProfile