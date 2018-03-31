import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import IsLoggedIn from '../IsLoggedIn'

class Profile extends Component{
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
        } = this.props

        return (
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="panel-group tool-tips widget-shadow" id="accordion" role="tablist" aria-multiselectable="true">
                        <h3 className="title1">My Profile</h3>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                            <h4 className="panel-title">
                                <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                My Data
                                </a>
                            </h4>
                            </div>
                            <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">First Name</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={firstName} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Last Name</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={lastName} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Sex</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={sex} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Date of Birth</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={dob} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Diseases You Suffer From</label>
                                        <div className="col-md-8">
                                            <textarea type="text" className="form-control1" readOnly>{diseases}</textarea>
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Occupation</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={occupation} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Blood Group</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={blood} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Genotype</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={genotype} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Address</label>
                                        <div className="col-md-8">
                                            <input type="text" className="form-control1" placeholder={address} readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group mb-n">
                                        <label className="col-md-2 control-label">Drugs You Are Allergic To</label>
                                        <div className="col-md-8">
                                            <textarea type="text" className="form-control1" readOnly>{drugs}</textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingTwo">
                            <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Product 2
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
                                    Product 3
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
        sex
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Profile));