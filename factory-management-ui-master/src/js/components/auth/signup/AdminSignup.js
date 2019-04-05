import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, Form } from 'redux-form';
import { signupUser } from '../../../actions/auth';

const renderInput = (field) => {
  const {  type, input, meta: { error, touched }, placeholder, className} = field;
  return (
    <div className={ `${touched ? 'has-success' : ''}` +` ${touched && error ? 'has-error' : ''}`}>
      <input {...input} type={type}
          className={"form-control "+ className}
          placeholder={placeholder}
          required
        />
      {touched && error && false && <div className="error">{error}</div>}
  </div>
  );
}

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: ["Developer", "Lead", "Manager"],
      roleSelected: "Developer"
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(formProps) {
    let payload = {};

    payload["firstName"] = formProps.firstname;
    payload["lastName"] = formProps.lastname;
    payload["email"] = formProps.email;
    payload["password"] = formProps.password;
    payload["role"] = "ADMIN";
    this.props.signupUser(payload, this.props.history);
  }

  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
            <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <section className="intro admin">
        <div className="col-md-6 left hidden-xs hidden-sm">
        </div>
        <div className="col-md-6 col-sm-12 right">
          <div id="logo">
            <b>FACTORY</b>
            <br/>MANAGER
          </div>
          <div className="GetAccount">
            <h2>Get your Admin account.</h2>
            <h3>Sign Up. Theres more behind the Star.</h3>

            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <div className="signup">
                <div className="Names">
                  <Field name="firstname"
                    component={renderInput}
                    type="text"
                    placeholder="First name" />
                  <Field name="lastname"
                    component={renderInput}
                    type="text"
                    placeholder="Last name" />
                </div>
                <Field name="email"
                  type="email"
                  component={renderInput}
                  placeholder="Email"
                  className="email"/>

                <Field name="password"
                    type="password"
                    component={renderInput}
                    placeholder="Password"
                    className="password"
                  />
                <Field name="passwordConfirm"
                    type="password"
                    component={renderInput}
                    placeholder="Confirm Password"
                    className="password"
                   />
               {/* Server error message */}
                <div>
                    { this.props.errorMessage &&
                      this.props.errorMessage.signup &&
                       <div className="error-container">Oops! { this.props.errorMessage.signup }</div> }
                </div>
                <input type="submit" value="Sign Up" className="btn btn-default Sign" />
              </div>
            </form>
          </div>
          <div className="end">
          </div>
        </div>
      </section>
    );
  }
}


const validate = props => {
  const errors = {};
  const fields = ['firstname', 'lastname', 'email', 'password', 'passwordConfirm'];

  fields.forEach((f) => {
    if(!(f in props)) {
      errors[f] = `${f} is required`;
    }
  });

  if(props.firstname && props.firstname.length > 20) {
    errors.firstname = "maximum of 20 characters";
  }

  if(props.lastname && props.lastname.length > 20) {
    errors.lastname = "maximum of 20 characters";
  }

  if(props.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(props.email)) {
    errors.email = "please provide valid email";
  }

  if(props.password && props.password.length < 8) {
    errors.password = "minimum 6 characters";
  }

  if(props.password !== props.passwordConfirm) {
    errors.passwordConfirm = "passwords doesn't match";
  }

  return errors;
};


function mapStateToProps(state) {
    return {
        errorMessage: state.auth.error
    };
}

let actions = { signupUser };

const form = reduxForm({ form: 'signup', validate });
export default connect(mapStateToProps, actions)(form(Signup));
