import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export class JobService {
    static async createJob(data: Prisma.JobCreateInput) {
        // Transaction to ensure all side-effects (stages, steps, photos) are created
        return await prisma.$transaction(async (tx) => {
            // 1. Create Job. Ensure data fits Prisma.JobCreateInput or Handle manually
            const { vehicleId, customerId, ...rest } = data as any; // manually extract relations IDs from payload

            if (!vehicleId) throw new Error("Vehicle ID is required");
            const job = await tx.job.create({
                data: {
                    ...rest,
                    vehicle: { connect: { id: vehicleId } },
                    customer: customerId ? { connect: { id: customerId } } : undefined
                }
            });

            // 2. Initialize Stages
            const stages = await tx.stage.findMany({ orderBy: { orderIndex: 'asc' } });
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
                const stepTemplates = await tx.stepTemplate.findMany({ where: { stageId: stage.id }, orderBy: { orderIndex: 'asc' } });
                for (const tpl of stepTemplates) {
                    await tx.jobStep.create({
                        data: {
                            jobStageId: jobStage.id,
                            stepTemplateId: tpl.id,
                            status: 'pending'
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
                        isRequired: pt.code === 'before_repair' || pt.code === 'completed' // access logic example
                    }
                });
            }

            return job;
        });
    }

    static async getAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.job.findMany({
                skip,
                take: limit,
                include: {
                    vehicle: true,
                    customer: true,
                    jobStages: {
                        where: { isCompleted: false },
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.job.count()
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
                    orderBy: { stage: { orderIndex: 'asc' } }
                },
                jobPhotos: {
                    include: { photoType: true }
                }
            }
        });
    }
}
