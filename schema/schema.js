const graphql = require("graphql");
var _ = require('lodash');

const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');
const Credit_Score = require('../model/credit_score');
const Product = require('../model/product');


// mongo compass: 
// mongodb+srv://reza-fer:0wrG929kjhROQ81c@cluster0-ykmvi.mongodb.net/test

//dummy data:
let usersData = [
  { id: "1", name: "Bond", professional: "doctor", age: 36 },
  { id: "2", name: "Anna", professional: "Electrical Engineer", age: 26 },
  { id: "3", name: "Bella", professional: "Software Developer", age: 16 },
  { id: "4", name: "Gina", professional: "Nurse", age: 26 },
  { id: "5", name: "Georgina", professional: "Data Scientist", age: 36 }
];
//dummy Hobbies:
let hobbiesData = [
  { id: "21", title: "playing music", description: "I am a beginner harmonica player", userId: "1" },
  { id: "22", title: "playing futsal", description: "I play futsal once a week", userId: "2" },
  { id: "23", title: "coding", description: "I like to code", userId: "2" },
  { id: "24", title: "eating", description: "food is my life", userId: "4" },
  { id: "25", title: "Reading", description: "Book is my life", userId: "150" },
];
//dummy Post:
let postData = [
  { id: "31", comment: "I like Emmily", userId: "2" },
  { id: "32", comment: "I can make her happy", userId: "2" },
  { id: "33", comment: "She is cute", userId: "3" },
  { id: "34", comment: "She will reply me back", userId: "4" },
  { id: "35", comment: "She is not nice", userId: "5" },
]

//dummy Credit_score:
let credit_scoreData = [
  { id: "41", risk_level: "M", score: 559, userId: "1" },
  { id: "42", risk_level: "H", score: 150, userId: "2" },
  { id: "43", risk_level: "L", score: 790, userId: "3" },
  { id: "44", risk_level: "H", score: 200, userId: "4" },
  { id: "45", risk_level: "L", score: 923, userId: "5" },
];
//dummy Product:
let productData = [
  { id: "51", card_number: "1234 2341 2394 0343", item: "Visa - Debit", userId: "2" },
  { id: "52", card_number: "8390 0230 8403 1234", item: "MasterCard - Gold", userId: "2" },
  { id: "53", card_number: "0903 1234 9203 8490", item: "AmericVisa Credit", userId: "5" },
  { id: "54", card_number: "1425 2345 2356 2124", item: "MasterCard - Gold", userId: "4" },
  { id: "55", card_number: "1234 1234 1234 0988", item: "International debit card", userId: "5" },
]

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
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
    //
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return _.filter(postData, { userId: parent.id })
        return Post.find({ userId: parent.id })
      }
    },
    //
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id })
        return Hobby.find({ userId: parent.id })
      }
    },
    //
    credit_scores: {
      type: new GraphQLList(Credit_ScoreType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id })
        return Credit_Score.find({ userId: parent.id })
      }
    },
    //
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        // return _.filter(postData, { userId: parent.id })
        return Product.find({ userId: parent.id })
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
//creditscore ++++++++++++++++++++++++++++++++++++
const Credit_ScoreType = new GraphQLObjectType({
  name: "Credit_Score",
  description: "Credit Score",
  fields: () => ({
    id: { type: GraphQLID },
    risk_level: { type: GraphQLString },
    score: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId })
        return User.findById(parent.userId)
      }
    }
  })
})

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "Product Description",
  fields: () => ({
    id: { type: GraphQLID },
    card_number: { type: GraphQLString },
    item: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId })
        return User.findById(parent.userId);
      }
    },
  })
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    credit_score: {
      type: Credit_ScoreType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return data for our hobby
        // return _.find(hobbiesData, { id: args.id })
        return Credit_Score.findById(args.id)
      }
    },
    credit_scores: {
      type: new GraphQLList(Credit_ScoreType),
      resolve(parent, args) {
        // return hobbiesData;
        return Credit_Score.find();
      }
    },

    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return post data
        // return _.find(postData, { id: args.id })
        return Product.findById(args.id);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        // return postData;
        return Product.find();
      }
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++
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


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // create credit_score:
    createCredit_Score: {
      type: Credit_ScoreType,
      args: {
        // id: { type: GraphQLID },
        risk_level: { type: new GraphQLNonNull(GraphQLString) },
        score: { type: GraphQLInt },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let credit_score = new Credit_Score({
          risk_level: args.risk_level,
          score: args.score,
          userId: args.userId
        })
        credit_score.save();
        return credit_score;
      }
    },
    // update credit_score:
    updateCredit_Score: {
      type: Credit_ScoreType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        risk_level: { type: new GraphQLNonNull(GraphQLString) },
        score: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return Credit_Score.findByIdAndUpdate(
          args.id,
          {
            $set: {
              risk_level: args.risk_level,
              score: args.score,
            }
          },
          { new: true }
        )
      }
    },

    // remove credit_score:
    removeCredit_Score: {
      type: Credit_ScoreType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedCredit_Score = Credit_Score.findByIdAndRemove(
          args.id
        ).exec();
        if (!removedCredit_Score) throw new ("Error");
        return removedCredit_Score;
      }
    },

    // create product:
    createProduct: {
      type: ProductType,
      args: {
        card_number: { type: new GraphQLNonNull(GraphQLString) },
        item: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let product = new Product({
          card_number: args.card_number,
          item: args.item,
          userId: args.userId
        })
        product.save();
        return product;
      }
    },
    // Update the post:
    updateProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        card_number: { type: new GraphQLNonNull(GraphQLString) },
        item: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Product.findByIdAndUpdate(
          args.id,
          {
            $set: {
              card_number: args.card_number,
              item: args.item,
              // userId: args.userId NOTE - we don't need to upddate the userId!!!
            }
          },
          { new: true }
        )
      },
    },
    // Remove Post:
    removeProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let removedProduct = Product.findByIdAndRemove(
          args.id
        ).exec();
        if (!removedProduct) throw new ("Error");
        return removedProduct;
      }
    },
    //+++++++++++++++++++++++++++++++++++++++++
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
