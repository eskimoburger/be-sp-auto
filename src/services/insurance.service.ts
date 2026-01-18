import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export class InsuranceService {
    static async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.insuranceCompany.findMany({
                skip,
                take: limit,
                orderBy: { id: 'asc' }
            }),
            prisma.insuranceCompany.count()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async findById(id: number) {
        return await prisma.insuranceCompany.findUnique({
            where: { id }
        });
    }

    static async search(query: string) {
        return await prisma.insuranceCompany.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { contactPhone: { contains: query } }
                ]
            }
        });
    }

    static async create(data: Prisma.InsuranceCompanyCreateInput) {
        return await prisma.insuranceCompany.create({ data });
    }

    static async update(id: number, data: Prisma.InsuranceCompanyUpdateInput) {
        return await prisma.insuranceCompany.update({
            where: { id },
            data
        });
    }

    static async delete(id: number) {
        return await prisma.insuranceCompany.delete({ where: { id } });
    }
}
