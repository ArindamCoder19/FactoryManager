import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Loader from '../../general/Loader';
import { resetPassword } from '../../../actions/resetPassword';

const renderInput = field => {
  const { input, type , placeholder, meta: {error, touched}, className} = field;
  return(
  <div className={ `${touched ? 'has-success' : ''}` +`${touched && error ? 'has-error' : ''}`}>
    <input {...input} className={"form-control "+className} type={type} placeholder={placeholder} required />
  </div>
  );
 }


class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(props) {
    this.props.resetPassword(props, this.props.history);
  }

  renderAlert() {
    let { errorMessage, isloading } = this.props,
    isError = errorMessage && errorMessage.resetPassword && !isloading;

    return (
      <div className={isError ? "error-container auth-error-show" : "error-container auth-error-hide"}>
        { isError ? errorMessage.resetPassword : "" }
      </div>
    )
  }

  render() {
    let { handleSubmit, isloading } = this.props;
    return (
      <section className="intro">
        <div className="col-md-6 left hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right reset-pwd">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>
            <div className="greeting">
              <h2>Forgot your password?</h2>
              <h3>We'll email you the instructions to reset</h3>
              {
                /* Error Message */
                this.renderAlert()
                
              }
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>

              {/* Email */}
              <div className="reset-mail ">
                <Field name="email"
                        component={renderInput}
                        type="email" placeholder="IBM w3id / Email"
                        className="email"
                        />
              </div>

              {/* Submit button */}
              <div style={{position: "relative"}}>
                <input type="submit" value="Submit" className="btn btn-default Sign" />
                {isloading && <Loader />}
              </div>
            </form>
          </div>
          <div className="end">
            <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.resetPass.error,
    isloading: state.resetPass.isloading };
}

let actions = { resetPassword };

ResetPassword = reduxForm({ form: 'resetpassword' })(ResetPassword);

export default connect(mapStateToProps, actions)(ResetPassword);
