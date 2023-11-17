
import { Context } from '../index';
export const User =  {
    posts: async ({ id }: {id: number},pagenate :{skip: number, take: number}, { prisma, userInfo}: Context) => {

        if(userInfo?.userId === id){
            return await prisma.post.findMany({
                where: {
                    authorId: Number(id),
                },
                orderBy: [{
                    createdAt: "desc"
                }],
                ...pagenate
            })
        }else{
            return await prisma.post.findMany({
                where: {
                    authorId: Number(id),
                    published: true
                },
                orderBy: [{
                    createdAt: "desc"
                }],
                ...pagenate
            })
        }

    }
}

