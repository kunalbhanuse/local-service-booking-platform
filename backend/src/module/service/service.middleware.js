export async function isProvider(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (req.user.role === "SERVICE_PROVIDER") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}
