import { ApolloServer } from "apollo-server";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma, PrismaClient } from "@prisma/client";

import { typeDefs } from "./schema";
import { Query, Mutation, Profile, Post, User} from "./resolvers";
import { userFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo: {
    userId: number
  }| null
}

const server = new ApolloServer({
  typeDefs,
  resolvers: { Query, Mutation, Profile, Post, User},
  context: ({req}) => {
    
    const token = req.headers.authorization;
    let userInfo = null
    if(token){
       userInfo = userFromToken(token);
    }
    return  { prisma, userInfo } 
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
