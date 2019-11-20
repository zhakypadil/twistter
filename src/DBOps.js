import { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';

const userCreationTemplate = `mutation createUser($id: ID!) {
    createUser(input:{
        id: $id
    }) {
        id
    }
}`

const getFollowersTemplate = `query getUser($id: ID!) {
    getUser(id: $id){
        followers{
            items{
                id
            }
        }
    }
}`

const getFollowingTemplate = `query getUser($id: ID!) {
    getUser(id: $id){
        following{
            items{
                id
            }
        }
    }
}`

const userSearchTemplate = `query getUser($id: ID!) {
    getUser(
        id: $id
    ){
        id
        image
        likes {
            items {
                id
            }
        }
        interests {
            items {
                id
            }
        }
        following {
            items {
                id
            }
        }
        followers {
            items {
                id
            }
        }
        posts {
            items {
                id
                text
                timestamp
                author {
                    id
                }
                topics {
                    items {
                        id
                    }
                }
                quote {
                    id
                }
                quoted {
                    items {
                        id
                    }
                }
            }
        }
        notifications {
            items {
                id
                user {
                    id
                }
                text
                timestamp
            }
        }
    }
}`

const userDeletionTemplate = `mutation deleteUser($id: ID!) {
    deleteUser(input: {
        id: $id
    }) {
        id
    }
}
`

const followCreateTemplate = `mutation createFollow(
    $id: ID!,
    $followFollowerId: ID!,
    $followFolloweeId: ID!
    ) {
    createFollow(input: {
        id: $id,
        followFollowerId: $followFollowerId,
        followFolloweeId: $followFolloweeId
    }) {
        id
        followee {
            id
        }
        follower {
            id
        }
    }
}
`

const followDeleteTemplate = `mutation deleteFollow($id: ID!) {
    deleteFollow (input: {
        id: $id
    }){
        id
        followee {
            id
        }
        follower {
            id
        }
    }
}
`

const postCreateTemplate = `mutation createPost(
        $text: String!,
        $timestamp: Int!,
        $postAuthorId: ID!
    ) {
        createPost (input:{
        text: $text,
        timestamp: $timestamp,
        postAuthorId: $postAuthorId
    }){
        id,
        text,
        timestamp,
        author {
            id
        }
    }
}`

const postSearchTemplate = `query getPost(
    $id: ID!
  ) {
  getPost (id: $id){
    id,
    text,
    timestamp,
    author {
      id
    }
    likes {
      items {
        id
      }
    }
    topics {
      items {
        id
        post {
          id
        }
        topic {
          id
        }
      }
    }
  }
}`

const notifCreateTemplate = `mutation createNotification(
  $userid: ID!,
  $text: String!,
  $time: Int!
) {
  createNotification(input: {
    notificationUserId: $userid,
    text: $text,
    timestamp: $time
  }) {
    id
    user {
      id
    }
    text
    timestamp
  }
}`

const notifDeleteTemplate = `mutation deleteNotification(
  $id: ID!
) {
  deleteNotification(input: {
    id: $id
  }) {
    id
    user {
      id
    }
    text
    timestamp
  }
}`

const notifSearchTemplate = `query getNotification(
  $id: ID!
) {
  getNotification(
    id: $id
  ) {
    id
    user {
      id
    }
    text
    timestamp
  }
}`

const createTopicTemplate = `mutation createTopic(
  $id: ID!
) {
  createTopic(input: {
    id: $id
  }) {
    id
  }
}
`

const searchTopicTemplate = `query searchTopic(
  $id: ID!
) {
  getTopics(id: $id) {
    id
    posts {
      items {
        post {
          id,
          text,
          timestamp,
          author {
            id
          }
          likes {
            items {
              id
            }
          }
          topics {
            items {
              id
            }
          }
        }
      }
    }
  }
}
`

/* To be added to search Topic
quote{
  id
}
quoted {
  items {
    id
  }
}

*/

const createTagTemplate = `mutation createTag(
  $tagTopicId: ID!,
  $tagPostId: ID!
) {
  createTag(input: {tagTopicId: $tagTopicId, tagPostId: $tagPostId}) {
    id
    post {
      id
    }
    topic {
      id
    }
  }
}`

const createLikeTemplate = `mutation createLike(
  $id: ID!,
  $user: ID!,
  $post: ID!
) {
  createLike(input: {
    id: $id,
    likeLikerId: $user,
    likeLikeeId: $post
  }) {
    id
  }
}`

const deleteLikeTemplate = `mutation deleteLike(
  $id: ID!
) {
  deleteLike(input: {
    id: $id
  }) {
    id
  }
}`

const createEngagementTemplate = `mutation createEngagement(
  $id: ID!,
  $value: Int!,
  $topicid: ID!,
  $userid: ID!
) {
  createEngagement(input: {
    id: $id,
    value: $value,
    engagementTopicId: $topicid,
    engagementUserId: $userid
  }) {
    id
    value
  }
}`

const updateEngagementTemplate = `mutation updateEngagement(
  $id: ID!,
  $value: Int!
) {
  updateEngagement(input: {id: $id, value: $value}) {
    id
    value
  }
}`

const getEngagementTemplate = `query getEngagement(
  $id: ID!
) {
  getEngagement(id: $id) {
    id
    value
  }
}`



class DBOps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      text: "",
      timestamp: 0
    }
    this.return_value = null;
  }
  /***** BEGIN CREATE USER FUNCTIONS *****/

  createUser = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(userCreationTemplate, info));
      return temp.data.createUser;
    } catch (e) {
      return e.data;
    }
  }


  /***** END CREATE USER FUNCTIONS *****/

  /***** BEGIN SEARCH USER FUNCTIONS *****/

  searchUser = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(userSearchTemplate, info));
      return temp.data;
    } catch (e) {
      return e.data;
    }
  }

  /***** END SEARCH USER FUNCTIONS *****/

  /***** BEGIN DELETE USER FUNCTIONS *****/

  deleteUser = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(userDeletionTemplate, info));
      return temp.data.deleteUser;
    } catch (e) {
      return e.data;
    }
  }

  /***** END DELETE USER FUNCTIONS *****/

  /***** BEGIN CREATE FOLLOW FUNCTIONS *****/

  createFollow = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(followCreateTemplate, info));
      return temp.data.createFollow;
    } catch (e) {
      return e.data;
    }
  }

  /***** END CREATE FOLLOW FUNCTIONS *****/

  /***** BEGIN UNFOLLOW FUNCTIONS *****/

  deleteFollow = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(followDeleteTemplate, info));
      return temp.data.deleteFollow;
    } catch (e) {
      return e.data;
    }
  }

  /***** END UNFOLLOW FUNCTIONS *****/

  /***** BEGIN CREATE POST FUNCTIONS *****/

  createPost = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(postCreateTemplate, info));
      return temp.data.createPost;
    } catch (e) {
      return e.data;
    }
  }

  /***** END CREATE POST FUNCTIONS *****/

  /***** BEGIN SEARCH POST FUNCTIONS *****/

  searchPost = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(postSearchTemplate, info));
      return temp.data.getPost;
    } catch (e) {
      return e.data;
    }
  }

  /***** END SEARCH POST FUNCTIONS *****/

  /***** CREATE NOTIFICATION *****/

  createNotification = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(notifCreateTemplate, info));
      return temp.data;
    } catch (e) {
      return e.data;
    }
  }

  /***** END CREATE NOTIFICATION *****/

  /***** SEARCH NOTIFICATION *****/

  searchNotification = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(notifSearchTemplate, info));
      return temp.data;
    } catch (e) {
      return e.data;
    }
  }

  /***** END SEARCH NOTIFICATION *****/

  /***** DELETE NOTIFICATION *****/

  deleteNotification = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(notifDeleteTemplate, info));
      return temp.data.deleteNotification;
    } catch (e) {
      return e.data;
    }
  }

  /***** END DELETE NOTIFICATION *****/

  /***** CREATE TOPIC *****/

  createTopic = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(createTopicTemplate, info));
      return temp.data;
    } catch (e) {
      return e.data;
    }
  }

  /***** END CREATE TOPIC *****/

  /***** SEARCH TOPIC *****/

  searchTopic = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(searchTopicTemplate, info));
      return temp;
    } catch (e) {
      return e;
    }
  }

  /***** END SEARCH TOPIC *****/

  /***** CREATE TAG *****/

  createTag = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(createTagTemplate, info));
      console.log(temp);
      return temp.data;
    } catch (e) {
      return e;
    }
  }

  /***** END CREATE TAG *****/

  /***** CREATE LIKE *****/

  createLike = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(createLikeTemplate, info));
      console.log(temp);
      return temp.data;
    } catch (e) {
      return e;
    }
  }

  /***** END CREATE LIKE *****/

  /***** DELETE LIKE *****/

  deleteLike = async (info) => {
    var temp;
    try {
      temp = await API.graphql(graphqlOperation(deleteLikeTemplate, info));
      console.log(temp);
      return temp.data;
    } catch (e) {
      return e;
    }
  }

  /***** END CREATE LIKE *****/

}

