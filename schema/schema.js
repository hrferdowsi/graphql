const graphql = require("graphql");
var _ = require('lodash');

const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');


// mongo compass: 
// mongodb+srv://reza-fer:0wrG929kjhROQ81c@cluster0-ykmvi.mongodb.net/test

//dummy data:
let usersData = [
  { id: "1", name: "Bond", professional: "doctor", age: 36 },
  { id: "13", name: "Anna", professional: "Electrical Engineer", age: 26 },
  { id: "211", name: "Bella", professional: "Software Developer", age: 16 },
  { id: "19", name: "Gina", professional: "Nurse", age: 26 },
  { id: "150", name: "Georgina", professional: "Data Scientist", age: 36 }
];
//dummy Hobbies:
let hobbiesData = [
  { id: "21", title: "playing music", description: "I am a beginner harmonica player", userId: "1" },
  { id: "22", title: "playing futsal", description: "I play futsal once a week", userId: "13" },
  { id: "23", title: "coding", description: "I like to code", userId: "13" },
  { id: "24", title: "eating", description: "food is my life", userId: "19" },
  { id: "25", title: "Reading", description: "Book is my life", userId: "150" },
];
//dummy Post:
let postData = [
  { id: "31", comment: "I like Emmily", userId: "13" },
  { id: "32", comment: "I can make her happy", userId: "13" },
  { id: "33", comment: "She is cute", userId: "211" },
  { id: "34", comment: "She will reply me back", userId: "19" },
  { id: "35", comment: "She is not nice", userId: "150" },
]

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

//create types:
const UserType = new GraphQLObjectType({
  name: "User", //property of graphQL object
  description: "This is inside User type description",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    professional: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return _.filter(postData, { userId: parent.id })
        return Post.find({ userId: parent.id })
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id })
        return Hobby.find({ userId: parent.id })
      }
    },
  })
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "This is inside Hobby Type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId })
        return User.findById(parent.userId)
      }
    }
  })
})

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Post Description",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId })
        return User.findById(parent.userId);
      }
    },
  })
})
// RootQuery: is actually shows how all the relationships are mapped out
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType", // this name is for documentation
  description: "This is inside RootQuery",
  fields: {
    user: {
      // this what we are using when we send the query
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        //get and return data from the datasource
        // return _.find(usersData, { id: args.id })
        return User.findById(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // return usersData;
        return User.find();
      }
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return data for our hobby
        // return _.find(hobbiesData, { id: args.id })
        return Hobby.findById(args.id)
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData;
        return Hobby.find();
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return post data
        // return _.find(postData, { id: args.id })
        return Post.findById(args.id);
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return postData;
        return Post.find();
      }
    },
  }
});

//Mutation:
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // create User:
    createUser: { //naming convention create user
      type: UserType,
      args: {
        // id:{type: GraphQLID}
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        professional: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          professional: args.professional
        })
        user.save();
        return user;
      }
    },
    // Update User:
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        professional: { type: GraphQLString }
      },
      resolve(parent, args) {
        return User.findByIdAndUpdate(args.id, {
          $set: {
            name: args.name,
            age: args.age,
            professional: args.professional
          }
        },
          { new: true } //send back the updated objectType
        )
      }
    },
    // Remove User:
    removeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(
          args.id
        ).exec();
        if (!removedUser) throw new ("Error");
        return removedUser;
      }
    },
    // create post:
    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let post = new Post({
          comment: args.comment,
          userId: args.userId
        })
        post.save();
        return post;
      }
    },
    // Update the post:
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
              // userId: args.userId NOTE - we don't need to upddate the userId!!!
            }
          },
          { new: true }
        )
      },
    },
    // Remove Post:
    removePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(
          args.id
        ).exec();
        if (!removedPost) throw new ("Error");
        return removedPost;
      }
    },
    // create hobby:
    createHobby: {
      type: HobbyType,
      args: {
        // id: { type: GraphQLID },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId
        })
        hobby.save();
        return hobby;
      }
    },
    // update hobby:
    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            }
          },
          { new: true }
        )
      }
    },

    // Remove Hobby:
    removeHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(
          args.id
        ).exec();
        if (!removedHobby) throw new ("Error");
        return removedHobby;
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
