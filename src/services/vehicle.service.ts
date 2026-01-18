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

    static async getBrands() {
        return await prisma.vehicleBrand.findMany({
            orderBy: { nameEn: 'asc' },
            include: {
                models: {
                    include: { type: true }
                }
            }
        });
    }

    static async getBrandById(id: number) {
        return await prisma.vehicleBrand.findUnique({
            where: { id },
            include: {
                models: {
                    include: { type: true }
                }
            }
        });
    }

    static async createBrand(data: { code: string; name: string; nameEn: string; country: string; logoUrl?: string }) {
        return await prisma.vehicleBrand.create({ data });
    }

    static async updateBrand(id: number, data: { name?: string; nameEn?: string; country?: string; logoUrl?: string }) {
        return await prisma.vehicleBrand.update({ where: { id }, data });
    }

    static async deleteBrand(id: number) {
        return await prisma.vehicleBrand.delete({ where: { id } });
    }

    // VehicleType CRUD
    static async getTypes() {
        return await prisma.vehicleType.findMany({
            orderBy: { name: 'asc' }
        });
    }

    static async getTypeById(id: number) {
        return await prisma.vehicleType.findUnique({ where: { id } });
    }

    static async createType(data: { code: string; name: string; nameEn: string }) {
        return await prisma.vehicleType.create({ data });
    }

    static async updateType(id: number, data: { name?: string; nameEn?: string }) {
        return await prisma.vehicleType.update({ where: { id }, data });
    }

    static async deleteType(id: number) {
        return await prisma.vehicleType.delete({ where: { id } });
    }
}
