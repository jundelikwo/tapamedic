import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Pikaday from 'pikaday'
import { addUserData } from '../../actions'
import IsLoggedIn from '../IsLoggedIn'

class Profile extends Component{
    state = {
        formReadOnly: true
    }

    constructor(props){
        super(props)
        this.toggleEditForm = this.toggleEditForm.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onFieldChange = this.onFieldChange.bind(this)
        this.pikadayCallBack = this.pikadayCallBack.bind(this)
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
    onFieldChange(evt){
        evt.preventDefault()
        const { name,value } = evt.target
        let data = {}
        data[name] = value;
        //data.dob = this.refs.dob.value
        this.setState(data)
    }
    pikadayCallBack(date) {
        let dob = moment(date).format('Do MMMM YYYY')
        this.setState({ dob })
    }
    onFormSubmit(e){
        e.preventDefault()
        if(this.state.datePicker.destroy){this.state.datePicker.destroy()}
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
        this.props.dispatch(addUserData(data));
        this.setState({ formReadOnly: true })
    }
    toggleEditForm(e){
        let { formReadOnly, datePicker } = this.state
        if(formReadOnly){

            datePicker = new Pikaday(
            {
                field: document.getElementById('datepicker1'),
                firstDay: 1,
                format: 'Do MMMM YYYY',
                yearRange: [1920,2018],
                minDate: new Date(1900,12,1),
                maxDate: new Date(),
                onSelect: this.pikadayCallBack
            });
        }else{
            if(datePicker.destroy){datePicker.destroy()}
        }
        this.setState({ 
            formReadOnly: !formReadOnly,
            datePicker
        })
    }

    render(){
        const { formReadOnly } = this.state
        const { wallet } = this.props
        const profileData = formReadOnly ? this.props : this.state
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
        } = profileData

        return (
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="panel-group tool-tips widget-shadow" id="accordion" role="tablist" aria-multiselectable="true">
                        <h3 className="title1">My Profile<span style={{ float: 'right' }}>&#8358;{wallet}</span></h3>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                            <h4 className="panel-title">
                                <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <span>My Data</span>
                                </a>
                            </h4>
                            </div>
                            <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
                                <a role="button" style={{ float: 'right' }} onClick={this.toggleEditForm}>
                                    {formReadOnly ? 
                                        <span>
                                            <i className="fa fa-pencil" style={{ marginRight: '10px' }} />
                                            Edit
                                        </span>
                                        : 
                                        <span>Cancel</span>
                                    }
                                </a>
                                <form className="form-horizontal" onSubmit={this.onFormSubmit}>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">First Name</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref="firstName" name="firstName" type="text" className="form-control1" value={firstName} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Last Name</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref="lastName" name="lastName" type="text" className="form-control1" value={lastName} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Sex</label>
                                        <div className="col-md-8">
                                                <select onChange={this.onFieldChange} className="form-control1" ref="sex" name="sex" value={sex} readOnly={formReadOnly} >
                                                    <option></option>
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                </select>
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Date of Birth</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} type="text" id="datepicker1" ref="dob" name="dob" className="form-control1" value={dob} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Diseases You Suffer From</label>
                                        <div className="col-md-8">
                                            <textarea onChange={this.onFieldChange} ref="diseases" name="diseases" type="text" className="form-control1" value={diseases} readOnly={formReadOnly}></textarea>
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Occupation</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='occupation' name='occupation' type="text" className="form-control1" value={occupation} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Blood Group</label>
                                        <div className="col-md-8">
                                            <select onChange={this.onFieldChange} className="form-control1" ref="blood" name="blood" value={blood} readOnly={formReadOnly}>
                                                <option></option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>AB</option>
                                                <option>O</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Genotype</label>
                                        <div className="col-md-8">
                                            <select onChange={this.onFieldChange} className="form-control1" ref="genotype" name="genotype" value={genotype} readOnly={formReadOnly}>
                                                <option></option>
                                                <option>AA</option>
                                                <option>AS</option>
                                                <option>SS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Address</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref="address" name="address" type="text" className="form-control1" value={address} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Drugs You Are Allergic To</label>
                                        <div className="col-md-8">
                                            <textarea onChange={this.onFieldChange} ref="drugs" name="drugs" type="text" className="form-control1" value={drugs} readOnly={formReadOnly}></textarea>
                                        </div>
                                    </div>
                                    {formReadOnly ? null :
                                        <button type="submit" className="btn btn-primary">Save Profile</button>
                                    }
                                </form>
                            </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingTwo">
                            <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <span>Questions asked</span>
                                </a>
                            </h4>
                            </div>
                            <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                            <div className="panel-body">
                                Eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Anim pariatur cliche reprehenderit, enim  Food truck quinoa nesciunt laborum eiusmod. apiente ea proident. Ad vegan excepteur butcher vice lomo.  labore sustainable VHS.
                            </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingThree">
                            <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <span>Consultation History</span>
                                </a>
                            </h4>
                            </div>
                            <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                            <div className="panel-body">
                                3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.  apiente ea proident. Ad vegan excepteur butcher vice lomo.  labore sustainable VHS.
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const err = 'Not Yet Set'

    let address = state.profile.address || err
    let blood = state.profile.blood || err
    let diseases = state.profile.diseases || err
    let dob = state.profile.dob || err
    let drugs = state.profile.drugs || err
    let firstName = state.profile.firstName || err
    let occupation = state.profile.occupation || err
    let genotype = state.profile.genotype || err
    let lastName = state.profile.lastName || err
    let sex = state.profile.sex || err
    
    let wallet = state.wallet

    if(dob !== err){
        dob = moment.unix(dob).format('Do MMMM YYYY')
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
        wallet
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Profile));