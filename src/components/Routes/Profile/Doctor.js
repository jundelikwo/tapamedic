import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Pikaday from 'pikaday'
import { addUserData, uploadProfilePhoto } from '../../../actions'
import IsLoggedIn from '../../IsLoggedIn'

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
            graduation,
            firstName,
            languages,
            mdcn_photo,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            match
        } = this.props

        let formReadOnly = match.isExact

        this.setState({
            graduation,
            firstName,
            languages,
            mdcn_photo,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            updatePhoto: false,
            photo: null,
            formReadOnly
        })
    }
    componentWillReceiveProps(newProps){
        const {
            graduation,
            firstName,
            languages,
            mdcn_photo,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL
        } = newProps

        this.setState({
            graduation,
            firstName,
            languages,
            mdcn_photo,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
        })
    }
    componentDidMount(){
        let { datePicker, formReadOnly } = this.state
        if(!formReadOnly){
            datePicker = new Pikaday(
            {
                field: document.getElementById('datepicker1'),
                firstDay: 1,
                format: 'YYYY',
                yearRange: [1920,2018],
                minDate: new Date(1900,12,1),
                maxDate: new Date(),
                onSelect: this.pikadayCallBack
            });
        }
        this.setState({ datePicker })
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
        this.props.dispatch(uploadProfilePhoto(this.state.photo, 'profilePhoto','profile'))
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
        let dob = moment(date).format('YYYY')
        this.setState({ dob })
    }
    onFormSubmit(e){
        e.preventDefault()
        if(this.state.datePicker.destroy){this.state.datePicker.destroy()}
        var data = {
            firstName: this.refs.firstName.value,
            graduation: this.refs.graduation.value,
            lastName: this.refs.lastName.value,
            mdcn_folio: this.refs.mdcn_folio.value,
            mdcn_membership: this.refs.mdcn_membership.value,
            specialty: this.refs.specialty.value,
            university: this.refs.university.value
        }
        console.log('data',data)
        this.props.dispatch(addUserData({
            data,
            location: this.refs.location.value
        }, ''));
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
            if(datePicker && datePicker.destroy){datePicker.destroy()}
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
            graduation,
            firstName,
            languages,
            mdcn_photo,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
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
                                        <label className="col-md-2 control-label">Profile Photo</label>
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
                                            <input onChange={this.onFieldChange} ref="firstName" name="firstName" placeholder="First Name" type="text" className="form-control1" value={firstName} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Last Name</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref="lastName" name="lastName" placeholder="Last Name" type="text" className="form-control1" value={lastName} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">MDCN Folio Number</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='mdcn_folio' placeholder="Your MDCN Folio Number" name='mdcn_folio' type="text" className="form-control1" value={mdcn_folio} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">MDCN Membership Registration Number</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='mdcn_membership' placeholder="Your MDCN Membership Registration Number" name='mdcn_membership' type="text" className="form-control1" value={mdcn_membership} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">MDCN License Photo</label>
                                        <div className="col-md-8 text-center">
                                            <img src={mdcn_photo} style={{ width: '200px', height: '200px' }} alt="" />
                                            {formReadOnly ? 
                                                '' :
                                                <input className='center-block' onChange={this.selectPhoto} type='file' ref="mdcn_photo" name="mdcn_photo" accept="image/*" readOnly={formReadOnly} />
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
                                        <label className="col-md-2 control-label">University Attended</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='university' placeholder="University Attended" name='university' type="text" className="form-control1" value={university} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Year of Graduation</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='graduation' placeholder="Your Year of Graduation" name='graduation' type="number" className="form-control1" value={graduation} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Location</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='location' placeholder="Your Location" name='location' type="text" className="form-control1" value={location} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Area of Specialty</label>
                                        <div className="col-md-8">
                                            <input onChange={this.onFieldChange} ref='specialty' placeholder="Your Area of Specialty" name='specialty' type="text" className="form-control1" value={specialty} readOnly={formReadOnly} />
                                        </div>
                                    </div>
                                    {formReadOnly ? null :
                                        <button type="submit" className="btn btn-primary">Save Profile</button>
                                    }
                                </form>
                            </div>
                            </div>
                        </div>
                        {/* <div className="panel panel-default">
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
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    //const err = 'Not Yet Set'

    let graduation = state.doctorProfile.graduation
    let firstName = state.doctorProfile.firstName
    let languages = state.doctorProfile.languages
    let mdcn_photo = state.doctorProfile.mdcn_photo
    let lastName = state.doctorProfile.lastName
    let location = state.doctorProfile.location
    let mdcn_folio = state.doctorProfile.mdcn_folio
    let mdcn_membership = state.doctorProfile.mdcn_membership
    let photo = state.doctorProfile.photo
    let specialty = state.doctorProfile.specialty
    let university = state.doctorProfile.university
    
    let wallet = state.wallet


    return {
        graduation,
        firstName,
        languages,
        mdcn_photo,
        lastName,
        location,
        mdcn_folio,
        mdcn_membership,
        specialty,
        university,
        wallet,
        photoURL: state.user.photoURL,
        fileUploadProgress: state.fileUpload.profilePhoto
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Profile));