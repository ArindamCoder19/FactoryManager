import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import Loader from '../../general/Loader';
import { resetPasswordNew } from '../../../actions/resetPassword';

const renderField = ({ input, type, placeholder, meta: { touched, error }, className }) => (
  <div className={ `${touched ? 'has-success' : ''}` +`${touched && error ? 'has-error' : ''}`}>
    <input type={type} placeholder={placeholder} required {...input} className={"form-control "+className}/>
    { touched && error && <div className="form-error">{error}</div> }
  </div>
);

class ResetPasswordNew extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(props) {
    // TO_DO: a better approach on parsing query string
    const token = this.props.location.search.split('=')[1];
    let payload = {};

    payload['token'] = token;
    payload['password'] = props.newpassword;
    this.props.resetPasswordNew(payload, this.props.history);
  }

  renderAlert() {
    let { errorMessage, isloading } = this.props,
    isError = errorMessage && errorMessage.verifyResetPassword && !isloading;

    return (
      <div className={isError ? "error-container auth-error-show" : "error-container auth-error-hide"}>
        { isError ? errorMessage.verifyResetPassword : "" }
      </div>
    )
  }

  render() {
    let { handleSubmit, isloading } = this.props;
    console.log(isloading)
    return (
      <section className="intro">
        <div className="col-md-6 left hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right new-pwd">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>
          {
            /* Error Message */
            this.renderAlert()
            
          }
          <div className="GetAccount">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              {/* New password */}
              <Field 
                name="newpassword" 
                component={renderField} 
                type="password" 
                placeholder="New password" 
                className="password"/>

              {/* Repeat new password */}
              <Field 
                name="renewpassword" 
                component={renderField} 
                type="password" 
                placeholder="Confirm New password" 
                className="password"/>

              {/* Submit button */}
              <div style={{position: "relative"}}>
                <input type="submit" value="Submit" className="btn btn-default Sign" />
                {isloading && <Loader />}
              </div>
            </form>
          </div>
          <div className="end">
          </div>
      </div>
      </section>
    )
  }
}

function validate(props) {
  const errors = {};
  const fields = ['newpassword', 'renewpassword'];

  fields.forEach((f) => {
    if(!(f in props)) {
      errors[f] = `${f} is required`;
    }
  });

  if(props.newpassword && props.newpassword.length < 6) {
    errors.newpassword = "minimum 6 characters";
  }

  if(props.newpassword !== props.renewpassword) {
    errors.renewpassword = "passwords doesn't match";
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.resetPass.error,
  isloading: state.resetPass.isloading };
}

let actions = { resetPasswordNew };

ResetPasswordNew = reduxForm({ form: 'resetnewpassword', validate })(ResetPasswordNew);

export default connect(mapStateToProps, actions)(ResetPasswordNew);
