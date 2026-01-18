import { faker } from "@faker-js/faker";
import type { Prisma, JobStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class DataFactory {
    static async cleanDb() {
        const tablenames = await prisma.$queryRaw<
            { name: string }[]
        >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`;

        const tables = tablenames
            .map(({ name }) => name)
            .filter(
                (name) =>
                    name !== "_prisma_migrations" &&
                    name !== "Stage" &&
                    name !== "PhotoType" &&
                    name !== "StepTemplate" &&
                    name !== "InsuranceCompany" &&
                    name !== "VehicleType" &&
                    name !== "VehicleBrand" &&
                    name !== "VehicleModel" &&
                    name !== "Employee" // Keep seeded employees? Maybe we want to clean them if tests create new ones?
                // Usually we want to keep seeded data. Let's assume we keep seeded employees for now, or just the admin.
                // Actually, let's keep all seeded static data. Customer, Job, Vehicle are dynamic.
            );

        try {
            // Disable foreign key constraints to allow truncating tables in any order
            await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

            for (const table of tables) {
                // Skip static data tables we don't want to truncate
                // Note: These must match the mapped table names in schema.prisma
                if (
                    [
                        "stages",
                        "photo_types",
                        "step_templates",
                        "insurance_companies",
                        "vehicle_types",
                        "vehicle_brands",
                        "vehicle_models",
                        "employees"
                    ].includes(table)
                ) {
                    continue;
                }
                await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
            }

            // Re-enable foreign key constraints
            await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
        } catch (error) {
            console.log({ error });
        }
    }

    static async createCustomer(overrides?: Partial<Prisma.CustomerCreateInput>) {
        return prisma.customer.create({
            data: {
                name: faker.person.fullName(),
                phone: faker.string.numeric(10), // Thai phone usually 10 digits
                address: faker.location.streetAddress(),
                ...overrides
            }
        });
    }

    static async createVehicle(customerId: number | null, overrides?: Partial<Prisma.VehicleUncheckedCreateInput>) {
        // Find existing model to get valid brand/model/type names
        const model = await prisma.vehicleModel.findFirst({
            include: { brand: true, type: true }
        });

        // Fallback or error if no seed data
        const brandName = model?.brand.name || "Honda";
        const modelName = model?.name || "Civic";
        const typeName = model?.type.name || "Sedan";

        return prisma.vehicle.create({
            data: {
                customerId,
                registration: `${faker.string.alpha(2).toUpperCase()}-${faker.string.numeric(4)}`, // e.g. AB-1234
                brand: brandName,
                model: modelName,
                type: typeName,
                color: faker.vehicle.color(),
                year: "2020",
                ...overrides
            }
        });
    }

    static async createJob(
        vehicleId: number,
        customerId: number,
        status: JobStatus = "CLAIM",
        overrides?: Partial<Prisma.JobUncheckedCreateInput>
    ) {
        return prisma.job.create({
            data: {
                jobNumber: `JOB-${faker.string.numeric(6)}`,
                vehicleId,
                customerId,
                status,
                startDate: new Date(),
                insuranceCompanyId: null, // Optional
                ...overrides
            }
        });
    }

    static async createEmployee(overrides?: Partial<Prisma.EmployeeCreateInput>) {
        return prisma.employee.create({
            data: {
                name: faker.person.fullName(),
                username: faker.internet.username(),
                password: await Bun.password.hash("password123"),
                role: "technician",
                ...overrides
            }
        });
    }
}
