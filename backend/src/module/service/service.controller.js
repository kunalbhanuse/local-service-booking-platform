import { prisma } from "../../common/db/prisma.js";
import { createServiceSchema, updateServiceSchema } from "./dto/service.dto.js";

export async function registerService(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const validateReqBody = await createServiceSchema.parseAsync(req.body);
    const { name, description, price, category, isActive } = validateReqBody;

    const provider = await prisma.provider.findUnique({
      where: { userId: req.user.id },
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider Not Found",
      });
    }
    if (provider.status !== "APPROVED") {
      return res.status(403).json({
        message: "Your Provider Profile is not approved yet",
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        category,
        isActive,
        providerId: provider.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Service created succesfully ",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const validateReqBody = await updateServiceSchema.parseAsync(req.body);

    const update = await prisma.service.update({
      where: { id: Number(id) },
      date: validateReqBody,
    });
    if (!update) {
      return res.status(404).json({
        message: "update failed ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Update success",
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}
