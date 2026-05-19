import jwt from "jsonwebtoken";

export const generateAccessRefreshToken = (payload) => {
  const access_token = generateAccessToken(payload);
  const refresh_token = generateRefreshToken(payload);
  return { access_token, refresh_token };
};

export const generateAccessToken = (payload) => {
  return jwt.sign(
    { id: payload.id, name: payload.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
  );
};

export const generateRefreshToken = (payload) => {
  return jwt.sign({ id: payload.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// export const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, process.env.ACCESS_SECRET);
//   } catch (err) {
//     return null; // VERY IMPORTANT
//   }
// };

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
