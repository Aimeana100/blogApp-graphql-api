import { Post } from "@prisma/client";
import { Context } from "../";

export const Query = {
  posts: async (
    _parent: any,
    {skip, take}: {skip: number, take: number},
    { prisma }: Context
  ): Promise<Post[]> => {

    const posts = prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" }],
      skip,
      take
    });
    return posts;
  },
  me: (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
    return profile;
  },
};
