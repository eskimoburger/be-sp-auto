import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export class EmployeeService {
    static async getAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        const where: Prisma.EmployeeWhereInput = search
            ? {
                OR: [
                    { name: { contains: search } }, // Case-insensitive in some DBs, or use mode: 'insensitive' if supported/needed
                    { username: { contains: search } }
                ]
            }
            : {};

        const [data, total] = await Promise.all([
            prisma.employee.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    role: true,
                    phone: true,
                    isActive: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.employee.count({ where })
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async create(data: Prisma.EmployeeCreateInput) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return await prisma.employee.create({ data });
    }

    static async delete(id: number) {
        return await prisma.employee.delete({ where: { id } });
    }
}
