import { prisma } from "../config/client";
import { TOTAL_ITEMS_PER_PAGE } from "../config/constant";
//create user
const createUser = async (name: string, email: string, password: string) => {
 const user =  await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });
    return user;
}
//delete user
const deleteUser = async (id: number) => {
    const user = await prisma.user.delete({
        where: { id: +id }
    });
    return user;
}
//update user
const updateUser = async (id: number, name: string, email: string, password: string) => {
    const user = await prisma.user.update({
        where: { id: +id },
        data: {
            name,
            email,
            password
        }
    });
    return user;
}   
//get user by id
const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id: +id }
    });
    return user;
}
//count total users for pagination
const countTotalUsers = async () => {
    const pagesize = TOTAL_ITEMS_PER_PAGE;
    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / pagesize);
    return totalPages;
}
//get all users with pagination
    const getALLUsers = async (page: number) => {
        const pagesize = TOTAL_ITEMS_PER_PAGE;
        const skip = (page - 1) * pagesize;
        const users = await prisma.user.findMany({
            skip,
            take: 3,
            include:{
                results:{
                    orderBy:{
                        score:"desc"
                    }
                }
            }
        });
        return users;
    }
    const getAllUserTopScore = async () => {
          const users = await prisma.user.findMany({
            take: 3,
            include:{
                results:{
                    orderBy:{
                        score:"desc"
                    }
                }
            }
        });
        return users;
    }
    const getAllUserTop7to10 = async () => {
          const users = await prisma.user.findMany({
            skip:3,
            take: 7,
            include:{
                results:{
                    orderBy:{
                        score:"desc"
                    }
                }
            }
        });
        return users;
    }
export { createUser, deleteUser, updateUser, getUserById, getALLUsers , countTotalUsers , getAllUserTopScore,getAllUserTop7to10 };