import { prisma } from "../../common/db/prisma.js";
import { verifyAccessToken } from "../../common/utility/jwt.utility.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // console.log("AUTH HEADER:", req.headers.authorization);
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "forbidden",
      });
    }
    const token = header.split(" ")[1];
    // console.log("TOKEN:", token);
    const decode = await verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: Number(decode.id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    // console.log("DECODE:", decode);
    // console.log("ID TYPE:", typeof decode.id);
    // console.log("decode:-", user);

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
