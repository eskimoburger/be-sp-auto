import type { Prisma, JobStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

export interface VehicleInlineDTO {
    registration: string;   // Required - used for lookup (unique)
    brand: string;          // Required
    model?: string;
    color?: string;
    vinNumber?: string;
    chassisNumber?: string;
}

export interface CustomerInlineDTO {
    name: string;           // Required
    phone?: string;         // Used for lookup (with name)
    address?: string;
}

export interface CreateJobDTO {
    jobNumber?: string; // Auto-generated if not provided
    // Either vehicleId OR vehicle object is required
    vehicleId?: number;
    vehicle?: VehicleInlineDTO;
    // Either customerId OR customer object (optional)
    customerId?: number;
    customer?: CustomerInlineDTO;
    // Other fields
    insuranceCompanyId?: number;
    paymentType?: string;
    excessFee?: number;
    startDate: Date | string;
    estimatedEndDate?: Date | string;
    repairDescription?: string;
    notes?: string;
}

export class JobService {
    static async createJob(data: CreateJobDTO, prismaClient?: PrismaClient) {
        const db = prismaClient ?? prisma;
        // Transaction to ensure all side-effects (stages, steps, photos) are created
        return await db.$transaction(async (tx) => {
            // 0. Auto-generate jobNumber if not provided
            const jobNumber = data.jobNumber || `JOB-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

            // 1. Resolve Vehicle: either by ID or by inline data (find-or-create)
            const { vehicleId, vehicle, customerId, customer, insuranceCompanyId, jobNumber: _unusedJobNumber, ...rest } = data;

            let resolvedVehicleId: number;
            let vehicleCustomerId: number | undefined; // Customer ID from existing vehicle
            let isNewVehicle = false;

            if (vehicleId) {
                // Use provided ID
                const existingVehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
                if (!existingVehicle) { throw new Error("Vehicle not found"); }
                resolvedVehicleId = vehicleId;
                vehicleCustomerId = existingVehicle.customerId ?? undefined;
            } else if (vehicle) {
                // Find by registration or create
                if (!vehicle.registration) { throw new Error("Vehicle registration is required"); }
                // Note: brand is only required if we need to CREATE a NEW vehicle

                const existingVehicle = await tx.vehicle.findUnique({
                    where: { registration: vehicle.registration }
                });

                if (existingVehicle) {
                    resolvedVehicleId = existingVehicle.id;
                    vehicleCustomerId = existingVehicle.customerId ?? undefined;
                } else {
                    isNewVehicle = true;
                    if (!vehicle.brand) { throw new Error("Vehicle brand is required for new vehicles"); }
                    const newVehicle = await tx.vehicle.create({
                        data: {
                            registration: vehicle.registration,
                            brand: vehicle.brand,
                            model: vehicle.model,
                            color: vehicle.color,
                            vinNumber: vehicle.vinNumber,
                            chassisNumber: vehicle.chassisNumber
                        }
                    });
                    resolvedVehicleId = newVehicle.id;
                }
            } else {
                throw new Error("Either vehicleId or vehicle object is required");
            }

            // 2. Resolve Customer
            // - If vehicle exists → use vehicle's customer automatically
            // - If new vehicle → can specify customer inline (find-or-create)
            let resolvedCustomerId: number | undefined;

            if (!isNewVehicle && vehicleCustomerId) {
                // Existing vehicle with customer → use that customer
                resolvedCustomerId = vehicleCustomerId;
            } else if (customerId) {
                // Explicit customer ID provided
                const existingCustomer = await tx.customer.findUnique({ where: { id: customerId } });
                if (!existingCustomer) { throw new Error("Customer not found"); }
                resolvedCustomerId = customerId;

                // Link customer to new vehicle if creating new vehicle
                if (isNewVehicle) {
                    await tx.vehicle.update({
                        where: { id: resolvedVehicleId },
                        data: { customerId: resolvedCustomerId }
                    });
                }
            } else if (customer) {
                // Find by name + phone or create
                if (!customer.name) { throw new Error("Customer name is required"); }

                const existingCustomer = await tx.customer.findFirst({
                    where: {
                        name: customer.name,
                        phone: customer.phone || null
                    }
                });

                if (existingCustomer) {
                    resolvedCustomerId = existingCustomer.id;
                } else {
                    const newCustomer = await tx.customer.create({
                        data: {
                            name: customer.name,
                            phone: customer.phone,
                            address: customer.address
                        }
                    });
                    resolvedCustomerId = newCustomer.id;
                }

                // Link customer to new vehicle if creating new vehicle
                if (isNewVehicle) {
                    await tx.vehicle.update({
                        where: { id: resolvedVehicleId },
                        data: { customerId: resolvedCustomerId }
                    });
                }
            } else if (isNewVehicle) {
                // New vehicle must have customer
                throw new Error("Customer is required when creating a new vehicle");
            }

            // 3. Create the Job
            const job = await tx.job.create({
                data: {
                    paymentType: rest.paymentType,
                    excessFee: rest.excessFee,
                    startDate: rest.startDate,
                    estimatedEndDate: rest.estimatedEndDate,
                    repairDescription: rest.repairDescription,
                    notes: rest.notes,
                    jobNumber,
                    vehicle: { connect: { id: resolvedVehicleId } },
                    customer: resolvedCustomerId ? { connect: { id: resolvedCustomerId } } : undefined,
                    insuranceCompany: insuranceCompanyId ? { connect: { id: insuranceCompanyId } } : undefined
                }
            });

            // 2. Initialize Stages + Steps in bulk to reduce subrequests
            const stages = await tx.stage.findMany({
                orderBy: { orderIndex: "asc" },
                include: { stepTemplates: { orderBy: { orderIndex: "asc" } } }
            });

            await tx.jobStage.createMany({
                data: stages.map((stage) => ({
                    jobId: job.id,
                    stageId: stage.id,
                    isLocked: stage.orderIndex !== 1, // Only the first stage is unlocked
                    isCompleted: false,
                    startedAt: stage.orderIndex === 1 ? new Date() : null
                }))
            });

            const createdJobStages = await tx.jobStage.findMany({
                where: { jobId: job.id },
                select: { id: true, stageId: true }
            });
            const jobStageByStageId = new Map<number, number>(
                createdJobStages.map((js) => [js.stageId, js.id])
            );

            const jobStepsData: Prisma.JobStepCreateManyInput[] = [];
            for (const stage of stages) {
                const jobStageId = jobStageByStageId.get(stage.id);
                if (!jobStageId) { continue; }
                for (const tpl of stage.stepTemplates) {
                    jobStepsData.push({
                        jobStageId,
                        stepTemplateId: tpl.id,
                        status: "pending"
                    });
                }
            }

            if (jobStepsData.length > 0) {
                await tx.jobStep.createMany({ data: jobStepsData });
            }

            // 4. Initialize Photo Requirements (Optional: Based on business rules, here we add all types as optional/required)
            const photoTypes = await tx.photoType.findMany();
            await tx.jobPhoto.createMany({
                data: photoTypes.map((pt) => ({
                    jobId: job.id,
                    photoTypeId: pt.id,
                    isRequired: pt.code === "before_repair" || pt.code === "completed"
                }))
            });

            return job;
        }, { timeout: 15000 });
    }

    static async getAll(
        page: number = 1,
        limit: number = 10,
        filters?: {
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
        },
        prismaClient?: PrismaClient
    ) {
        const db = prismaClient ?? prisma;
        const skip = (page - 1) * limit;

        // Build base where clause (excluding status)
        const whereWithoutStatus: Prisma.JobWhereInput = {};

        // Insurance company filter
        if (filters?.insuranceCompanyId) {
            whereWithoutStatus.insuranceCompanyId = filters.insuranceCompanyId;
        }

        // Job number filter (exact match or partial)
        if (filters?.jobNumber) {
            whereWithoutStatus.jobNumber = {
                contains: filters.jobNumber
            };
        }

        // Date range filter
        if (filters?.startDateFrom || filters?.startDateTo) {
            whereWithoutStatus.startDate = {};
            if (filters.startDateFrom) {
                whereWithoutStatus.startDate.gte = new Date(filters.startDateFrom);
            }
            if (filters.startDateTo) {
                whereWithoutStatus.startDate.lte = new Date(filters.startDateTo);
            }
        }

        // General search filter - searches across multiple fields
        if (filters?.search) {
            whereWithoutStatus.OR = [
                { vehicle: { registration: { contains: filters.search } } },
                { vehicle: { vinNumber: { contains: filters.search } } },
                { vehicle: { chassisNumber: { contains: filters.search } } },
                { customer: { name: { contains: filters.search } } },
                { jobNumber: { contains: filters.search } }
            ];
        }

        // Specific field filters - these override general search
        if (filters?.vehicleRegistration) {
            whereWithoutStatus.vehicle = {
                ...(whereWithoutStatus.vehicle as Prisma.VehicleWhereInput),
                registration: { contains: filters.vehicleRegistration }
            };
        }

        if (filters?.customerName) {
            whereWithoutStatus.customer = {
                ...(whereWithoutStatus.customer as Prisma.CustomerWhereInput),
                name: { contains: filters.customerName }
            };
        }

        if (filters?.chassisNumber) {
            whereWithoutStatus.vehicle = {
                ...(whereWithoutStatus.vehicle as Prisma.VehicleWhereInput),
                chassisNumber: { contains: filters.chassisNumber }
            };
        }

        if (filters?.vinNumber) {
            whereWithoutStatus.vehicle = {
                ...(whereWithoutStatus.vehicle as Prisma.VehicleWhereInput),
                vinNumber: { contains: filters.vinNumber }
            };
        }

        // Create where clause including status for the main query
        const where: Prisma.JobWhereInput = { ...whereWithoutStatus };
        if (filters?.status) {
            where.status = filters.status as JobStatus;
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

        const [data, total, statusGroups] = await Promise.all([
            db.job.findMany({
                where,
                skip,
                take: limit,
                include: {
                    vehicle: {
                        select: { id: true, registration: true, brand: true, model: true, color: true, vinNumber: true, chassisNumber: true }
                    },
                    customer: {
                        select: { id: true, name: true, phone: true }
                    },
                    insuranceCompany: {
                        select: { id: true, name: true }
                    }
                },
                orderBy
            }),
            db.job.count({ where }),
            db.job.groupBy({
                by: ["status"],
                where: whereWithoutStatus,
                _count: { status: true }
            })
        ]);

        // Aggregate status counts - always include all possible statuses
        const statusCounts: { all: number;[key: string]: number } = {
            all: 0,
            CLAIM: 0,
            REPAIR: 0,
            BILLING: 0,
            DONE: 0
        };

        statusGroups.forEach(group => {
            const count = group._count.status;
            statusCounts[group.status] = count;
            statusCounts.all += count;
        });

        return { data, total, page, limit, totalPages: Math.ceil(total / limit), statusCounts };
    }

    static async getJobDetails(id: number, prismaClient?: PrismaClient) {
        const db = prismaClient ?? prisma;
        return await db.job.findUnique({
            where: { id },
            include: {
                vehicle: true,
                customer: true,
                insuranceCompany: true,
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
        employeeId?: number,
        prismaClient?: PrismaClient
    ) {
        const db = prismaClient ?? prisma;
        // Require employeeId for completed or in_progress
        if ((status === "completed" || status === "in_progress") && !employeeId) {
            throw new Error("Employee ID is required when marking step as completed or in_progress");
        }

        return await db.$transaction(async (tx) => {
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
                        data: { status: nextStage.stage.code.toUpperCase() as JobStatus }
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
