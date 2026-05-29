export const adminMiddleware = async (req, res, next) => {
  // console.log("adminMiddlware");
  try {
    if (!req.user) {
      return res.status(401).json({
        error: { message: "Unauthorize" },
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(401).json({
        error: { message: "Unauthorize" },
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
};
