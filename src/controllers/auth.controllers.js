import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import {
  validateSignUp,
  validateLogin,
  validateForgetPassword,
} from "./dto/auth.dto.js";
import {
  generateAccessRefreshToken,
  verifyRefreshToken,
} from "../utility/jwt.utility.js";
import { sendMail } from "../utility/email.js";
import crypto from "crypto";

export async function signup(req, res) {
  try {
    const validateReqBody = await validateSignUp.parseAsync(req.body);
    const { name, email, password } = validateReqBody;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "user with this emai alredy exits !",
      });
    }
    const hashPasswod = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPasswod,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
}

export async function login(req, res) {
  try {
    const validateReqBody = await validateLogin.parseAsync(req.body);
    const { email, password } = validateReqBody;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found !",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const { access_token, refresh_token } = generateAccessRefreshToken(user);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    const hash_refresh_token = await bcrypt.hash(refresh_token, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hash_refresh_token },
    });

    return res.status(200).json({
      data: access_token,
      message: "Login successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
}

export async function getme(req, res) {
  const { id, name, email } = req.user;
  if (!id || !name || !email) {
    return res.status(403).json({
      message: "forbidden ",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
  if (!user) {
    return res.status(204).json({
      message: "forbidden ",
    });
  }

  return res.status(200).json({
    data: user,
    message: "User Featched Succefully ",
  });
}

export async function rotateTokens(req, res) {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  const decode = await verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: decode.id,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "user not found ",
    });
  }

  const { access_token, refresh_token } =
    await generateAccessRefreshToken(user);
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: false,
  });
  const userUpdate = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refresh_token },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return res.status(200).json({
    data: userUpdate,
    message: "token Rotation success",
    access_token,
  });
}

export async function forgetPassword(req, res) {
  try {
    const validateReqBody = await validateForgetPassword.parseAsync(req.body);
    const { email } = validateReqBody;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const token = crypto.randomBytes(8).toString("hex");
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashToken,
        passwordResetExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const link = `http://localhost:8000/api/auth/resetPassword?token=${token}`;
    await sendMail(
      "kingtraders11@gmail.com",
      "Reset your password",
      `
    <h2>Password Reset</h2>
    <p>Hello ${user.name},</p>
    <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
    <a href="${link}">Reset Password</a>
  `,
    );
    return res.status(200).json({
      message:
        "If this email exists, password reset instructions have been sent",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if ((!token, !password)) {
      return res.status().json({
        message: "Provide a valid password ",
      });
    }
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashToken,
        passwordResetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (hashToken !== user.passwordResetToken) {
      return res.status(403).json({
        message: "token is invalid",
      });
    }

    const hashPasswod = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashPasswod,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}

export async function logout(req, res) {
  try {
    const { id } = req.user;
    const user = await prisma.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}
