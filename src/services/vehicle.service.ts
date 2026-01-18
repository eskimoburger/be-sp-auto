import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export class VehicleService {
    static async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.vehicle.findMany({
                skip,
                take: limit,
                include: { customer: true }
            }),
            prisma.vehicle.count()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async findByRegistration(registration: string) {
        return await prisma.vehicle.findUnique({
            where: { registration }
        });
    }

    static async create(data: Prisma.VehicleCreateInput) {
        return await prisma.vehicle.create({ data });
    }

    static async update(id: number, data: Prisma.VehicleUpdateInput) {
        return await prisma.vehicle.update({ where: { id }, data });
    }

    static async delete(id: number) {
        return await prisma.vehicle.delete({ where: { id } });
    }
}
