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
            take: pagesize,
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

// =======================
// Lấy Top 3 user theo điểm cao nhất
// =======================

// =======================
// Lấy Top 3 user theo điểm cao nhất
// =======================
const getAllUserTopScore = async () => {
  const grouped = await prisma.result.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 3,
  });

  const users = await Promise.all(
    grouped.map(async (g) => {
      return prisma.user.findUnique({
        where: { id: g.userId },
        select: {
          id: true,
          name: true,
          email: true,
          results: {
            orderBy: { score: "desc" },
            take: 1, // lấy kết quả cao nhất
            select: {
              id: true,
              score: true,
              sum: true,
              userId: true,
              quizId: true,
            },
          },
        },
      });
    })
  );

  return users;
};

// =======================
// Lấy Top 4 → 10 user theo điểm cao nhất
// =======================
const getAllUserTop7to10 = async () => {
  const grouped = await prisma.result.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    skip: 3, // bỏ top 3
    take: 7, // lấy 7 user tiếp theo
  });

  const users = await Promise.all(
    grouped.map(async (g) => {
      return prisma.user.findUnique({
        where: { id: g.userId },
        select: {
          id: true,
          name: true,
          email: true,
          results: {
            orderBy: { score: "desc" },
            take: 1, // lấy kết quả cao nhất
            select: {
              id: true,
              score: true,
              sum: true,
              userId: true,
              quizId: true,
            },
          },
        },
      });
    })
  );

  return users;
};




export { createUser, deleteUser, updateUser, getUserById, getALLUsers , countTotalUsers , getAllUserTopScore,getAllUserTop7to10 };