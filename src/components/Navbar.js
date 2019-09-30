// react modules
import React, { Component, } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router"
// aws modules
import { Auth } from 'aws-amplify';

class Navbar extends Component {

	constructor(props){
		// props and states
    	super(props);
    	// bind functions
	  //  this.displayUserAttributes 	=	this.displayUserAttributes	.bind(this);
	    this.deleteUser				=	this.deleteUser				.bind(this);
  	}

  	// async displayUserAttributes(){
  	// 	// get user info and log it
  	// 	var user = await Auth.currentAuthenticatedUser({ bypassCache: true });
  	// 	console.log(user.attributes);
  	// }

  	async deleteUser(){

  		Auth
            .currentAuthenticatedUser()
            .then((user: CognitoUser) => new Promise((resolve, reject) => {
                user.deleteUser(error => {
                    if (error) {
                        return reject(error);
                    }
                    if (this.props.onSessionChange) {
                        this.props.onSessionChange();
                    }
                    document.location.href = "/login";

                    resolve();
                });
            }))
            .catch(this.onError);
  	}

	render() {

    	return(
    		<Jumbotron>
    			<h2>Navbar</h2>
    			<Link
    				to= '/'
    				paddingTop="50px">
	  				<Button
	  					variant="secondary"
	  					size="md"
	  					block>
	    				Profile
	  				</Button>
    			</Link>
    			<Link
    				to= '/settings'
    				paddingTop="50px">
	  				<Button
	  					variant="secondary"
	  					size="md"
	  					block>
	    				Settings
	  				</Button>
  				</Link>
          <Link
            to= '/'
            paddingTop="50px">
            <Button
              variant="secondary"
              size="md"
              onClick={(e) => Auth.signOut()}
              block>
              Log Out
            </Button>
          </Link>
  				<Button
  					variant="secondary"
  					size="md"
  					onClick ={this.deleteUser}
  					block>
    				Delete User
  				</Button>
    		</Jumbotron>
    	);
  	}
}

export default Navbar;
