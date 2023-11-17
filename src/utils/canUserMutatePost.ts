import { Context } from "../";

interface canUserMutatePost {
  userId: number;
  postId: number;
  prisma: Context["prisma"];
}

export const canUserMutatePost = async ({
  userId,
  postId,
  prisma,
}: canUserMutatePost) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return {
      userErrors: [
        {
          message: "User not found",
        },
      ],
      post: null
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      authorId: userId,
    },
  });

  if (!post) {
    return {
      userErrors: [
        {
          message: "Post not owned by a user",
        },
      ],
      post: null
    };
  }

  return null
};
