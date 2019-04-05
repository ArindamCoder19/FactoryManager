import React,{ Component } from 'react' ;
import { reduxForm, Field } from 'redux-form' ;
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Loader from '../../general/Loader';
import { signinUser }  from '../../../actions/auth' ;

const renderInput = field => {
  const { input, type , placeholder, meta: {error, touched}, className} = field;
  return (
    <div className={ ` ${touched ? 'has-success' : ''}` +` ${touched && error ? 'has-error' : ''}`}>
      <span className="email-img"></span>
      <input {...input} type={type} placeholder={placeholder} className={className} required />
    </div>
  );
}

class Signin extends Component{
  constructor(props) {
   super(props);
   this.handleFormSubmit = this.handleFormSubmit.bind(this);
 }

  handleFormSubmit(props){
    this.props.signinUser(props, this.props.history);
  }

  renderAlert() {
    let { errorMessage, isloading } = this.props,
    isError = errorMessage && errorMessage.signin && !isloading;

    return (
      <div className={isError ? "error-container auth-error-show" : "error-container auth-error-hide"}>
        { isError ? "Oops! "+ errorMessage.signin : "" }
      </div>
    )
  }

  render() {
  let { handleSubmit, isloading } = this.props,
      
      now = moment(),
      greetings = now.hour() < 12 ? 'Good Morning' : (now.hour() < 18 ? 'Good Afternoon' : 'Good Evening');

  return (
    <section className="intro">
      <div className="col-md-6 left hidden-xs hidden-sm">

      </div>

      <div className="col-md-6 col-sm-12 right">
        <div id="logo">
          <b>FACTORY</b>
          <br/>MANAGER
        </div>
        <div className="greeting">
          <h2>{greetings}! Welcome Back.</h2>
          <h3>Sign In.</h3>

          {
            /* Error Message */
            this.renderAlert()
            
          }
          
          <div className="login">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <div className="inputs">
                <Field name="email"
                  type="email"
                  component={renderInput}
                  placeholder="IBM w3id / Email"
                  className="form-control email"
                />
                <Field name="password"
                  type="password" component={renderInput}
                  placeholder="Password"
                  className="form-control password"
                />
                <div className="forgot">
                  <Link to="/reset-password">Forgot Password?</Link>
                </div>
                <div style={{position: "relative"}}>
                  <input type="submit" name="login" value="Sign in" className="btn btn-default Sign" />
                  {isloading && <Loader />}
                </div>
              </div>
            </form>
          </div>
        </div>
      <div className="end">
        <span>New User? <Link to={'/signup'}>Sign Up</Link> </span>
      </div>
    </div>
   </section>
  );
}
}




function mapStateToProps(state) {
    return {
        errorMessage: state.auth.error,
        isloading: state.auth.isloading
     };
}

let actions = { signinUser };

Signin = connect(mapStateToProps, actions)(Signin);

Signin = reduxForm({
 form: 'signin'
})(Signin);
export default connect(mapStateToProps, actions)(Signin);
