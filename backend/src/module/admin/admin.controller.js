import { prisma } from "../../common/db/prisma.js";
import { updateProviderStatusSchema } from "./dto/admin.dto.js";

export const getAllProvider = async (req, res) => {
  console.log("getallProvider Hit");
  try {
    const { status } = req.query;
    if (
      status !== "PENDING" &&
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      return res.status(200).json({
        error: {
          message: "Invalid status",
        },
      });
    }

    const allPendinProvider = await prisma.provider.findMany({
      where: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ data: allPendinProvider });
  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message || "Internal server error",
      },
    });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: { message: "Id is not provided " },
      });
    }

    const provider = await prisma.provider.findUnique({
      where: { id: Number(id) },
    });
    if (!provider) {
      return res.status(404).json({
        error: { message: "Provider Not Found" },
      });
    }
    return res.status(200).json({
      message: "Provider Featched succesfully",
      success: true,
      data: provider,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: { message: "Id is not provided " },
      });
    }
    const validateReqBody = await updateProviderStatusSchema.parseAsync(
      req.body,
    );
    const { status } = validateReqBody;

    const provider = await prisma.provider.findUnique({
      where: { id: Number(id) },
    });
    if (!provider) {
      return res.status(404).json({
        error: {
          message: "Provider not found",
        },
      });
    }

    if (provider?.status !== "PENDING") {
      return res.status(400).json({
        error: {
          message: "Only pending providers can be approved or rejected",
        },
      });
    }

    const updateProvider = await prisma.provider.update({
      where: { id: Number(id) },
      data: { status },
    });
    return res.status(200).json({
      message: `Provider ${status.toLowerCase()} successfully`,
      success: true,
      data: updateProvider,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
