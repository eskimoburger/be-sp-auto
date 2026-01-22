import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class CustomerService {
    static async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.customer.findMany({
                skip,
                take: limit,
                orderBy: { updatedAt: "desc" }
            }),
            prisma.customer.count()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async findById(id: number) {
        return await prisma.customer.findUnique({
            where: { id },
            include: { vehicles: true }
        });
    }

    static async search(query: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const where: Prisma.CustomerWhereInput = {
            OR: [{ name: { contains: query } }, { phone: { contains: query } }]
        };

        const [data, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { updatedAt: "desc" }
            }),
            prisma.customer.count({ where })
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async create(data: Prisma.CustomerCreateInput) {
        return await prisma.customer.create({ data });
    }

    static async update(id: number, data: Prisma.CustomerUpdateInput) {
        return await prisma.customer.update({
            where: { id },
            data
        });
    }

    static async delete(id: number) {
        // Logic: Prevent if has active jobs? or allow hard delete?
        // Assuming hard delete for now as requested.
        return await prisma.customer.delete({ where: { id } });
    }
}
