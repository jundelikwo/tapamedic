import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Pikaday from 'pikaday'
import { addUserData, uploadProfilePhoto } from '../../../actions'
import { isImage } from '../../../functions'
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
        this.displayLanguages = this.displayLanguages.bind(this)
        this.selectLanguage = this.selectLanguage.bind(this)
    }
    componentWillMount(){
        const {
            review,
            graduation,
            firstName,
            languages,
            mdcnPhotoURL,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            match,
            other,
            account,
            accountNumber,
            bank
        } = this.props

        let formReadOnly = match.isExact
        formReadOnly = review ? true : formReadOnly

        this.setState({
            graduation,
            firstName,
            languages,
            mdcnPhotoURL,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            updatePhoto: false,
            photo: null,
            formReadOnly,
            other,
            account,
            accountNumber,
            bank
        })
    }
    componentWillReceiveProps(newProps){
        const {
            graduation,
            firstName,
            languages,
            mdcnPhotoURL,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            other,
            account,
            accountNumber,
            bank
        } = newProps

        this.setState({
            graduation: this.state.graduation || graduation,
            firstName: this.state.firstName || firstName,
            languages: this.state.languages || languages,
            mdcnPhotoURL: this.state.mdcnPhotoURL || mdcnPhotoURL,
            lastName: this.state.lastName || lastName,
            location: this.state.location || location,
            mdcn_folio: this.state.mdcn_folio || mdcn_folio,
            mdcn_membership: this.state.mdcn_membership || mdcn_membership,
            specialty: this.state.specialty || specialty,
            university: this.state.university || university,
            photoURL: this.state.photoURL || photoURL,
            other: this.state.other || other,
            account: this.state.account || account,
            accountNumber: this.state.accountNumber || accountNumber,
            bank: this.state.bank || bank
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
    selectPhoto(photoRef,photoObj,updatePhoto){
        return evt => {
            evt.preventDefault()
            let photo = this.refs[photoRef].files[0]
            console.log('File',photo)
            if(photo) {
                if(!isImage(photo)){
                    this.refs.photo.value = null
                    alert('You can only upload images')
                } else {
                    this.setState({ [photoObj]: window.URL.createObjectURL(photo), [updatePhoto]: true, [photoRef]: photo })
                }
            }
        }
    }
    uploadPhoto(photoRef,uploadFileFieldName,updatePhoto,photoName){
        return evt => {
            evt.preventDefault()
            console.log('Upload Photo',this.state[photoRef])
            this.props.dispatch(uploadProfilePhoto(this.state[photoRef], uploadFileFieldName,photoName))
            //this.props.dispatch(uploadProfilePhoto(this.state[photoRef], "profilePhoto","profile"))
            this.setState({
                [updatePhoto]: false,
            })
        }
    }
    cancelPhotoChange(photoRef,photoObj,updatePhoto){
        return evt => {
            evt.preventDefault()
            this.refs[photoRef].value = ''
            this.setState({
                [photoObj]: this.props[photoObj],
                [updatePhoto]: false,
                [photoRef]: null
            })
        }
    }
    pikadayCallBack(date) {
        let dob = moment(date).format('YYYY')
        this.setState({ dob })
    }
    selectLanguage(langRef){
        return () => {
            console.log('langRef',langRef)
            this.setState({
                [langRef] : !this.state[langRef]
            })
        }
    }
    displayLanguages(){
        const { languages } = this.props
        const { formReadOnly } = this.state
        console.log('formReadOnly',formReadOnly)
        let langFormFields = Object.keys(languages)
        
        return langFormFields.map(lang => {
            const isChecked = formReadOnly ? languages[lang]: this.state[lang]
            return (
                <div key={lang} className="checkbox-inline">
                    <label>
                        <input type="checkbox" ref={lang} checked={isChecked} disabled={formReadOnly} onChange={this.selectLanguage(lang)} /> {lang}
                    </label>
                </div>
            )
        })
    }
    onFormSubmit(e){
        e.preventDefault()

        const { languages } = this.props
        let langFields = Object.keys(languages)
        let spokenLang = {}

        langFields.forEach(lang => {
            spokenLang[lang] = this.refs[lang].checked
        })
        const formData = {
            location: this.refs.location.value,
            languages: spokenLang,
            other: this.refs.other.value,
            account: this.refs.account.value,
            accountNumber: this.refs.accountNumber.value,
            bank: this.refs.bank.value
        }

        if(this.props.approved){
            this.props.dispatch(addUserData(formData, '', false));
        }else{
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

            formData.data = data
            this.props.dispatch(addUserData(formData, ''));
        }
        this.setState({ formReadOnly: true })
    }
    toggleEditForm(e){
        let { formReadOnly, datePicker } = this.state
        const { approved, review } = this.props
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
            formReadOnly: review ? true : !formReadOnly,
            datePicker
        })
    }

    render(){
        const { formReadOnly, updatePhoto, updateMDCNPhoto } = this.state
        const { approved, review, wallet, profilePhotoUploadProgress, mdcnPhotoUploadProgress } = this.props
        const profileData = formReadOnly ? this.props : this.state
        const {
            graduation,
            firstName,
            languages,
            mdcnPhotoURL,
            lastName,
            location,
            mdcn_folio,
            mdcn_membership,
            specialty,
            university,
            photoURL,
            other,
            account,
            accountNumber,
            bank
        } = profileData
        
        return (
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="panel-group tool-tips widget-shadow" id="accordion" role="tablist" aria-multiselectable="true">
                        <h3 className="title1">My Profile
                        {!review ?
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
                            : null
                        }
                        </h3>
                        {review ?
                            <div className="alert alert-success" role="alert">
                                <strong>Well done!</strong> Your application is under review we will reach back to you within 2 - 3 working days
                            </div>
                            : null
                        }
                        <div>
                            <div id="collapseOne" aria-labelledby="headingOne">
                                <div>
                                    <div style={{ clear: 'both' }}/>
                                    <form className={
                                        formReadOnly ? 'form-horizontal readOnly' : 'form-horizontal'
                                    }  encType="multipart/form-data" onSubmit={this.onFormSubmit}>
                                        {(formReadOnly || (!formReadOnly && !approved)) ?
                                            <div>
                                                <div className="form-group mb-n">
                                                    <label className="col-md-2 control-label">Profile Photo</label>
                                                    <div className="col-md-8 text-center">
                                                        <img src={photoURL} style={{ width: '200px', height: '200px' }} alt="" />
                                                        {formReadOnly ? 
                                                            '' :
                                                            <input className='center-block' onChange={this.selectPhoto('photo','photoURL','updatePhoto')} type='file' ref="photo" name="photo" accept="image/*" readOnly={formReadOnly} />
                                                        }
                                                        {!formReadOnly && updatePhoto ?
                                                            <div>
                                                                <button onClick={this.uploadPhoto("photo","profilePhoto","updatePhoto","profile")} style={{ marginRight: '10px' }} className="btn btn-success">Upload</button>
                                                                <button onClick={this.cancelPhotoChange('photo','photoURL','updatePhoto')} className="btn btn-danger">Cancel</button>
                                                            </div>
                                                            : ''
                                                        }  
                                                        {!formReadOnly && !updatePhoto && profilePhotoUploadProgress !== null ?
                                                            <div className="progress progress-striped active progress-right" style={{ width: '90%', margin: 'auto', float: 'none', height: '18px', position: 'relative' }}>
                                                                <div className="bar green" style={{ width:profilePhotoUploadProgress }}></div> 
                                                                <span className="pull-right" style={{ float: 'none!important', position: 'absolute', left: '50%' }}>{ profilePhotoUploadProgress }</span>
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
                                            </div>
                                            : null
                                        }
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Languages</label>
                                            <div className="col-md-8">
                                                {this.displayLanguages()}
                                            </div>
                                        </div>
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Other Languages you speak</label>
                                            <div className="col-md-8">
                                                <input onChange={this.onFieldChange} ref='other' placeholder="Other Languages you speak" name='other' type="text" className="form-control1" value={other} readOnly={formReadOnly} />
                                            </div>
                                        </div>
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Bank Name</label>
                                            <div className="col-md-8">
                                                <input onChange={this.onFieldChange} ref='bank' placeholder="Bank Name" name='bank' type="text" className="form-control1" value={bank} readOnly={formReadOnly} />
                                            </div>
                                        </div>
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Account Name</label>
                                            <div className="col-md-8">
                                                <input onChange={this.onFieldChange} ref='account' placeholder="Account Name" name='account' type="text" className="form-control1" value={account} readOnly={formReadOnly} />
                                            </div>
                                        </div>
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Account Number</label>
                                            <div className="col-md-8">
                                                <input onChange={this.onFieldChange} ref='accountNumber' placeholder="Account Number" name='accountNumber' type="number" className="form-control1" value={accountNumber} readOnly={formReadOnly} />
                                            </div>
                                        </div>
                                        <div className="form-group mb-n">
                                            <label className="col-md-2 control-label">Location</label>
                                            <div className="col-md-8">
                                                <input onChange={this.onFieldChange} ref='location' placeholder="Your Location" name='location' type="text" className="form-control1" value={location} readOnly={formReadOnly} />
                                            </div>
                                        </div>
                                        {(formReadOnly || (!formReadOnly && !approved)) ?
                                            <div>
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
                                                        <img src={mdcnPhotoURL} style={{ width: '200px', height: '200px' }} alt="" />
                                                        {formReadOnly ? 
                                                            '' :
                                                            <input className='center-block' onChange={this.selectPhoto('mdcnPhoto','mdcnPhotoURL','updateMDCNPhoto')} type='file' ref="mdcnPhoto" name="mdcnPhoto" accept="image/*" readOnly={formReadOnly} />
                                                        }
                                                        {!formReadOnly && updateMDCNPhoto ?
                                                            <div>
                                                                <button onClick={this.uploadPhoto("mdcnPhoto","mdcnPhoto","updateMDCNPhoto","mdcnPhoto")} style={{ marginRight: '10px' }} className="btn btn-success">Upload</button>
                                                                <button onClick={this.cancelPhotoChange('mdcnPhoto','mdcnPhotoURL','updateMDCNPhoto')} className="btn btn-danger">Cancel</button>
                                                            </div>
                                                            : ''
                                                        }  
                                                        {!formReadOnly && !updateMDCNPhoto && mdcnPhotoUploadProgress !== null ?
                                                            <div className="progress progress-striped active progress-right" style={{ width: '90%', margin: 'auto', float: 'none', height: '18px', position: 'relative' }}>
                                                                <div className="bar green" style={{ width:mdcnPhotoUploadProgress }}></div> 
                                                                <span className="pull-right" style={{ float: 'none!important', position: 'absolute', left: '50%' }}>{ mdcnPhotoUploadProgress }</span>
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
                                                    <label className="col-md-2 control-label">Area of Specialty</label>
                                                    <div className="col-md-8">
                                                        <input onChange={this.onFieldChange} ref='specialty' placeholder="Your Area of Specialty" name='specialty' type="text" className="form-control1" value={specialty} readOnly={formReadOnly} />
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                        }
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

    let supportedLanguages = state.languages

    let graduation = state.doctorProfile.graduation
    let firstName = state.doctorProfile.firstName
    let doctorLanguages = state.doctorProfile.languages || {}
    let mdcnPhotoURL = state.doctorProfile.mdcnPhoto
    let lastName = state.doctorProfile.lastName
    let location = state.doctorProfile.location
    let mdcn_folio = state.doctorProfile.mdcn_folio
    let mdcn_membership = state.doctorProfile.mdcn_membership
    let photo = state.doctorProfile.photo
    let specialty = state.doctorProfile.specialty
    let university = state.doctorProfile.university
    
    let wallet = state.wallet

    let languages = {};
    supportedLanguages.map(lang => {
        languages[lang] = doctorLanguages[lang]
    })

    return {
        approved: state.doctorProfile.approved,
        review: state.doctorProfile.review,
        graduation,
        firstName,
        languages,
        mdcnPhotoURL,
        lastName,
        location,
        mdcn_folio,
        mdcn_membership,
        specialty,
        university,
        wallet,
        photoURL: state.user.photoURL,
        profilePhotoUploadProgress: state.fileUpload.profilePhoto,
        mdcnPhotoUploadProgress: state.fileUpload.mdcnPhoto
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Profile));