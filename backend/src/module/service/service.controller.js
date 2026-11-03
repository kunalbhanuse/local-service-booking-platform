import { prisma } from "../../common/db/prisma.js";
import { createServiceSchema, updateServiceSchema } from "./dto/service.dto.js";
import { handleError } from "../../common/utility/http.js";
import {
  publicServiceQuerySchema,
  SERVICE_CATEGORIES,
} from "./dto/service.query.dto.js";

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
    const user = req.user;
    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
    });
    if (!provider) {
      return res.status(404).json({
        message: "Provider Not Found",
      });
    }
    const service = await prisma.service.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!service) {
      return res.status(404).json({
        message: "Service Not Found",
      });
    }
    if (service.providerId !== provider.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const { id } = req.params;
    const validateReqBody = await updateServiceSchema.parseAsync(req.body);

    const update = await prisma.service.update({
      where: { id: Number(id) },
      data: validateReqBody,
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

export async function deleteService(req, res) {
  try {
    const user = req.user;
    const provider = await prisma.provider.findUnique({
      where: { userId: user.id },
    });
    if (!provider) {
      return res.status(404).json({
        message: "Provider Not Found",
      });
    }
    const service = await prisma.service.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!service) {
      return res.status(404).json({
        message: "Service Not Found",
      });
    }
    if (service.providerId !== provider.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const deleted = await prisma.service.delete({
      where: { id: Number(req.params.id) },
    });
    if (!deleted) {
      return res.status(404).json({
        message: "Delete failed ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delete success",
      date: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}

export async function getAllServices(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const allService = await prisma.service.findMany();
    return res.status(200).json({
      success: true,
      message: "Service feached Succfully",
      data: allService,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}

export async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!id) {
      return res.status(400).json({
        error: { message: "Id is not provided " },
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });
    if (!service) {
      return res.status(404).json({
        error: { message: "Service Not Found" },
      });
    }
    return res.status(200).json({
      message: "Service Featched succesfully",
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      error: { message: error.message || "Internal Server Error" },
    });
  }
}

// ---------------------------------------------------------------------------
// Public catalogue (no auth) + provider's own listings
// ---------------------------------------------------------------------------

const publicServiceSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  category: true,
  createdAt: true,
  provider: {
    select: {
      id: true,
      businessName: true,
      city: true,
      area: true,
      isAvailable: true,
      experience: true,
    },
  },
};

export async function getPublicServices(req, res) {
  try {
    const { category, city, q, page, limit } =
      await publicServiceQuerySchema.parseAsync(req.query);

    const where = {
      isActive: true,
      provider: {
        status: "APPROVED",
        ...(city && { city: { contains: city, mode: "insensitive" } }),
      },
      ...(category && { category }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { provider: { businessName: { contains: q, mode: "insensitive" } } },
        ],
      }),
    };

    const [total, data] = await prisma.$transaction([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        select: publicServiceSelect,
        orderBy: [{ provider: { isAvailable: "desc" } }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getPublicServiceMeta(req, res) {
  try {
    const [cities, pairs, totalProviders] = await prisma.$transaction([
      prisma.provider.findMany({
        where: { status: "APPROVED" },
        select: { city: true },
        distinct: ["city"],
        orderBy: { city: "asc" },
      }),
      prisma.service.findMany({
        where: { isActive: true, provider: { status: "APPROVED" } },
        select: { category: true, providerId: true },
        distinct: ["category", "providerId"],
      }),
      prisma.provider.count({ where: { status: "APPROVED" } }),
    ]);

    const providersByCategory = Object.fromEntries(
      SERVICE_CATEGORIES.map((c) => [c, 0]),
    );
    for (const { category } of pairs) providersByCategory[category] += 1;

    return res.status(200).json({
      success: true,
      data: {
        // Dedupe case-insensitively so "pune" and "Pune" become one filter option.
        cities: [...new Map(cities.map((c) => [c.city.trim().toLowerCase(), c.city.trim()])).values()],
        totalProviders,
        categories: SERVICE_CATEGORIES.map((key) => ({
          key,
          providers: providersByCategory[key],
        })),
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getPublicServiceById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: { message: "Invalid service id" } });
    }
    const service = await prisma.service.findFirst({
      where: { id, isActive: true, provider: { status: "APPROVED" } },
      select: {
        ...publicServiceSelect,
        provider: {
          select: {
            ...publicServiceSelect.provider.select,
            bio: true,
            phone: true,
            services: {
              where: { isActive: true, NOT: { id } },
              select: { id: true, name: true, category: true, price: true },
              take: 6,
            },
          },
        },
      },
    });
    if (!service) {
      return res.status(404).json({ error: { message: "Service Not Found" } });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getMyServices(req, res) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user.id },
      select: { id: true },
    });
    if (!provider) {
      return res.status(404).json({ error: { message: "Provider Not Found" } });
    }
    const services = await prisma.service.findMany({
      where: { providerId: provider.id },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    return handleError(res, error);
  }
}
