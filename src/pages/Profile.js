// react modules
import React, { Component } from 'react';
import { Button, Card, Col, Container,  Jumbotron, Row, Image, InputGroup, FormControl } from 'react-bootstrap';
// aws modules
import { Auth } from 'aws-amplify';
// components
import { searchUser } from '../DBOps.js'
import Navbar from '../components/Navbar.js';
import FollowList from '../components/FollowList.js';
import Post from '../components/Post.js';
import { UsernameContext } from '../UsernameContext.js';
class Profile extends Component {

    constructor(props){
        //props and stats
        super(props)
        this.state = {
            name        : '',
			username    : '',
			sort		: 'time',
			filterText	: '',
			filterTopic	: '',
			myposts		: [],
			url         : 'https://vyshnevyi-partners.com/wp-content/uploads/2016/12/no-avatar-300x300.png'
        }
		// bind functions
		this.showPosts = this.showPosts.bind(this);
		this.handleChangeSort = this.handleChangeSort.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
		this.handleChangeTopic = this.handleChangeTopic.bind(this);
	}
	
	showPosts(props){
		if (this.state.myposts.length > 1)
			this.state.myposts.sort((a,b) => a.timestamp - b.timestamp);
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
		console.log('Context test 2:', this.context.username);
			var user = await Auth.currentAuthenticatedUser({ bypassCache: true });
	  //  this.setState({username: user.username});
        if( user.attributes.hasOwnProperty('picture') ){ this.setState({url : user.attributes.picture}); }
		if( user.attributes.hasOwnProperty('name'   ) ){ this.setState({name: user.attributes.name   }); }
		if(user.username !== null) {
			console.log("Getting posts by ${user.username}");
			searchUser(user.username).then((res) => {
				console.log("User info: ");
				console.log(res.data.getUser.posts.items);
				if (!(res.data.getUser === null) && res.data.getUser.posts.items.length > 0){
					this.setState({myposts:[]},()=>{
						this.setState({ myposts: res.data.getUser.posts.items.map( post => <Post key={post.id} id={post.id}/>)});
					})
					
				}
			})
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
                    		className="My profile">
                    		<Jumbotron>
                        		<Card style={{width: '18rem'}}
                            	className="bg-dark text-black">
                            	<Card.Img
                                	src={url}
                            	/>
                        		</Card>
                        		<h1>{name}</h1>
                        		<h2>@{this.context.username}</h2>
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
Profile.contextType = UsernameContext;
export default Profile;
