import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export interface CreateJobDTO {
    jobNumber: string;
    vehicleId: number;
    customerId?: number;
    insuranceCompanyId?: number;
    paymentType?: string;
    excessFee?: number;
    startDate: Date | string;
    estimatedEndDate?: Date | string;
    repairDescription?: string;
    notes?: string;
}

export class JobService {
    static async createJob(data: CreateJobDTO) {
        // Transaction to ensure all side-effects (stages, steps, photos) are created
        return await prisma.$transaction(async (tx) => {
            // 1. Create Job.
            const { vehicleId, customerId, insuranceCompanyId, ...rest } = data;

            if (!vehicleId) { throw new Error("Vehicle ID is required"); }

            // Validate Vehicle Exists
            const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
            if (!vehicle) { throw new Error("Vehicle not found"); }

            const job = await tx.job.create({
                data: {
                    ...rest,
                    vehicle: { connect: { id: vehicleId } },
                    customer: customerId ? { connect: { id: customerId } } : undefined,
                    insuranceCompany: insuranceCompanyId ? { connect: { id: insuranceCompanyId } } : undefined
                }
            });

            // 2. Initialize Stages
            const stages = await tx.stage.findMany({ orderBy: { orderIndex: "asc" } });
            for (const stage of stages) {
                const jobStage = await tx.jobStage.create({
                    data: {
                        jobId: job.id,
                        stageId: stage.id,
                        isLocked: stage.orderIndex !== 1, // Only the first stage is unlocked
                        isCompleted: false,
                        startedAt: stage.orderIndex === 1 ? new Date() : null
                    }
                });

                // 3. Initialize Steps for this stage
                const stepTemplates = await tx.stepTemplate.findMany({
                    where: { stageId: stage.id },
                    orderBy: { orderIndex: "asc" }
                });
                for (const tpl of stepTemplates) {
                    await tx.jobStep.create({
                        data: {
                            jobStageId: jobStage.id,
                            stepTemplateId: tpl.id,
                            status: "pending"
                        }
                    });
                }
            }

            // 4. Initialize Photo Requirements (Optional: Based on business rules, here we add all types as optional/required)
            const photoTypes = await tx.photoType.findMany();
            for (const pt of photoTypes) {
                await tx.jobPhoto.create({
                    data: {
                        jobId: job.id,
                        photoTypeId: pt.id,
                        isRequired: pt.code === "before_repair" || pt.code === "completed" // access logic example
                    }
                });
            }

            return job;
        });
    }

    static async getAll(page: number = 1, limit: number = 10, status?: string) {
        const skip = (page - 1) * limit;
        // Validate status if provided
        // Use 'any' cast as temporary workaround for lint error regarding EnumJobStatusFilter
        const where: Prisma.JobWhereInput = status ? { status: status as any } : {};

        const [data, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: limit,
                include: {
                    vehicle: true,
                    customer: true,
                    jobStages: {
                        where: { isCompleted: false },
                        include: {
                            jobSteps: {
                                include: { stepTemplate: true },
                                orderBy: { stepTemplate: { orderIndex: "asc" } }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.job.count({ where })
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async getJobDetails(id: number) {
        return await prisma.job.findUnique({
            where: { id },
            include: {
                vehicle: true,
                customer: true,
                jobStages: {
                    include: {
                        stage: true,
                        jobSteps: {
                            include: { stepTemplate: true }
                        }
                    },
                    orderBy: { stage: { orderIndex: "asc" } }
                },
                jobPhotos: {
                    include: { photoType: true }
                }
            }
        });
    }
}
