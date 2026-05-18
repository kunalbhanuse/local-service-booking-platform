import { prisma } from "../../common/db/prisma.js";
export async function applyService(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { businessName, bio, phone, city, area, experience } = req.body;

    const provider = await prisma.provider.findUnique({
      where: { userId },
    });
    if (provider) {
      return res.status(400).json({ message: "Already applied" });
    }

    const newProvider = await prisma.provider.create({
      data: {
        userId,
        businessName,
        bio,
        phone,
        city,
        area,
        experience,
      },
    });

    return res.status(201).json({
      message: "Application submitted",
      provider: newProvider,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
