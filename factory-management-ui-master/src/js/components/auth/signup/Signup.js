import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import Loader from '../../general/Loader';
import { getCategories, signupUser } from '../../../actions/auth';

const renderInput = (field) => {
  const {  type, input, meta: { error, touched }, placeholder, className} = field;
  return (
    <div className={ `${touched ? 'has-success' : ''}` +` ${touched && error ? 'has-error' : ''}`}>
      <input {...input} type={type}
          className={"form-control "+ className}
          placeholder={placeholder}
          required
        />
    </div>
  );
}

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: ["Developer", "Lead", "Manager","Guest"],
      roleSelected: "Developer",
      isDev: true,
      serviceSelected: "",
      value: "",
      ddErrorCN: ""
    }

    this.props.getCategories();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this._getServices = this._getServices.bind(this);
    this._serviceClicked = this._serviceClicked.bind(this);
  }

    handleFormSubmit(formProps) {
      let payload = {},
      { serviceSelected, roleSelected } = this.state;

      if(serviceSelected != ""){
        payload["firstName"] = formProps.firstname;
        payload["lastName"] = formProps.lastname;
        payload["email"] = formProps.email;
        payload["password"] = formProps.password;
        payload["role"] = this.state.roleSelected.toUpperCase();
        payload["categoryId"] = (roleSelected == "Developer" || roleSelected == "Lead") ? this.state.serviceSelected : null;
        
        this.props.signupUser(payload, this.props.history);
      }else {
        this.setState({ddErrorCN: "dd-red-border"});
      }
    }

    renderAlert() {
      let { errorMessage, isloading } = this.props,
      isError = errorMessage && errorMessage.signup && !isloading;
  
      return (
        <div className={isError ? "error-container auth-error-show" : "error-container auth-error-hide"}>
          { isError ? "Oops! "+ errorMessage.signup : "" }
        </div>
      )
    }

    _roleClicked(role, e) {
      e.preventDefault();
      if(role=="Developer" || role=="Lead") {
        this.setState({
           roleSelected: role,
           isDev: true,
        });
      }else {
         this.setState({
           roleSelected: role,
           isDev: false,
           serviceSelected:null
        });
      }
    }

    _serviceClicked(service, e) {
      e.preventDefault();
      this.setState({
        serviceSelected: service
      });
    }

    _getRoles() {
      let _this = this;
      
      return this.state.roles.map( (role, index) => {
        if(_this.state.roleSelected == role)
          return (
            <button key={index}
              className="but active" >{role}</button>
          )
        else
          return (
            <button key={index}
              className="but"
              onClick={_this._roleClicked.bind(_this, role)}>{role}</button>
          )
      })
    }

    _updateState(element) {
      if(element!=null){
        this.setState({value: element.value, serviceSelected:element.value, ddErrorCN: "dd-green-border"});
      }else if(element==null) {
        let property = "";
        this.setState({value:property, serviceSelected: "", ddErrorCN: "dd-red-border"});
      }
    }

    _getServices() {
      let _this = this;
      if(this.state.isDev) {
        if(this.props.isfetching)
          return(
             <div>Loading...</div>
          )
        else {
          const options = this.props.categories.map( (service, index) => {
            return ({value: service._id, label: service.category})
          });
          return (
            <Select
                name="ServiceCategory"
                value={this.state.value}
                placeholder="Select Category"
                searchable={false}
                options={options}
                clearable={this.state.value.length > 0}
                className={"serviceDropdown "+ this.state.ddErrorCN}
                onChange={this._updateState.bind(this)}
            />
          )
        }
      }
    }


    render() {
      const { handleSubmit, isloading } = this.props;
      let _this = this;
      return (
        <section className="intro">
          <div className="col-md-6 left  hidden-xs hidden-sm">
          </div>

          <div className="col-md-6 col-sm-12 right">
            <div id="logo">
              <b>FACTORY</b>
              <br/>MANAGER
            </div>

            <div className="GetAccount">
              <h2>Get your own account.</h2>
              <h3>Sign Up. Theres more behind the Star.</h3>
              {
                /* Error Message */
                this.renderAlert()
                
              }
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
                    placeholder="IBM w3id / Email"
                    className="email"/>

                  <div id="role">Which role fits you best?</div>

                  <div className="buttons">
                    {_this._getRoles()}
                  </div>

                  <div className="buttons">
                    {_this._getServices()}
                  </div>

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
                  <div style={{position: "relative"}}>
                    <input type="submit" value="Sign Up" className="btn btn-default Sign" />
                    { isloading && <Loader /> }
                  </div>
                </div>
              </form>
            </div>
            <div className="end">
              <span>Already have an account? <Link to={'/signin'}>Sign In</Link></span>
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
    errors.password = "minimum 8 characters";
  }

  if(props.password !== props.passwordConfirm) {
    errors.passwordConfirm = "passwords don't match";
  }

  return errors;
};


function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    categories: state.auth.categories,
    isfetching: state.auth.isfetching,
    isloading: state.auth.isloading
  };
}

let actions = { getCategories, signupUser };

const form = reduxForm({ form: 'signup', validate });
export default connect(mapStateToProps, actions)(form(Signup));
