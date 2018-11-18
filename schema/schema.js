const _ = require('lodash');
const {
  GraphQLObjectType,
  //imports object constructor
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = require('graphql');
//import methods

const axios = require('axios');

// Launch type
const UserType = new GraphQLObjectType({
  // new o
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

const CompanyType = new GraphQLObjectType({
  // needs to be before usertype
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), //list of users
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  // take query and enter into graph data
  name: 'RootQueryType',
  fields: {
    user: {
      // specify user
      type: UserType,
      args: { id: { type: GraphQLString } }, // query should have a key value of id and a string
      resolve(parentValue, args) {
        //
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
        // return _.find(users, { id: args.id }); // returns object that matches the query
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType, // returning the data type
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { first_name, age }) {
        return axios
          .post('http://localhost:3000/users', { first_name, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:3000/users/${args.id}`);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

// In GraphiQL

// Getting rootQuery
// {
// 	person1: user(id: "3") {
// 	...userDetails
//     company{
// 			...companyDetails
//     }
//   }
// 	person2: user(id: "1") {
// ...userDetails
//     company{
//       ...companyDetails
//     }
// }
// }
// fragment companyDetails on Company {
//   id
//   name
//   description
// }

// fragment userDetails on User {
//    id
//    first_name
//    age
// }

// Mutations

//POST
// mutation {
//   addUser(first_name: "Sang", age: 65){
//     id
//     first_name
//     age
//   }
// }

//DELETE
