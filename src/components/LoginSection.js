/*global FB*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


class LoginSection extends Component {

	componentDidMount () {
    window.fbAsyncInit = function() {
    FB.init({
      appId      : '1989994904580955',
      cookie     : true,  // enable cookies to allow the server to access
                        // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.1' // use version 2.1
    });

  FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }.bind(this);

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

  testAPI = () => {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
  console.log('Successful login for: ' + response.name);
  });
}

statusChangeCallback = (response) => {

  let userDetails = {
    userId : response.authResponse.userID
  };

  if (response.status === 'connected') {
    FB.api('/me', (resp) => {
      userDetails.name = resp.name;
      this.props.history.push({
        pathname: '/books',
        search: '?query=abc',
        state: { detail: userDetails }
      })
    });
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
  }
}

 checkLoginState = () => {
  FB.getLoginStatus(function(response) {
  	console.log('Response ' + JSON.stringify(response, null ,3));
    this.statusChangeCallback(response);
  }.bind(this));
}

 handleClick = () => {
  FB.login(this.checkLoginState());
}

render() {
	return(
		<div>
		<button><a onClick={this.handleClick}>Login</a></button>
		</div>
		)
}

static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

}

const LoginWithRouter = withRouter(LoginSection);
export default LoginWithRouter;