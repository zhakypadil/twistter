// react modules
import React, {Component} from 'react';
import { Button, Card, Col, Container,  Jumbotron, Row, Image, InputGroup, FormControl } from 'react-bootstrap';
// aws modules
import { Auth } from 'aws-amplify';
// components
import DBOps from '../DBOps.js'
import { searchUser, getUserPosts } from '../DBOps.js'
import Navbar from '../components/Navbar.js';
import FollowList from '../components/FollowList.js';
import Post from '../components/Post.js';
import { UsernameContext } from '../UsernameContext.js';

class Homepage extends Component {
    constructor(props){
        // props and stats
        super(props)
        this.state = {
            username    : '',
            sort        : 'time',
            filterText  : '',
            filterTopic : '',
            myposts     : []
        }
        // bind functions
        this.showPosts = this.showPosts.bind(this);
		this.handleChangeSort = this.handleChangeSort.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
		this.handleChangeTopic = this.handleChangeTopic.bind(this);
    }

    showPosts(props){
		if (this.state.myposts.length > 1) {
            if (this.state.sort === 'time') {
                console.log("Sorting posts by time posted");
    			this.state.myposts.sort((a,b) => a.timestamp - b.timestamp);
            }
            else if (this.state.sort === 'relevancy') {
                console.log("Sorting posts by relevancy to user");
            }
            else if (this.state.sort === 'potential') {
                console.log("Sorting posts by potential for engagement");
            }
        }
		return (
			<ul>{this.state.myposts}</ul>
		)
	}

	handleChangeSort(event){
		this.setState({ sort: event.target.value });
		console.log("Set sort state to :" + event.target.value);
	}

	handleChangeText(event){
		this.setState({ filterText: event.target.value });
		console.log("Set filterText state to :" + event.target.value);
	}

	handleChangeTopic(event){
		this.setState({ filterTopic: this.state.filterText });
		console.log("Set filterTopic state to :" + this.state.filterText);
    }

    async componentDidMount(){
        console.log("Context test:", this.context.username);
		var user = await Auth.currentAuthenticatedUser({ bypassCache: true });
        if(user.username !== null) {
            console.log("Getting user posts for user");
            this.setState({myposts: [
                <Post/>,<Post/>,<Post/>
            ]})
        }
    }
    
    render() {

        const { name, url} = this.state

        return (
        		<Row>
            		<Col>
                		<Navbar username={this.context.username}></Navbar>
            		</Col>

            		<Col
                		xs={6}>
                		<Container
                    		className="My homepage">
                    		<Jumbotron>
                                <h1>Twistter7</h1>
                    		</Jumbotron>
                		</Container>

                		<Container
                    		className="timeline">
                    		<Jumbotron>
								<h3>Your Timeline</h3>
								<hr/>
								<label>
									{"Sort by: "}
									<select onChange = {this.handleChangeSort}>
										<option value="time">Time Posted</option>
										<option value="relevancy">Relevancy</option>
										<option value="potential">Engagement Potential</option>
									</select>
								</label>
								<hr/>
								<label>
									{"Filter by: "}
									<input type="text" placeholder="insert topic here" onChange={this.handleChangeText}/>
									<button type="submit" onClick={this.handleChangeTopic}>Submit</button>
								</label>
								<hr/>
								<this.showPosts/>
                    		</Jumbotron>
                		</Container>
            		</Col>

            		<Col>
            			<FollowList username={this.context.username}></FollowList>
            		</Col>
      		</Row>
    );
  }
}
Homepage.contextType = UsernameContext;
export default Homepage;