export function createUser(username){
    return API.graphql(graphqlOperation(userCreationTemplate, JSON.stringify({id:username})));
}

export function searchUser(username) {
    return API.graphql(graphqlOperation(userSearchTemplate, JSON.stringify({id:username})));
}

export function deleteUser(username){
    return API.graphql(graphqlOperation(userDeletionTemplate, JSON.stringify({id: username})));
}

export function createFollow(follower, followee){
	return new Promise((resolve,reject)=>{

		API.graphql(graphqlOperation(followCreateTemplate, JSON.stringify({
        	id: follower+'-'+followee,
        	followFollowerId: follower,
        	followFolloweeId: followee
    	}))).then((res)=>{

    		const res1 = res;

			createNotification(followee,'You have been followed by '+follower)
				.then((res)=>{

					var resObject = {'followResult':res1,'notificationResult':res};
					resolve(resObject);

				},(err)=>{

					var resObject = {'followResult':res1,'notificationResult':err};
					reject(resObject);

				});

    	},(err)=>{
    		reject(err);
    	})
	});
}

export function deleteFollow(follower, followee){
    return API.graphql(graphqlOperation(followDeleteTemplate, JSON.stringify({
        id: follower+'-'+followee
    })));
}

export function createPost(author,topics,text,quoteid=false){
    return new Promise((resolve,reject)=>{
        var month, day, year;
        var today     = new Date();
        var monthNum  = 1 + parseInt(today.getMonth(), 10);
        var dayNum    = parseInt(today.getDate(), 10);
        var yearNum   = parseInt(today.getFullYear(), 10);
        var timeid    = monthNum * 1000000 + dayNum * 10000 + yearNum;

        if(quoteid){

        } else{
            API.graphql(graphqlOperation(postCreateTemplate, JSON.stringify({
                postAuthorId: author,
                timestamp: timeid,
                text: text,
            })))
                .then((res)=>{
                    var postid = res.data.createPost.id
                    for(var i=0; i<topics.length;i++){

                        const topic = topics[i]
                        API.graphql(graphqlOperation(createTopicTemplate, JSON.stringify({
                            id: topic
                        })))
                            .then((res)=>{

                                API.graphql(graphqlOperation(createTagTemplate, JSON.stringify({
                                    tagTopicId: topic,
                                    tagPostId: postid
                                }))).catch((err)=>{
                                        reject(err);
                                    });

                            },(err)=>{

                                if(err.errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException'){

                                    console.log('dbops','create post','topic already exists, ignoring error');

                                    API.graphql(graphqlOperation(createTagTemplate, JSON.stringify({
                                        tagTopicId: topic,
                                        tagPostId: postid
                                    }))).catch((err)=>{
                                        reject(err);
                                    });

                                } else {
                                    console.log('dbops','create post','unhandled error',err);
                                }

                            });
                    }
                    resolve(res)
                },(err)=>{
                    reject(err)
                });
        }
    });
}
export function searchPost(id){
    return API.graphql(graphqlOperation(postSearchTemplate, JSON.stringify({
    	id: id
    })));
}
export function createNotification(userid,text){
    var month, day, year;
    var today     = new Date();
    var monthNum  = 1 + parseInt(today.getMonth(), 10);
    var dayNum    = parseInt(today.getDate(), 10);
    var yearNum   = parseInt(today.getFullYear(), 10);
    var timeid    = monthNum * 1000000 + dayNum * 10000 + yearNum;

    return API.graphql(graphqlOperation(notifCreateTemplate, JSON.stringify({
    	userid: userid,
    	text: text,
    	time: timeid
    })));
}
export function deleteNotification(id){
    return API.graphql(graphqlOperation(notifDeleteTemplate,JSON.stringify({
    	id: id
    })));
}
export function searchNotification(id){
    return API.graphql(graphqlOperation(notifSearchTemplate,JSON.stringify({
    	id: id
    })));
}
export function createTopic(id){
    return API.graphql(graphqlOperation(createTopicTemplate,JSON.stringify({
    	id: id
    })));
}
export function searchTopic(id){
    return API.graphql(graphqlOperation(searchTopicTemplate, JSON.stringify({
      id: id
    })));
}
export function createTag(info){
    return API.graphql(graphqlOperation(createTagTemplate, info));
}
export function createLike(info){
    return API.graphql(graphqlOperation(createLikeTemplate, info));
}
export function deleteLike(info){
    return API.graphql(graphqlOperation(deleteLikeTemplate, info));
}
export function getFollowers(userid){
    return API.graphql(graphqlOperation(getFollowersTemplate, JSON.stringify({id: userid})));
}
export function getFollowing(userid){
    return API.graphql(graphqlOperation(getFollowingTemplate, JSON.stringify({id: userid})));
}
export function createEngagement(info) {
  return API.graphql(graphqlOperation(createEngagementTemplate, JSON.stringify(info)));
}
export function updateEngagement(info) {
  return API.graphql(graphqlOperation(updateEngagementTemplate, JSON.stringify(info)));
}
export function getEngagement(engagementId) {
  return API.graphql(graphqlOperation(getEngagementTemplate, JSON.stringify(engagementId)));
}
export function customQuery(template, params) {
  return API.graphql(graphqlOperation(template, JSON.stringify(params)));
}
export function getFollowInfo(followerid, followeeid){
  return {
    followed: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
    ignored: ['Topic 5', 'Topic 6', 'Topic 7', 'Topic 8'],
    new: ['Topic 9', 'Topic 10']
  };
}
export function updateFollowInfo(followerid, followeeid, followed, ignored){
  return true;
}
export function getFollowedPosts(userid){
  return [
    {
      postid: '0336ce8a-ba43-46b7-bb12-6c581e6f455b',
      relevance: 45,
      pfe: 25,
      timestamp: 10112019,
      newTopics: []
    },
    {
      postid: '0a233038-8dc3-4d4b-bf45-f8ef84424b28',
      relevance: 55,
      pfe: 40,
      timestamp: 2122019,
      newTopics: []
    },
    {
      postid: '434e838b-d2f3-4f57-8679-1da404745d47',
      relevance: 20,
      pfe: 10,
      timestamp: 4252019,
      newTopics: []
    },
    {
      postid: '547f8bac-1685-4121-861e-52f494bc0f97',
      relevance: 15,
      pfe: 15,
      timestamp: 11112019,
      newTopics: []
    },
    {
      postid: '5c507f05-e5cc-40ca-857b-32d98c8f9855',
      relevance: 99,
      pfe: 30,
      timestamp: 8282019,
      newTopics: []
    },
    {
      postid: 'ae9ebccb-1a15-43fb-bf9e-31cb102c0e35',
      relevance: 85,
      pfe: 35,
      timestamp: 7212019,
      newTopics: []
    }
  ]
}
/*
export function deleteLike(postid){
  return true;
}
*/
export function updatePost(postid,text){
  return true;

}
export function deletePost(postid){
  return true;
}

export function getUserPost(userid) {
  const template = `query getUser ($id: ID!){
    getUser(id: $id) {
      posts {
        items {
          id
          timestamp
        }
      }
    }
  }`
  return API.graphql(graphqlOperation(template, JSON.stringify(userid)));
}

export default DBOps;
