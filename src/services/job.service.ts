import type { Prisma, JobStatus } from "@prisma/client";
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

    static async getAll(page: number = 1, limit: number = 10, filters?: {
        status?: string;
        search?: string; // Search across vehicle registration, customer name, chassis/VIN
        vehicleRegistration?: string; // ทะเบียนรถ
        customerName?: string; // ชื่อ-นามสกุล
        chassisNumber?: string; // เลขตัวถัง
        vinNumber?: string; // VIN
        jobNumber?: string; // เลขที่งาน
        insuranceCompanyId?: number; // บริษัทประกัน
        startDateFrom?: string | Date; // วันเริ่มต้น (ตั้งแต่)
        startDateTo?: string | Date; // วันเริ่มต้น (ถึง)
        sortBy?: string; // Field to sort by
        sortOrder?: "asc" | "desc"; // Sort order
    }) {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.JobWhereInput = {};

        // Status filter
        if (filters?.status) {
            where.status = filters.status as JobStatus;
        }

        // Insurance company filter
        if (filters?.insuranceCompanyId) {
            where.insuranceCompanyId = filters.insuranceCompanyId;
        }

        // Job number filter (exact match or partial)
        if (filters?.jobNumber) {
            where.jobNumber = {
                contains: filters.jobNumber
            };
        }

        // Date range filter
        if (filters?.startDateFrom || filters?.startDateTo) {
            where.startDate = {};
            if (filters.startDateFrom) {
                where.startDate.gte = new Date(filters.startDateFrom);
            }
            if (filters.startDateTo) {
                where.startDate.lte = new Date(filters.startDateTo);
            }
        }

        // General search filter - searches across multiple fields
        if (filters?.search) {
            where.OR = [
                { vehicle: { registration: { contains: filters.search } } },
                { vehicle: { vinNumber: { contains: filters.search } } },
                { vehicle: { chassisNumber: { contains: filters.search } } },
                { customer: { name: { contains: filters.search } } },
                { jobNumber: { contains: filters.search } }
            ];
        }

        // Specific field filters - these override general search
        if (filters?.vehicleRegistration) {
            where.vehicle = {
                ...(where.vehicle as Prisma.VehicleWhereInput),
                registration: { contains: filters.vehicleRegistration }
            };
        }

        if (filters?.customerName) {
            where.customer = {
                ...(where.customer as Prisma.CustomerWhereInput),
                name: { contains: filters.customerName }
            };
        }

        if (filters?.chassisNumber) {
            where.vehicle = {
                ...(where.vehicle as Prisma.VehicleWhereInput),
                chassisNumber: { contains: filters.chassisNumber }
            };
        }

        if (filters?.vinNumber) {
            where.vehicle = {
                ...(where.vehicle as Prisma.VehicleWhereInput),
                vinNumber: { contains: filters.vinNumber }
            };
        }

        // Build orderBy clause
        const sortOrder = filters?.sortOrder || "desc";
        let orderBy: Prisma.JobOrderByWithRelationInput = { createdAt: sortOrder };

        if (filters?.sortBy) {
            switch (filters.sortBy) {
                case "jobNumber":
                    orderBy = { jobNumber: sortOrder };
                    break;
                case "startDate":
                    orderBy = { startDate: sortOrder };
                    break;
                case "status":
                    orderBy = { status: sortOrder };
                    break;
                case "createdAt":
                    orderBy = { createdAt: sortOrder };
                    break;
                case "updatedAt":
                    orderBy = { updatedAt: sortOrder };
                    break;
                case "estimatedEndDate":
                    orderBy = { estimatedEndDate: sortOrder };
                    break;
                case "actualEndDate":
                    orderBy = { actualEndDate: sortOrder };
                    break;
                default:
                    // Default to createdAt if invalid sortBy is provided
                    orderBy = { createdAt: sortOrder };
            }
        }

        const [data, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: limit,
                include: {
                    vehicle: true,
                    customer: true,
                    insuranceCompany: true,
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
                orderBy
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
                            include: {
                                stepTemplate: true,
                                employee: true
                            }
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

    /**
     * Update a job step's status and handle workflow progression
     * @param stepId - The step to update
     * @param status - New status
     * @param employeeId - Required when status is 'completed' or 'in_progress'
     */
    static async updateStepStatus(
        stepId: number,
        status: "pending" | "in_progress" | "completed" | "skipped",
        employeeId?: number
    ) {
        // Require employeeId for completed or in_progress
        if ((status === "completed" || status === "in_progress") && !employeeId) {
            throw new Error("Employee ID is required when marking step as completed or in_progress");
        }

        return await prisma.$transaction(async (tx) => {
            // Validate employee if provided
            if (employeeId) {
                const employee = await tx.employee.findUnique({ where: { id: employeeId } });
                if (!employee) {
                    throw new Error("Employee not found");
                }
            }

            // 1. Update the step
            const step = await tx.jobStep.update({
                where: { id: stepId },
                data: {
                    status,
                    employeeId: (status === "completed" || status === "in_progress") ? employeeId : null,
                    completedAt: status === "completed" ? new Date() : null
                },
                include: {
                    jobStage: {
                        include: {
                            stage: true,
                            jobSteps: {
                                include: { stepTemplate: true }
                            }
                        }
                    },
                    employee: true
                }
            });

            const jobStage = step.jobStage;

            // 2. Check if all required steps in this stage are completed
            const allSteps = jobStage.jobSteps;
            const allRequiredCompleted = allSteps.every(s => {
                if (s.stepTemplate.isSkippable) {
                    return s.status === "completed" || s.status === "skipped";
                }
                return s.status === "completed";
            });

            if (allRequiredCompleted && !jobStage.isCompleted) {
                // 3. Complete this stage
                await tx.jobStage.update({
                    where: { id: jobStage.id },
                    data: {
                        isCompleted: true,
                        completedAt: new Date()
                    }
                });

                // 4. Unlock next stage if exists
                const nextStage = await tx.jobStage.findFirst({
                    where: {
                        jobId: jobStage.jobId,
                        stage: {
                            orderIndex: jobStage.stage.orderIndex + 1
                        }
                    },
                    include: { stage: true }
                });

                if (nextStage) {
                    await tx.jobStage.update({
                        where: { id: nextStage.id },
                        data: {
                            isLocked: false,
                            startedAt: new Date()
                        }
                    });

                    // Update job status based on new stage
                    await tx.job.update({
                        where: { id: jobStage.jobId },
                        data: { status: nextStage.stage.code as JobStatus }
                    });
                } else {
                    // All stages complete - mark job as done
                    await tx.job.update({
                        where: { id: jobStage.jobId },
                        data: { status: "DONE" }
                    });
                }
            }

            return step;
        });
    }
}
