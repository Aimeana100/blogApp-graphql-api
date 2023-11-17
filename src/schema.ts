import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    posts(skip: Int!, take: Int! ): [Post]!
    profile(userId: ID!): Profile

  }

  type Mutation {
    postCreate (post : PostInput!): PostPayload!
    postUpdate (postId: ID!, post : PostInput!): PostPayload!
    postDelete(postId: ID) : Boolean!
    postPublish(postId: ID!) : PostPayload! 
    postUnpublish(postId: ID!) : PostPayload!
    signUp(user : SignUpInput!) : AuthPayload!
    signIn(credentials: CredentialInput!) : AuthPayload
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    authorId: ID!
    user : User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts(skip: Int!, take: Int! ): [Post]
  }

  type Profile {
    id: ID!
    bio: String!
    userId: ID!
    user: User!
  }
  
  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }
  type AuthPayload{
    userErrors: [UserError!]!
    user: User
    token: String
  }

  input PostInput {
    title: String
    content: String
  }
  input SignUpInput{
    credentials : CredentialInput!
    name: String
    bio: String
  }

  input CredentialInput {
    email: String!
    password: String!
  }
  `;
