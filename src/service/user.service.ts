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
  // 1) Group theo tổng sum
  const grouped = await prisma.result.groupBy({
    by: ["userId"],
    _sum: { sum: true },
    orderBy: { _sum: { sum: "desc" } },
  });

  console.log("DEBUG: grouped length =", grouped.length);
  console.log("DEBUG: grouped sample (top 5) =", grouped.slice(0, 5));

  // 2) Nếu DB chưa có result nào → fallback: lấy 3 user đầu tiên
  if (!grouped || grouped.length === 0) {
    console.log("DEBUG: No results yet → fallback users.");
    const fallback = await prisma.user.findMany({
      orderBy: { id: "asc" },
      take: 3,
      select: {
        id: true,
        name: true,
        email: true,
        results: { take: 0 },
      },
    });

    return fallback.map((u) => ({ ...u, results: [] }));
  }

  // 3) Lấy top1..3 = index 0..2
  const top3 = grouped.slice(0, 3);
  console.log("DEBUG: grouped top3 =", top3);

  // 4) Lấy thông tin user + result cao nhất của từng user
  const users = await Promise.all(
    top3.map(async (g) => {
      return prisma.user.findUnique({
        where: { id: g.userId },
        select: {
          id: true,
          name: true,
          email: true,
          results: {
            orderBy: { sum: "desc" },
            take: 1,
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

  const filtered = users.filter(Boolean); // bỏ null

  // 5) Nếu không đủ 3 user (ví dụ chỉ có 1–2 người có result)
  if (filtered.length < 3) {
    const collectedIds = top3.map((t) => t.userId);
    const remaining = 3 - filtered.length;

    console.log(`DEBUG: Need ${remaining} more users → fetch from user table`);

    const extras = await prisma.user.findMany({
      where: { id: { notIn: collectedIds } },
      orderBy: { id: "asc" },
      take: remaining,
      select: {
        id: true,
        name: true,
        email: true,
        results: { take: 0 },
      },
    });

    return [...filtered, ...extras.map((u) => ({ ...u, results: [] }))];
  }

  // 6) Trả về đủ 3 user
  return filtered;
};  

// =======================
// Lấy Top 4 → 10 user theo điểm cao nhất
// =======================
const getAllUserTop7to10 = async () => {
  // 1) Lấy grouped theo tổng sum, sắp xếp giảm dần
  const grouped = await prisma.result.groupBy({
    by: ["userId"],
    _sum: { sum: true },
    orderBy: { _sum: { sum: "desc" } },
  });

  if (!grouped || grouped.length === 0) return [];

  // 2) Xác định top 3 userId
  const top3UserIds = grouped.slice(0, 3).map(g => g.userId);

  // 3) Lấy top 4..10 bằng slice (loại bỏ top3)
  const sliced = grouped.slice(3, 10);

  // 4) Lấy thông tin user tương ứng
  const usersFromGrouped = await Promise.all(
    sliced.map(async g => {
      const user = await prisma.user.findUnique({
        where: { id: g.userId },
        select: {
          id: true,
          name: true,
          email: true,
          results: {
            orderBy: { score: "desc" },
            take: 1,
            select: { id: true, score: true, sum: true, userId: true, quizId: true },
          },
        },
      });
      return user;
    })
  );

  const collected = usersFromGrouped.filter(Boolean);

  // 5) Nếu chưa đủ 7 user, bổ sung user không nằm trong top3 và top4..10
  if (collected.length < 7) {
    const collectedUserIds = collected.map(u => u!.id);
    const remaining = 7 - collected.length;

    const extras = await prisma.user.findMany({
      where: { id: { notIn: [...top3UserIds, ...collectedUserIds] } },
      orderBy: { id: "asc" },
      take: remaining,
      select: { id: true, name: true, email: true, results: { take: 0 } },
    });

    return [...collected, ...extras.map(u => ({ ...u, results: [] }))];
  }

  return collected;
};




export { createUser, deleteUser, updateUser, getUserById, getALLUsers , countTotalUsers , getAllUserTopScore,getAllUserTop7to10 };