import { Post } from "@prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostCreateArgs {
  post: {
    title: string;
    content: string;
  };
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | null;
}

export const postResolvers = {
  postCreate: async (
    _parent: any,
    { post }: PostCreateArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access",
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "title and content are required",
          },
        ],
        post: null,
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });

    return {
      userErrors: [],
      post: newPost,
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostCreateArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    const { title, content } = post;

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need at least title or content to update post",
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "post not found",
          },
        ],
        post: null,
      };
    }

    // let payloadToUpdate = {
    //   title,
    //   content,
    // };

    // if(!title) delete payloadToUpdate.title
    // if(!content) delete payloadToUpdate.content

    const updatedPost = await prisma.post.update({
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
      },
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post: updatedPost,
    };
  },
  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType | null> => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access",
          },
        ],
        post: null,
      };
    }

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post not found",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return null;
  },

  postPublish: async (_: any, { postId }: {postId: string}, { prisma, userInfo }: Context) => {

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access",
          },
        ],
        post: null,
      };
    }

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post not found",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    const UpdatedPost = await prisma.post.update({data: { published: true }, where: {
      id: Number(postId)
    }})

    return {
      userErrors: [],
      post: UpdatedPost,
    };

  },

  postUnpublish: async (_: any, { postId }: {postId: string}, { prisma, userInfo }: Context) => {

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access",
          },
        ],
        post: null,
      };
    }

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post not found",
          },
        ],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    const UpdatedPost = await prisma.post.update({data: { published: false }, where: {
      id: Number(postId)
    }})

    return {
      userErrors: [],
      post: UpdatedPost,
    };

  }
};
