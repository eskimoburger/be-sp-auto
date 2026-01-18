import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class EmployeeService {
    static async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.employee.findMany({ skip, take: limit }),
            prisma.employee.count()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async create(data: Prisma.EmployeeCreateInput) {
        if (data.password) {
            data.password = await Bun.password.hash(data.password);
        }
        return await prisma.employee.create({ data });
    }

    static async delete(id: number) {
        return await prisma.employee.delete({ where: { id } });
    }
}
