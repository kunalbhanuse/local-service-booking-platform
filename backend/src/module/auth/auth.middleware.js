import { prisma } from "../../common/db/prisma.js";
import { verifyAccessToken } from "../../common/utility/jwt.utility.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // console.log("AUTH HEADER:", req.headers.authorization);
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const token = header.split(" ")[1];
    // console.log("TOKEN:", token);
    const decode = await verifyAccessToken(token);
    // console.log("DECODE:", decode);
    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: Number(decode.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    // console.log("user", user);

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "jwt expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "invalid token",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
