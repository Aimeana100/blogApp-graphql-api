
import { Context } from '../index';
import { userLoader } from '../loaders/userLoader';
export const Post =  {
    user: async ({ authorId }: {authorId: any}, _: any, { }: Context) => {
        return userLoader.load(authorId)
    }
}
