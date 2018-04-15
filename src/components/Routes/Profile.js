import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Pikaday from 'pikaday'
import { addUserData, uploadProfilePhoto } from '../../actions'
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
        this.selectPhoto = this.selectPhoto.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
        this.cancelPhotoChange = this.cancelPhotoChange.bind(this)
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
            sex,
            photoURL
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
            sex,
            photoURL,
            updatePhoto: false,
            photo: null
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
    selectPhoto(evt){
        evt.preventDefault()
        let photo = this.refs.photo.files[0]
        console.log('File',photo)
        if(photo) {
            this.setState({ photoURL: window.URL.createObjectURL(photo), updatePhoto: true, photo })
        }
    }
    uploadPhoto(evt){
        evt.preventDefault()
        console.log('Upload Photo',this.state.photo)
        this.props.dispatch(uploadProfilePhoto(this.state.photo, 'profilePhoto'))
        this.setState({
            updatePhoto: false,
        })
    }
    cancelPhotoChange(evt){
        evt.preventDefault()
        this.refs.photo.value = ''
        this.setState({
            photoURL: this.props.photoURL,
            updatePhoto: false,
            photo: null
        })
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
        const { formReadOnly, updatePhoto } = this.state
        const { wallet, fileUploadProgress } = this.props
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
            photoURL,
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
                                <div style={{ clear: 'both' }}/>
                                <form className={
                                    formReadOnly ? 'form-horizontal readOnly' : 'form-horizontal'
                                }  encType="multipart/form-data" onSubmit={this.onFormSubmit}>
                                    <div className="form-group mb-n">
                                        <div className="col-md-8 text-center">
                                            <img src={photoURL} style={{ width: '200px', height: '200px' }} alt="" />
                                            {formReadOnly ? 
                                                '' :
                                                <input className='center-block' onChange={this.selectPhoto} type='file' ref="photo" name="photo" accept="image/*" readOnly={formReadOnly} />
                                            }
                                            {!formReadOnly && updatePhoto ?
                                                <div>
                                                    <button onClick={this.uploadPhoto} style={{ marginRight: '10px' }} className="btn btn-success">Upload</button>
                                                    <button onClick={this.cancelPhotoChange} className="btn btn-danger">Cancel</button>
                                                </div>
                                                : ''
                                            }  
                                            {!formReadOnly && !updatePhoto && fileUploadProgress !== null ?
                                                <div className="progress progress-striped active progress-right" style={{ width: '90%', margin: 'auto', float: 'none', height: '18px', position: 'relative' }}>
                                                    <div className="bar green" style={{ width:fileUploadProgress }}></div> 
                                                    <span className="pull-right" style={{ float: 'none!important', position: 'absolute', left: '50%' }}>{ fileUploadProgress }</span>
                                                </div> 
                                            : ''
                                            }
                                        </div>
                                    </div>
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
        wallet,
        photoURL: state.user.photoURL,
        fileUploadProgress: state.fileUpload.profilePhoto
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Profile));