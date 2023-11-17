
import { Context } from '../index';
export const Profile =  {
    user: async ({ userId }: {userId: string}, _: any, { prisma}: Context) => {
        return await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })
    }
}

