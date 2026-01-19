import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { DataFactory } from "../src/tests/factories";
import { faker } from "@faker-js/faker";
import type { JobStatus } from "@prisma/client";

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
    url: connectionString!,
    authToken: authToken
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Start seeding...");

    // 1. Stages
    console.log("Seeding Stages...");
    await prisma.stage.upsert({
        where: { code: "claim" },
        update: {},
        create: { code: "claim", name: "เคลม", orderIndex: 1 }
    });
    await prisma.stage.upsert({
        where: { code: "repair" },
        update: {},
        create: { code: "repair", name: "ซ่อม", orderIndex: 2 }
    });
    await prisma.stage.upsert({
        where: { code: "billing" },
        update: {},
        create: { code: "billing", name: "ตั้งเบิก", orderIndex: 3 }
    });

    // 2. Photo Types
    console.log("Seeding Photo Types...");
    const photoTypes = [
        { code: "before_repair", name: "ก่อนซ่อม", orderIndex: 1 },
        { code: "dent", name: "เคาะ", orderIndex: 2 },
        { code: "putty", name: "โป้วสี", orderIndex: 3 },
        { code: "primer", name: "พ่นสีพื้น", orderIndex: 4 },
        { code: "paint", name: "พ่นสีจริง", orderIndex: 5 },
        { code: "parts", name: "เกี่ยวอะไหล่", orderIndex: 6 },
        { code: "polish", name: "ขัดสี", orderIndex: 7 },
        { code: "completed", name: "รถเสร็จ", orderIndex: 8 }
    ];
    for (const pt of photoTypes) {
        await prisma.photoType.upsert({ where: { code: pt.code }, update: {}, create: pt });
    }

    // 3. Step Templates
    console.log("Seeding Step Templates...");
    const claimStage = await prisma.stage.findUnique({ where: { code: "claim" } });
    const repairStage = await prisma.stage.findUnique({ where: { code: "repair" } });
    const billingStage = await prisma.stage.findUnique({ where: { code: "billing" } });

    if (claimStage) {
        const steps = [
            { name: "ยื่นเคลม", orderIndex: 1, isSkippable: false },
            { name: "เช็ครายการ", orderIndex: 2, isSkippable: false },
            { name: "ขอราคา", orderIndex: 3, isSkippable: false },
            { name: "เสนอราคา", orderIndex: 4, isSkippable: false },
            { name: "ส่งประกัน", orderIndex: 5, isSkippable: false },
            { name: "อนุมัติ", orderIndex: 6, isSkippable: false },
            { name: "หาอะไหล่", orderIndex: 7, isSkippable: false },
            { name: "สั่งอะไหล่", orderIndex: 8, isSkippable: false },
            { name: "อะไหล่ครบ", orderIndex: 9, isSkippable: false },
            { name: "นัดคิวเข้า", orderIndex: 10, isSkippable: false },
            { name: "ลูกค้าเข้าจอด", orderIndex: 11, isSkippable: false },
            { name: "เสนอเพิ่ม", orderIndex: 12, isSkippable: false },
            { name: "รถเสร็จ", orderIndex: 13, isSkippable: false }
        ];
        for (const step of steps) {
            // Note: upserting by composite unique is harder without a unique constraint on name+stageId in schema, using findFirst/create
            const exists = await prisma.stepTemplate.findFirst({ where: { stageId: claimStage.id, name: step.name } });
            if (!exists) {
                await prisma.stepTemplate.create({ data: { ...step, stageId: claimStage.id } });
            }
        }
    }

    if (repairStage) {
        const steps = [
            { name: "รื้อ/ถอด", orderIndex: 1, isSkippable: true },
            { name: "เคาะ", orderIndex: 2, isSkippable: true },
            { name: "เคาะ เบิกอะไหล่", orderIndex: 3, isSkippable: true },
            { name: "โป้วสี", orderIndex: 4, isSkippable: true },
            { name: "พ่นสีพื้น", orderIndex: 5, isSkippable: true },
            { name: "พ่นสีจริง", orderIndex: 6, isSkippable: true },
            { name: "ประกอบเบิกอะไหล่", orderIndex: 7, isSkippable: true },
            { name: "ขัดสี", orderIndex: 8, isSkippable: true },
            { name: "ล้างรถ", orderIndex: 9, isSkippable: true },
            { name: "QC", orderIndex: 10, isSkippable: false },
            { name: "ลูกค้ารับรถ", orderIndex: 11, isSkippable: false }
        ];
        for (const step of steps) {
            const exists = await prisma.stepTemplate.findFirst({ where: { stageId: repairStage.id, name: step.name } });
            if (!exists) {
                await prisma.stepTemplate.create({ data: { ...step, stageId: repairStage.id } });
            }
        }
    }

    if (billingStage) {
        const steps = [
            { name: "รถเสร็จ", orderIndex: 1, isSkippable: false },
            { name: "เรียงรูป", orderIndex: 2, isSkippable: false },
            { name: "ส่งอนุมัติ", orderIndex: 3, isSkippable: false },
            { name: "อนุมัติเสร็จ", orderIndex: 4, isSkippable: false },
            { name: "ออกใบกำกับภาษี", orderIndex: 5, isSkippable: false },
            { name: "เรียงเรื่อง", orderIndex: 6, isSkippable: false },
            { name: "นำเรื่องตั้งเบิก", orderIndex: 7, isSkippable: false },
            { name: "วันจ่ายเงิน", orderIndex: 8, isSkippable: false }
        ];
        for (const step of steps) {
            const exists = await prisma.stepTemplate.findFirst({
                where: { stageId: billingStage.id, name: step.name }
            });
            if (!exists) {
                await prisma.stepTemplate.create({ data: { ...step, stageId: billingStage.id } });
            }
        }
    }

    // 4. Insurance Companies
    console.log("Seeding Insurance Companies...");
    const insurances = [
        { name: "วิริยะประกันภัย", contactPhone: "1557" },
        { name: "ทิพยประกันภัย", contactPhone: "1736" },
        { name: "ธนชาตประกันภัย", contactPhone: "02-666-8899" },
        { name: "กรุงเทพประกันภัย", contactPhone: "1620" },
        { name: "เมืองไทยประกันภัย", contactPhone: "1484" },
        { name: "ไทยวิวัฒน์ประกันภัย", contactPhone: "1231" },
        { name: "สินมั่นคงประกันภัย", contactPhone: "1596" },
        { name: "อาคเนย์ประกันภัย", contactPhone: "1726" }
    ];
    for (const ins of insurances) {
        const exists = await prisma.insuranceCompany.findFirst({ where: { name: ins.name } });
        if (!exists) {
            await prisma.insuranceCompany.create({ data: ins });
        } else {
            await prisma.insuranceCompany.update({
                where: { id: exists.id },
                data: ins
            });
        }
    }

    // 5. Employees
    console.log("Seeding Employees...");
    const passwordHash = await Bun.password.hash("123456");
    const employees = [
        { name: "สมชาย มีสุข", role: "receiver" },
        { name: "วิชัย เก่ง", role: "receiver" },
        { name: "สุธี แก้ว", role: "technician" },
        { name: "ประเสริฐ ทอง", role: "technician" },
        { name: "กฤษณ์ เดชา", role: "technician" },
        { name: "อนุชิต รักษ์", role: "technician" },
        { name: "ธนา วิริยะ", role: "admin", username: "admin1", password: passwordHash },
        { name: "พิชัย หาญ", role: "admin", username: "admin2", password: passwordHash }
    ];
    for (const emp of employees) {
        const exists = await prisma.employee.findFirst({ where: { name: emp.name } });
        if (!exists) {
            await prisma.employee.create({ data: emp });
        } else {
            // Update existing admins with credentials if they don't have them
            if (emp.username && !exists.username) {
                await prisma.employee.update({
                    where: { id: exists.id },
                    data: { username: emp.username, password: emp.password }
                });
            }
        }
    }

    // 6. Vehicle Types from vehicleData.ts
    console.log("Seeding Vehicle Types...");
    const { ALL_BRANDS, VEHICLE_TYPES } = await import("../vehicleData");

    // Create a map of type name -> typeId
    const typeMap = new Map<string, number>();
    for (const typeName of VEHICLE_TYPES) {
        const code = typeName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-");
        // Extract English name from format "ไทย (English)"
        const match = /\(([^)]+)\)/.exec(typeName);
        const nameEn = match ? match[1] : typeName;

        const createdType = await prisma.vehicleType.upsert({
            where: { code },
            update: { name: typeName, nameEn: nameEn || typeName },
            create: { code, name: typeName, nameEn: nameEn || typeName }
        });
        typeMap.set(typeName, createdType.id);
    }

    // 7. Vehicle Brands
    console.log("Seeding Vehicle Brands...");
    for (const brand of ALL_BRANDS) {
        const createdBrand = await prisma.vehicleBrand.upsert({
            where: { code: brand.id },
            update: {
                name: brand.name,
                nameEn: brand.nameEn,
                country: brand.country,
                logoUrl: brand.logoUrl || null
            },
            create: {
                code: brand.id,
                name: brand.name,
                nameEn: brand.nameEn,
                country: brand.country,
                logoUrl: brand.logoUrl || null
            }
        });

        // Seed models for this brand
        for (const model of brand.models) {
            const typeId = typeMap.get(model.type);
            if (!typeId) {
                console.warn(`Type not found for model ${model.name}: ${model.type}`);
                continue;
            }
            const exists = await prisma.vehicleModel.findFirst({
                where: { brandId: createdBrand.id, name: model.name }
            });
            if (!exists) {
                await prisma.vehicleModel.create({
                    data: {
                        brandId: createdBrand.id,
                        name: model.name,
                        typeId
                    }
                });
            }
        }
    }

    // 8. Customers, Vehicles, Jobs
    console.log("Seeding Customers, Vehicles, and Jobs...");

    // Helper to create job with workflow
    async function createJobWithWorkflow(vehicleId: number, customerId: number, status: JobStatus) {
        const job = await prisma.job.create({
            data: {
                jobNumber: `JOB-${faker.string.numeric(6)}`,
                vehicleId,
                customerId,
                status, // This sets the 'active' status on the Job record
                startDate: faker.date.recent({ days: 30 }),
                paymentType: faker.helpers.arrayElement(["Cash", "Insurance"]),
                repairDescription: faker.lorem.sentence()
            }
        });

        // Initialize Stages
        const stages = await prisma.stage.findMany({ orderBy: { orderIndex: "asc" } });
        for (const stage of stages) {
            // Determine if this stage is completed, active, or future based on job status
            // Simple logic: 
            // - If Job Status is REPAIR, then CLAIM is completed, REPAIR is active (in-progress), BILLING is future (locked)
            let isCompleted = false;
            let isLocked = true;
            let startedAt = null;

            // Map status string to order roughly (1=CLAIM, 2=REPAIR, 3=BILLING)
            const statusOrderMap: Record<string, number> = { "CLAIM": 1, "REPAIR": 2, "BILLING": 3, "DONE": 4 };
            const currentStageOrder = statusOrderMap[status] || 1;

            if (stage.orderIndex < currentStageOrder) {
                isCompleted = true;
                isLocked = false;
                startedAt = faker.date.past();
            } else if (stage.orderIndex === currentStageOrder) {
                isCompleted = false;
                isLocked = false; // Active stage is unlocked
                startedAt = new Date();
            } else {
                isLocked = true;
            }

            const jobStage = await prisma.jobStage.create({
                data: {
                    jobId: job.id,
                    stageId: stage.id,
                    isLocked,
                    isCompleted,
                    startedAt
                }
            });

            // Initialize Steps
            const stepTemplates = await prisma.stepTemplate.findMany({
                where: { stageId: stage.id },
                orderBy: { orderIndex: "asc" }
            });

            for (const tpl of stepTemplates) {
                let stepStatus = "pending";
                // If stage is completed, all steps are completed
                if (isCompleted) {
                    stepStatus = "completed";
                }
                // If it's the active stage, randomize some steps
                else if (stage.orderIndex === currentStageOrder) {
                    // First few steps done, middle in progress, rest pending
                    const rand = Math.random();
                    if (rand > 0.7) {stepStatus = "completed";}
                    else if (rand > 0.4) {stepStatus = "in_progress";}
                }

                await prisma.jobStep.create({
                    data: {
                        jobStageId: jobStage.id,
                        stepTemplateId: tpl.id,
                        status: stepStatus,
                        completedAt: stepStatus === "completed" ? new Date() : null
                    }
                });
            }
        }
        return job;
    }

    for (let i = 0; i < 5; i++) { // Reduce count slightly to keep seed fast but rich
        const customer = await DataFactory.createCustomer();
        // Create 1-2 vehicles
        const vehicleCount = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < vehicleCount; j++) {
            const vehicle = await DataFactory.createVehicle(customer.id);
            // Create job for *every* vehicle for demo purposes, or high probability
            const status = faker.helpers.arrayElement(["CLAIM", "REPAIR", "BILLING"]); // Avoid DONE for now to show active steps
            await createJobWithWorkflow(vehicle.id, customer.id, status as JobStatus);
        }
    }

    console.log("Seeding finished.");
}

main()
    .catch((e: unknown) => {
        console.error(e);
        // eslint-disable-next-line n/no-process-exit
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
